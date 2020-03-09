import React, { ReactElement, ReactNode } from "react"
import { Link } from "gatsby"
import { navigate } from "gatsby-link"
import { Nav, Navbar as BootstrapNavbar } from "react-bootstrap"

function NavbarLink(props: {
  page: string
  children: ReactNode
}): ReactElement {
  // Gatsby link element doesn't work well with our storybook config
  return (
    <>
      {/*<Link to={"/" + props.page} className="link-no-style">*/}
      <Nav.Link
        eventKey={props.page}
        onClick={(): void => {
          navigate("/" + props.page)
        }}
      >
        {props.children}
      </Nav.Link>
      {/*</Link>*/}
    </>
  )
}

interface PropDef {
  /**
   * The name of the page that should be active. This should be the path to the page.
   * For example, on a page /navbarDemo, the value should be `/navbarDemo`. This is used to determine which nav link should be highlighted.
   */
  pageName?: string
  /**
   * Whether or not the admin variant of the navbar should be rendered instead of the normal component.
   */
  admin?: boolean
}

export const Navbar = ({ pageName, admin }: PropDef): ReactElement => {
  return (
    <>
      <BootstrapNavbar bg="dark" variant="dark" expand="lg" id="site-navbar">
        {/* <Container> */}
        <Link to="/" className="link-no-style">
          <BootstrapNavbar.Brand as="span">
            BSA Troop 485{" "}
            {admin ? <span style={{ color: "#99ccff" }}>| Admin</span> : <></>}
          </BootstrapNavbar.Brand>
        </Link>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse
          id="basic-navbar-nav"
          className="justify-content-end"
        >
          <Nav activeKey={pageName}>
            <NavbarLink page="/page-2">Page 2</NavbarLink>
            <NavbarLink page="/404">Link Name 2</NavbarLink>
            <NavbarLink page="/plc/voting/admin">PLC Admin</NavbarLink>
            {/*<Link to="/plc/voting/vote" className="link-no-style">*/}
            {/*  <Button>PLC Voting</Button> /!* TODO: delete *!/*/}
            {/*</Link>*/}
          </Nav>
        </BootstrapNavbar.Collapse>
        {/* </Container> */}
      </BootstrapNavbar>
    </>
  )
}
export default Navbar
