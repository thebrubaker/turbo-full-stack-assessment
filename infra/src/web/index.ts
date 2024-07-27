import * as pulumi from "@pulumi/pulumi"
import * as gcp from "@pulumi/gcp"
import * as docker from "@pulumi/docker"

import { createRepository } from "./repository"

const stackName = pulumi.getStack()

// Config values for the GCP project.
const gcpConfig = new pulumi.Config("gcp")
const location = gcpConfig.require("region")

// Config values for the Web service.
const webConfig = new pulumi.Config("web")
const imageName = webConfig.require("imageName")
const containerPort = webConfig.requireNumber("containerPort")
const cpu = webConfig.requireNumber("cpu")
const memory = webConfig.require("memory")
const concurrency = webConfig.requireNumber("concurrency")

export function createWebService({
  apiBaseUrl,
}: {
  apiBaseUrl: pulumi.Output<string>
}) {
  // Create an Artifact Registry repository
  const { repositoryUrl } = createRepository()

  // Create a container image for the service.
  const image = new docker.Image(`${stackName}-${imageName}`, {
    imageName: pulumi.concat(repositoryUrl, "/", imageName),
    build: {
      context: "../../",
      dockerfile: "../../apps/web/Dockerfile",
      platform: "linux/amd64",
      args: {
        // Cloud Run currently requires x86_64 images
        // https://cloud.google.com/run/docs/container-contract#languages
        DOCKER_DEFAULT_PLATFORM: "linux/amd64",
      },
    },
  })

  // Create a Cloud Run service definition.
  const service = new gcp.cloudrun.Service(`${stackName}-${imageName}`, {
    location,
    template: {
      spec: {
        containers: [
          {
            image: image.repoDigest,
            resources: {
              limits: {
                memory,
                cpu: cpu.toString(),
              },
            },
            ports: [
              {
                containerPort,
              },
            ],
            envs: [
              {
                name: "NEXT_PUBLIC_API_BASE_URL",
                value: apiBaseUrl,
              },
            ],
          },
        ],
        containerConcurrency: concurrency,
        timeoutSeconds: 30,
      },
      metadata: {
        annotations: {
          "run.googleapis.com/network-interfaces":
            '[{"network":"default","subnetwork":"default"}]',
          "run.googleapis.com/vpc-access-egress": "private-ranges-only",
          "autoscaling.knative.dev/minScale": "0",
          "autoscaling.knative.dev/maxScale": "2",
          "run.googleapis.com/startup-cpu-boost": "true",
        },
      },
    },
  })

  // Create an IAM member to allow the service to be publicly accessible.
  new gcp.cloudrun.IamMember(`${stackName}-${imageName}-invoker`, {
    location,
    service: service.name,
    role: "roles/run.invoker",
    member: "allUsers",
  })

  return {
    webBaseUrl: service.statuses.apply(statuses => statuses[0]?.url),
  }
}
