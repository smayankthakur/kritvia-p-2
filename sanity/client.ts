import {createClient} from "next-sanity"

export const client = createClient({
  projectId: "nl1z2yzp",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: true
})