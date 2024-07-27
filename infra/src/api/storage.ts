import * as pulumi from "@pulumi/pulumi"
import * as gcp from "@pulumi/gcp"

const stackName = pulumi.getStack()

// Config values for the GCP project.
const gcpConfig = new pulumi.Config("gcp")
const location = gcpConfig.require("region")
const project = gcpConfig.require("project")

// Config values for the API service.
const apiConfig = new pulumi.Config("api")
const imageName = apiConfig.require("imageName")

export function createStorage() {
  // Create a storage bucket that can be accessed by the service.
  const bucket = new gcp.storage.Bucket(`${stackName}-${imageName}`, {
    location,
    project,
    forceDestroy: true,
  })

  return {
    bucket,
  }
}
