import React from "react"
import { Link } from "gatsby"

import { Navbar, Nav, Button } from "react-bootstrap"
function NavbarLink(props) {

    return (
          <Link to={"/" + props.page} className="link-no-style">
            <Nav.Link as="span" eventKey={props.page}>
              {props.children}
            </Nav.Link>
          </Link>
    )

}
const CustomNavbar = ({ pageInfo }) => {
  console.log(pageInfo, pageInfo && pageInfo.pageName);
  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg" id="site-navbar">
        {/* <Container> */}
        <Link to="/" className="link-no-style">
          <Navbar.Brand as="span">BSA Troop 485</Navbar.Brand>
        </Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav activeKey={pageInfo && pageInfo.pageName}>
            <NavbarLink page="page-2">Page 2</NavbarLink>
            <NavbarLink page="404">Link Name 2</NavbarLink>
            <NavbarLink page="404">Link Name 3</NavbarLink>
            <Link to="/404" className="link-no-style">
              <Button>Hello</Button>
            </Link>
          </Nav>
        </Navbar.Collapse>
        {/* </Container> */}
      </Navbar>
    </>
  )
}

export default CustomNavbar
