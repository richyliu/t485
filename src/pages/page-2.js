import React from "react"
import { graphql, Link, StaticQuery } from "gatsby";

import Layout from "../components/layout"
import SEO from "../components/seo"

const SecondPage = () => (
  <StaticQuery
    query={graphql`
      query Image2Query {
       
        desktop: file(relativePath: { eq: "steelhead.jpg" }) {
          childImageSharp {
            fluid(quality: 100, maxWidth: 1920) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    `}
    render = {(data) => (
  <Layout pageInfo={{ pageName: "page-2" }} backgroundImage={data.desktop.childImageSharp.fluid}>
    <SEO title="Page two" />
    <h1>Hi from the second page</h1>
    <p>Welcome to page 2</p>
    <Link to="/">Go back to the homepage</Link>
  </Layout>
)} />);

export default SecondPage
