import React from "react"
import Navbar from "./Navbar"
import "../../styles/style.scss"
import { withKnobs, text, boolean, number } from "@storybook/addon-knobs"

export default {
  title: "Layout/Navbar",
  component: Navbar,
  includeStories: [], // don't export any stories from this file, export them from MDX instead
  decorators: [withKnobs],
}

export const basic = () => {
  const pageName = text("Page Name", "")
  return <Navbar pageName={pageName} />
}
export const admin = () => {
  const pageName = text("Page Name", "")
  return <Navbar admin pageName={pageName} />
}
