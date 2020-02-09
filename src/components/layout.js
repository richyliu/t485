/**
 * Layout component that queries for data
 * with Gatsby's StaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/static-query/
 */

import React from "react"
import { StaticQuery, graphql } from "gatsby"
import { Container, Row, Col } from "react-bootstrap"
import Navbar from "./navBar"
import styled from "styled-components"
import BackgroundImage from "gatsby-background-image"

const Layout = ({ children, pageInfo, backgroundImage }) => (
  <StaticQuery
    query={graphql`
      query SiteTitleQuery {
        site {
          siteMetadata {
            title
          }
        }
      }
    `}
    render={function(data) {
      let page = (
        <>
          <Container fluid className="px-0 main">
            <Navbar pageInfo={pageInfo} />
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
                    Troop 485, Silicon Valley Monterey Bay Council, Boy Scouts
                    of America.
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
            fluid={backgroundImage}
            placeholderStyle={{ visibility: "hidden" }}
          >
            {page}
          </BackgroundImage>
        )
      }
    }}
  />
)

export default Layout
