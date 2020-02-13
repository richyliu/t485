import React from "react"
import { Link } from "gatsby"

import { Navbar, Nav, Button } from "react-bootstrap"
import { useFirebase } from "gatsby-plugin-firebase";
function NavbarLink(props) {
  return (
    <Link to={"/" + props.page} className="link-no-style">
      <Nav.Link as="span" eventKey={props.page}>
        {props.children}
      </Nav.Link>
    </Link>
  )
}
const CustomNavbar = ({ pageInfo, admin }) => {
  console.log(pageInfo, pageInfo && pageInfo.pageName);
  const [PLCVotingOpen, setPLCVotingOpen] = React.useState(false);
  useFirebase((firebase) => {
    firebase.firestore()
      .collection("plcvoting")
      .doc("metadata")
      .get()
      .then((data) => {
        setPLCVotingOpen(data.data().open);
        console.log(data.data());
      })
  }, []);
  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg" id="site-navbar">
        {/* <Container> */}
        <Link to="/" className="link-no-style">
          <Navbar.Brand as="span">BSA Troop 485 {admin ? <span style={{color:"#99ccff"}}>| Admin</span> : <></>}</Navbar.Brand>
        </Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav activeKey={pageInfo && pageInfo.pageName}>
            <NavbarLink page="page-2">Page 2</NavbarLink>
            <NavbarLink page="404">Link Name 2</NavbarLink>
            <NavbarLink page="plc/voting/admin">PLC Admin</NavbarLink>
            <Link to="/plc/voting/vote" className="link-no-style" hidden={!PLCVotingOpen}>
              <Button>PLC Voting</Button>
            </Link>
          </Nav>
        </Navbar.Collapse>
        {/* </Container> */}
      </Navbar>
    </>
  )
}

export default CustomNavbar
