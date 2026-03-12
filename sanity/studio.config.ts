import {defineConfig} from "sanity"
import {deskTool} from "sanity/desk"
import {visionTool} from "@sanity/vision"
import {schemaTypes} from "./schemaTypes"

export default defineConfig({
  name: "default",
  title: "Kritvia CMS",
  projectId: "nl1z2yzp",
  dataset: "production",
  plugins: [deskTool(), visionTool()],
  schema: { types: schemaTypes }
})