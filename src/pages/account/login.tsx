import React, { ReactElement } from "react"
import { Button, Form } from "react-bootstrap"
import { navigate } from "gatsby-link"
import Layout from "../../components/layout/Layout"
import SEO from "../../components/layout/seo"
import { Field, Formik } from "formik"
import * as Yup from "yup"
import firebase from "gatsby-plugin-firebase"
import { WindowLocation } from "reach__router"
import AuthContinueState from "../../components/auth/AuthContinueState"

const LoginForm = ({
  continueTo,
  continueState,
}: {
  continueTo: string
  continueState?: object
}): ReactElement => {
  interface FormData {
    email: string
    password: string
  }

  const schema = Yup.object().shape({
    email: Yup.string()
      .email("The email you entered isn't valid.")
      .required("Please enter an email"),
    password: Yup.string().required("Please enter a password"),
  })

  const handleSubmit = (
    { email, password }: FormData,
    {
      setSubmitting,
      setErrors,
    }: {
      setSubmitting: (submitting: boolean) => void
      setErrors: (errors: object) => void
    }
  ): void => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        setSubmitting(false)
        navigate(continueTo, {
          state: {
            from: "login",
            continueState: continueState || {},
          },
        })
      })
      .catch(e => {
        switch (e.code) {
          case "auth/user-disabled":
            setErrors({
              email:
                "Your account has been disabled. If you believe this is a mistake, please contact the webmaster.",
            })
            break
          case "auth/wrong-password":
            setErrors({
              password: "The password is incorrect.",
            })
            break
          case "auth/user-not-found":
          case "auth/invalid-email":
            setErrors({
              email: "No user exists with that email.",
            })
            break
          default:
            setErrors({
              email:
                "An unknown error occurred. Please contact the webmaster. Reference Code: '" +
                btoa(
                  `code: ${e.code}. message: ${
                    e.message
                  }. Date: ${new Date().getTime()}`
                ) +
                "'",
            })
        }
        setSubmitting(false)
      })
  }
  return (
    <Formik
      validationSchema={schema}
      initialValues={{
        email: "",
        password: "",
      }}
      onSubmit={handleSubmit}
    >
      {({
        errors,
        touched,
        handleSubmit,
        isSubmitting,
      }: {
        errors: { [Field: string]: string }
        touched: { [Field: string]: boolean }
        handleSubmit: (e: React.FormEvent<HTMLFormEvent>) => void
        isSubmitting: boolean
      }): ReactElement => (
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="authEmail">
            <Form.Label>Email address</Form.Label>
            {/*<Form.Control*/}
            {/*    type="email"*/}
            {/*    placeholder="Enter your email..."*/}
            {/*    value={email}*/}
            {/*    onChange={(e): void => setEmail(e.target.value)}*/}
            {/*/>*/}
            <Field
              as={Form.Control}
              name={"email"}
              isInvalid={errors.email && touched.email}
            />
            <Form.Control.Feedback type="invalid">
              {errors.email}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="authPassword">
            <Form.Label>Password</Form.Label>
            <Field
              as={Form.Control}
              name={"password"}
              type="password"
              isInvalid={errors.password && touched.password}
            />
            <Form.Control.Feedback type="invalid">
              {errors.password}
            </Form.Control.Feedback>
          </Form.Group>
          <p>
            <a>Forgot Password</a> | <a>Create Account</a>
          </p>
          <Button block variant="primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Loading..." : "Login"}
          </Button>
        </Form>
      )}
    </Formik>
  )
}

const LoginPage = ({
  location,
}: {
  location: WindowLocation
}): ReactElement => {
  // const [email, setEmail] = React.useState("")
  // const [password, setPassword] = React.useState("")
  // const handleSubmit = (): void => {
  //   firebase
  //     .auth()
  //     .signInWithEmailAndPassword(email, password)
  //     .then(() => console.log("done"))
  //     .catch(e => console.log(e))
  // }
  let continuePath: string
  const continueObj = location?.state as AuthContinueState
  if (continueObj?.return) {
    if (continueObj?.return === true) {
      continuePath = continueObj?.from
    } else {
      continuePath = continueObj?.return
    }
  }
  return (
    <Layout>
      <SEO title="Login" />
      <h1>{continueObj?.message ? "Please login to continue" : "Login"}</h1>
      <LoginForm continueTo={continuePath || "/"} />
    </Layout>
  )
}

export default LoginPage
