import React from "react"
import { Row, ButtonToolbar, Container, Button } from "react-bootstrap"

import Layout from "../components/layout"
import SEO from "../components/seo"
import "../styles/index.scss";

const IndexPage = () => (
  <Layout pageInfo={{ pageName: "index" }}>
    <SEO title="Home" keywords={[`Troop 485`, `Scouting`, `Boy Scouts`, `Cupertino`]} />
    <Container className="text-center container">

          <header className="major">
            <h1>Troop 485</h1>
            <p>Cupertino, California</p>
            <div>
              <Button variant="outline-light" size="lg" className="cta">About Us</Button>
              <Button variant="success" size="lg" className="cta">Join Today</Button>
            </div>
          </header>

    </Container>
  </Layout>
)

export default IndexPage
