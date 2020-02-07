import React from "react"
import { Container, Button } from "react-bootstrap"
import BackgroundImage from "../images/bg_cropped_progressive.jpg"
import Layout from "../components/layout"
import SEO from "../components/seo"
import "../styles/index.scss";

// function fadebg() {
//   document.querySelector("body").classList.add("image-not-loaded")
//   let b = BackgroundImage,
//     c = document.querySelector("body"),
//     img = new Image()
//   img.src = b
//   img.onload = function() {
//     c.classList.add("image-loaded")
//     c.classList.remove("image-not-loaded")
//     c.style.backgroundImage = "url(" + b + ")"
//   }
// }
// if (typeof document !== "undefined") fadebg()

const IndexPage = () => (
  <Layout pageInfo={{ pageName: "index" }} backgroundImage>
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
)

export default IndexPage
