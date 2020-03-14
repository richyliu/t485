import React, { ReactElement } from "react"
import { Button, Form } from "react-bootstrap"
import { navigate } from "gatsby-link"
import Layout from "../../components/layout/Layout"
import SEO from "../../components/layout/seo"
import { Field, Formik, FormikBag } from "formik"
import * as Yup from "yup"
import firebase from "gatsby-plugin-firebase"
import { WindowLocation } from "reach__router"
import AuthContinueState from "../../components/auth/AuthContinueState"
// import {GoogleLoginButton} from "react-social-login-buttons"

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
  const onAuthSuccess = (): void => {
    navigate(continueTo, {
      state: {
        from: "login",
        continueState: continueState || {},
      },
    })
  }

  const handleSubmit = (
    { email, password }: FormData,
    { setSubmitting, setErrors }: FormikBag<FormData, FormData>
  ): void => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(onAuthSuccess)
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
                "An unknown error occurred. Please contact the webmaster. Include the following Reference Data: \n\n" +
                "<<<<<<<<<<! START SUPPORT DATA V1 !>>>>>>>>>>\n" +
                encodeURIComponent(
                  btoa(
                    JSON.stringify({
                      version: "1",
                      code: e.code,
                      message: e.message,
                      date: new Date().getTime(),
                    })
                  )
                )
                  .match(/.{1,50}/g)
                  .join("") +
                "\n<<<<<<<<<<! END SUPPORT DATA V1 !>>>>>>>>>>",
            })
        }
        setSubmitting(false)
      })
  }
  // const GoogleLoginButton = styled(Button)`
  //
  // 	background-color: rgb(203, 63, 34);
  // 	&:hover{
  // 		background-color: rgb(165, 51, 28);
  // 	}
  // 	&:active{
  // 		background-color: red !important;
  // 	}
  // `
  return (
    <>
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
          handleSubmit: (e: React.FormEvent) => void
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
                disabled={isSubmitting}
              />
              <Form.Control.Feedback
                type="invalid"
                style={{
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-all",
                }}
              >
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
                disabled={isSubmitting}
              />
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
            </Form.Group>
            <p>
              <a>Forgot Password</a> | <a>Create Account</a>
            </p>
            <Button
              block
              variant="primary"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Loading..." : "Login"}
            </Button>
          </Form>
        )}
      </Formik>
      {/*<p className="text-divider my-4"><span className="text-divider-inner">OR</span></p>*/}
      {/*<GoogleLoginButton onClick={handleGoogleLogin}*/}
      {/*				   variant={"danger"}*/}
      {/*				   block*/}
      {/*				   className="text-left">*/}
      {/*	<FontAwesomeIcon icon={faGoogle}/>*/}
      {/*	{" "}*/}
      {/*	Login with Google</GoogleLoginButton>*/}
    </>
  )
}

const LoginPage = ({
  location,
}: {
  location: WindowLocation
}): ReactElement => {
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
