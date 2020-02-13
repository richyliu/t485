module.exports = {
  siteMetadata: {
    title: `Troop 485`,
    description: `The official BSA troop 485 website`,
    author: `Jeffrey Meng`,
  },
  plugins: [
    {
      resolve: "gatsby-plugin-firebase",
      options: {
        features: {
          auth: true,
          database: false,
          firestore: true,
          storage: true,
          messaging: false,
          functions: false,
          performance: false,
        },
        credentials: {
          apiKey: "AIzaSyAjQFEdQmqFBFJsU4wq09CT2BkBOVmTa1o",
          authDomain: "t485-main.firebaseapp.com",
          databaseURL: "https://t485-main.firebaseio.com",
          projectId: "t485-main",
          storageBucket: "t485-main.appspot.com",
          messagingSenderId: "368513727602",
          appId: "1:368513727602:web:8660dddb3081f87e8b16eb"
        }
      },
    },
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
      }
    },
    `gatsby-plugin-postcss`,
    {
      resolve: `gatsby-plugin-nprogress`,
      options: {
        showSpinner: true,
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
}
