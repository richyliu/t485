module.exports = {
  stories: ["../src/**/*.(stories|story).(jsx?|tsx?|mdx)"],
  addons: [
    "@storybook/preset-typescript",
    "@storybook/addon-docs",
    "@storybook/addon-actions",
    "@storybook/addon-options",
    "@storybook/addon-knobs",
    "@storybook/addon-links",
    `@storybook/addon-storysource`,
  ],
}
