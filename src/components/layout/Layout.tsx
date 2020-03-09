/**
 * Layout component that queries for data
 * with Gatsby's StaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/static-query/
 */

import React from "react"
// import { StaticQuery, graphql } from "gatsby"
import { Col, Container, Row } from "react-bootstrap"
import Navbar from "./Navbar"
// import styled from "styled-components"
import BackgroundImage from "gatsby-background-image"
import "../../styles/style.scss"

interface LayoutProps {
  /**
   * The content of the page. It will be wrapped in a contianer.
   */
  children: React.ReactNode
  /**
   * The path to the current page. It will be used for the navbar.
   */
  pageName?: string
  /**
   * If provided, a background image will be shown instead of the default white background color
   */
  backgroundImage?: string
  /**
   * Whether or not to render the admin layout, which includes the special admin navbar.
   */
  admin?: boolean
}

const Layout = ({
  children,
  pageName,
  backgroundImage,
  admin,
}: LayoutProps): React.ReactElement => {
  const page = (
    <>
      <Container fluid className="px-0 main">
        <Navbar pageName={pageName} admin={admin} />
        <Row noGutters>
          <Col>
            <Container className="mt-5">
              <main>{children}</main>
            </Container>
          </Col>
        </Row>
      </Container>
      <Container fluid className="px-0">
        <Row noGutters>
          <Col className="footer-col">
            <footer>
              <span>
                Copyright © 2006
                {new Date().getFullYear() > 2006
                  ? "-" + new Date().getFullYear()
                  : ""}{" "}
                Troop 485, Silicon Valley Monterey Bay Council, Boy Scouts of
                America.
              </span>
            </footer>
          </Col>
        </Row>
      </Container>
    </>
  )

  if (!backgroundImage) {
    return page
  } else {
    return (
      <BackgroundImage
        Tag="section"
        className={"bg-full"}
        fluid={[backgroundImage]}
      >
        {page}
      </BackgroundImage>
    )
  }
}
// export { Layout };
export default Layout
