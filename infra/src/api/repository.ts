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

export function createRepository() {
  // Create an Artifact Registry repository
  const repository = new gcp.artifactregistry.Repository(
    `${stackName}-${imageName}`,
    {
      description: "Repository for api container images",
      format: "DOCKER",
      location: location,
      repositoryId: `${stackName}-${imageName}`,
    }
  )

  // Form the repository URL
  let repositoryUrl = pulumi.concat(
    location,
    "-docker.pkg.dev/",
    project,
    "/",
    repository.repositoryId
  )

  return {
    repository,
    repositoryUrl,
  }
}
