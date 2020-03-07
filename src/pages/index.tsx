import React from "react"
import { Container, Button } from "react-bootstrap"
import Layout from "../components/layout/Layout"
import SEO from "../components/layout/seo"
import "../styles/index.scss"
import { graphql, StaticQuery } from "gatsby"

const IndexPage = () => (
  <StaticQuery
    query={graphql`
      query {
        desktop: file(
          relativePath: { eq: "bg_cropped_progressive_darken25.jpg" }
        ) {
          childImageSharp {
            fluid(quality: 100, maxWidth: 1920) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    `}
    render={data => (
      <Layout
        pageName="index"
        backgroundImage={data.desktop.childImageSharp.fluid}
      >
        <SEO
          title="Home"
          keywords={[`Troop 485`, `Scouting`, `Boy Scouts`, `Cupertino`]}
        />
        <Container className="text-center container">
          <header className="major">
            <h1>Troop 485</h1>
            <p>Cupertino, California</p>
            <div>
              <Button variant="outline-light" size="lg" className="cta">
                About Us
              </Button>
              <Button variant="primary" size="lg" className="cta">
                Join Today
              </Button>
            </div>
          </header>
        </Container>
      </Layout>
    )}
  />
)

export default IndexPage
