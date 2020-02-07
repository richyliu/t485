module.exports = {
  siteMetadata: {
    title: `Troop 485`,
    description: `The official BSA troop 485 website`,
    author: `Jeffrey Meng`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-plugin-sass`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Troop 485`,
        short_name: `T485`,
        start_url: `/`,
        icon:`src/favicons/apple-touch-icon-180x180.png`,
        background_color: `#20232a`,
        theme_color: `#20232a`,
        display: `minimal-ui`,
      }
    },
    `gatsby-plugin-postcss`,

    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
}
