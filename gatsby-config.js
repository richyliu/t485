module.exports = {
  siteMetadata: {
    title: `Troop 485`,
    description: `The official BSA Troop 485 website, version 2`,
    author: `Jeffrey Meng`,
  },
  plugins: [
    `gatsby-plugin-sass`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: "gatsby-plugin-firebase",
      options: {
        credentials: {
          apiKey: "AIzaSyAjQFEdQmqFBFJsU4wq09CT2BkBOVmTa1o",
          authDomain: "t485-main.firebaseapp.com",
          databaseURL: "https://t485-main.firebaseio.com",
          projectId: "t485-main",
          storageBucket: "t485-main.appspot.com",
          messagingSenderId: "368513727602",
          appId: "1:368513727602:web:8660dddb3081f87e8b16eb",
        },
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,

    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
    `gatsby-plugin-typescript`,
    `gatsby-plugin-postcss`,
  ],
}
