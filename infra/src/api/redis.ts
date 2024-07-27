import * as pulumi from "@pulumi/pulumi"
import * as gcp from "@pulumi/gcp"

const stackName = pulumi.getStack()

// Config values for the GCP project.
const gcpConfig = new pulumi.Config("gcp")
const location = gcpConfig.require("region")
const project = gcpConfig.require("project")

// Config values for the service.
const apiConfig = new pulumi.Config("api")
const imageName = apiConfig.require("imageName")

// Config values for the Redis database.
const redisConfig = new pulumi.Config("redis")
const redisPassword = redisConfig.require("password")

export function createRedisInstance() {
  // Create a compute instance to run redis
  const redis = new gcp.compute.Instance(`${stackName}-${imageName}-redis`, {
    name: `${stackName}-${imageName}-redis`,
    bootDisk: {
      autoDelete: true,
      deviceName: `${stackName}-${imageName}-redis`,
      initializeParams: {
        image: "projects/cos-cloud/global/images/cos-stable-113-18244-85-54",
        size: 50,
        type: "pd-balanced",
      },
      mode: "READ_WRITE",
    },
    canIpForward: false,
    deletionProtection: false,
    enableDisplay: false,
    labels: {
      "container-vm": "cos-stable-113-18244-85-54",
      "goog-ec-src": "vm_add-tf",
    },
    machineType: "e2-small",
    metadata: {
      "gce-container-declaration": `spec:
  containers:
  - name: ${imageName}-redis
    image: redis:latest
    env:
    - name: REDIS_PASSWORD
      value: ${redisPassword}
    volumeMounts:
    - name: host-path-0
      readOnly: false
      mountPath: /var/lib/redis/data
    stdin: false
    tty: false
  volumes:
  - name: host-path-0
    hostPath:
      path: /var/lib/redis/data
  restartPolicy: Always
# This container declaration format is not public API and may change without notice. Please
# use gcloud command-line tool or Google Cloud Console to run Containers on Google Compute Engine.`,
    },
    networkInterfaces: [
      {
        accessConfigs: [
          {
            networkTier: "PREMIUM",
          },
        ],
        queueCount: 0,
        stackType: "IPV4_ONLY",
        subnetwork: `projects/${project}/regions/${location}/subnetworks/default`,
      },
    ],
    scheduling: {
      automaticRestart: true,
      onHostMaintenance: "MIGRATE",
      preemptible: false,
      provisioningModel: "STANDARD",
    },
    serviceAccount: {
      email: "80404701055-compute@developer.gserviceaccount.com",
      scopes: [
        "https://www.googleapis.com/auth/devstorage.read_only",
        "https://www.googleapis.com/auth/logging.write",
        "https://www.googleapis.com/auth/monitoring.write",
        "https://www.googleapis.com/auth/service.management.readonly",
        "https://www.googleapis.com/auth/servicecontrol",
        "https://www.googleapis.com/auth/trace.append",
      ],
    },
    shieldedInstanceConfig: {
      enableIntegrityMonitoring: true,
      enableSecureBoot: false,
      enableVtpm: true,
    },
    zone: `${location}-a`,
  })

  return { redis }
}
