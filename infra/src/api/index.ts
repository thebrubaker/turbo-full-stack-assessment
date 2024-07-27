import * as pulumi from "@pulumi/pulumi"
import * as gcp from "@pulumi/gcp"
import * as docker from "@pulumi/docker"

import { createPostgresInstance } from "./postgres"
import { createRedisInstance } from "./redis"
import { createStorage } from "./storage"
import { createRepository } from "./repository"

const stackName = pulumi.getStack()

// Config values for the GCP project.
const gcpConfig = new pulumi.Config("gcp")
const location = gcpConfig.require("region")

// Config values for the API service.
const apiConfig = new pulumi.Config("api")
const imageName = apiConfig.require("imageName")
const containerPort = apiConfig.requireNumber("containerPort")
const cpu = apiConfig.requireNumber("cpu")
const memory = apiConfig.require("memory")
const concurrency = apiConfig.requireNumber("concurrency")

export function createApiService() {
  // Create a compute instance to run postgres
  const { connectionUrl: databaseUrl } = createPostgresInstance()

  // Create a compute instance to run redis
  const { redis } = createRedisInstance()

  // Create a storage bucket that can be accessed by the service.
  const { bucket } = createStorage()

  // Create an Artifact Registry repository
  const { repositoryUrl } = createRepository()

  // Create a container image for the service.
  const image = new docker.Image(`${stackName}-${imageName}`, {
    imageName: pulumi.concat(repositoryUrl, "/", imageName),
    build: {
      context: "../../",
      dockerfile: "../../apps/api/Dockerfile",
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
                name: "DATABASE_URL",
                value: databaseUrl,
              },
              {
                name: "REDIS_HOST",
                value: redis.networkInterfaces[0].networkIp,
              },
              {
                name: "BUCKET_NAME",
                value: bucket.name,
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
    apiBaseUrl: service.statuses.apply(statuses => statuses[0]?.url),
  }
}
