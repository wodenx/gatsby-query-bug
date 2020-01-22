const path = require('path');
module.exports = {
  siteMetadata: {
    title: `Gatsby Default Starter`,
    description: `Kick off your next, great Gatsby project with this default starter. This barebones starter ships with the main Gatsby configuration files you might need.`,
    author: `@gatsbyjs`,
  },
  plugins: [
  {
    resolve: 'gatsby-transformer-code',
    options: {
      name: 'data',
      extensions: ['json'],
    },
  },
  {
    resolve: 'gatsby-source-filesystem',
    options: {
      name: 'data',
      path: path.resolve('./src/data/'),
    },
  },
  {
    resolve: 'gatsby-source-filesystem',
    options: {
      name: 'templates',
      path: path.resolve('./src/templates/'),
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
  ],
}
