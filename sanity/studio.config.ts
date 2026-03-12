import {defineConfig} from "sanity"
import {deskTool} from "sanity/desk"
import {visionTool} from "@sanity/vision"
import {schemaTypes} from "./schemaTypes"

export default defineConfig({
  name: "default",
  title: "Kritvia CMS",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "nl1z2yzp",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  plugins: [deskTool(), visionTool()],
  schema: { types: schemaTypes }
})