import * as pulumi from "@pulumi/pulumi"

import { createApiService } from "./api"
import { createWebService } from "./web"

const gcpConfig = new pulumi.Config("gcp")

const { apiBaseUrl } = createApiService()
const { webBaseUrl } = createWebService({ apiBaseUrl: apiBaseUrl })

export const project = gcpConfig.require("project")
export const apiUrl = apiBaseUrl
export const webUrl = webBaseUrl
