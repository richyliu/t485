import React, { ReactElement } from "react"
import { Button, Form } from "react-bootstrap"
import Layout from "../../components/layout/Layout"
import SEO from "../../components/layout/seo"
import firebase from "gatsby-plugin-firebase"

const LoginPage = (): ReactElement => {
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const handleSubmit = (): void => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => console.log("done"))
      .catch(e => console.log(e))
  }
  return (
    <Layout>
      <SEO title="Login" />
      <h1>Login</h1>
      <Form onSubmit={(e): void => e.preventDefault()}>
        <Form.Group controlId="authEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter your email..."
            value={email}
            onChange={(e): void => setEmail(e.target.value)}
          />
          <Form.Control.Feedback className="text-muted">
            Error
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="authPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter your password..."
            value={password}
            onChange={(e): void => setPassword(e.target.value)}
          />
          <Form.Control.Feedback className="text-muted">
            Error
          </Form.Control.Feedback>
        </Form.Group>
        <Button block variant="primary" type="submit" onClick={handleSubmit}>
          Login
        </Button>
      </Form>
    </Layout>
  )
}

export default LoginPage
