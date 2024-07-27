import { exec } from "child_process"

export function getProjectName(): Promise<string> {
  return new Promise((resolve, reject) => {
    exec("gcloud config get-value project", (error, stdout, stderr) => {
      if (error) {
        reject(`Error fetching project name: ${stderr}`)
      } else {
        resolve(stdout.trim())
      }
    })
  })
}
