import React, { ReactElement, ReactNode } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import firebase from "gatsby-plugin-firebase"
import { Alert, Button, Form, Table } from "react-bootstrap"
import { Layout, SEO } from "../components/layout"
import NewPassword from "../components/forms/NewPassword"
import { navigate } from "gatsby"
import AuthContinueState from "../components/auth/AuthContinueState"
import { Field, Formik, FormikBag } from "formik"
import * as Yup from "yup"
import Mailcheck from "mailcheck"
import { User } from "firebase"

// const UpdateDisplayNameForm = (): ReactElement => {
// 	const [user, loading, error] = useAuthState(firebase.auth())
// 	const [name, setName] = React.useState(user?.displayName || "Loading...")
// 	if (!user) return <></>
//
// 	const handleSubmit = (): void => {
// 		user
// 			.updateProfile({
// 				displayName: name,
// 				// photoURL: "https://example.com/jane-q-user/profile.jpg"
// 			})
// 			.then(function () {
// 				console.log("DONE")
// 			})
// 			.catch(function (error) {
// 				console.log(error)
// 			})
// 	}
// }

interface AccountDetailsProps {
  /**
   * Whether or not the user can edit the information fields.
   */
  editable?: boolean
  /**
   * A function to be called each time the editable state changes. This is also called when the user submits, after their data has been synced with the server.
   * @param newValue
   */
  onEditableChange?: (newValue: boolean) => void
  /**
   * The user data to display.
   */
  user: User

  /**
   * A function to be called when the user cancels their submission.
   */
  onCancel: () => void
}

interface AccountDetailFieldProps {
  name?: string
  children?: ReactNode
  renderIf?: boolean
  /**
   * Used for rendering just a divider.
   */
  empty?: boolean
}

const AccountDetailField = ({
  name,
  children,
  renderIf,
  empty,
}: AccountDetailFieldProps): ReactElement => {
  if (renderIf === false) return <></>
  // if renderIf is undefined, don't return nothing
  if (empty) {
    return (
      <tr>
        <td colSpan={2} />
      </tr>
    )
  }
  return (
    <tr>
      <td
        className="w-33"
        style={{
          height: "5.75em",
          verticalAlign: "middle",
          padding: 0,
        }}
      >
        {name}
      </td>
      <td
        className="w-66"
        style={{
          height: "5.75em",
          verticalAlign: "middle",
          paddingBottom: 0,
        }}
      >
        {children}
      </td>
    </tr>
  )
}

const AccountDetails = ({
  editable,
  onEditableChange,
  user,
  onCancel,
}: AccountDetailsProps): ReactElement => {
  interface FormData {
    newEmail: string
    newPassword: string
    confirmNewPassword: string
  }

  const handleSubmit = (
    { newPassword, confirmNewPassword, newEmail }: FormData,
    { setSubmitting, setErrors }: FormikBag<FormData, FormData>
  ): void => {
    console.log(newPassword, confirmNewPassword, newEmail)

    if (newPassword) {
      if (newPassword !== confirmNewPassword) {
        setErrors({
          confirmNewPassword: "The password you entered doesn't match.",
        })
        setSubmitting(false)
        return
      }
      user
        .updatePassword(newPassword)
        .then(function() {
          // Update successful.
          console.log("DONE")
        })
        .catch(function(error) {
          // An error happened.
          alert("ERROR")
          console.log(error)
        })
    }
  }
  const schema = Yup.object().shape({
    newEmail: Yup.string().email("The email you entered isn't valid."),
    newPassword: Yup.string().min(
      6,
      "Your password isn't at least six characters."
    ),
    confirmNewPassword: Yup.string().oneOf(
      [Yup.ref("newPassword")],
      "The password you entered doesn't match."
    ),
  })

  return (
    <Formik
      validationSchema={schema}
      initialValues={{
        newEmail: user.email || "",
        newPassword: "",
        confirmNewPassword: "",
      }}
      onSubmit={handleSubmit}
    >
      {({
        errors,
        touched,
        handleSubmit,
        values,
        isSubmitting,
        setFieldValue,
        isValid,
      }: {
        errors: { [Field: string]: string }
        touched: { [Field: string]: boolean }
        handleSubmit: (e: React.FormEvent) => void
        values: FormData
        isSubmitting: boolean
        setFieldValue: (
          field: string,
          value: any,
          shouldValidate?: boolean
        ) => void
        isValid: boolean
      }): ReactElement => {
        const changes = {
          newEmail: values.newEmail !== user.email && values.newEmail !== "",
          newPassword: values.newPassword !== "",
          any: false,
        }
        changes.any = changes.newEmail || changes.newPassword

        const emailSuggestion = React.useMemo(
          () =>
            Mailcheck.run({
              secondLevelDomains: [
                "yahoo",
                "hotmail",
                "mail",
                "live",
                "outlook",
                "icloud",
              ],
              email: values.newEmail,
            })?.full,
          [values.newEmail]
        )

        return (
          <Form onSubmit={handleSubmit} className="py-3">
            <Table responsive>
              <tbody>
                <AccountDetailField name={"Full Name"}>
                  {user.displayName || "Not Set"}
                  {editable && (
                    <Form.Text className="text-muted">
                      To change your account name, please contact the webmaster.
                    </Form.Text>
                  )}
                </AccountDetailField>
                <AccountDetailField name={"Email"}>
                  {editable ? (
                    <Form.Group>
                      <Field
                        as={Form.Control}
                        name={"newEmail"}
                        isInvalid={errors.newEmail && touched.newEmail}
                        placeholder={"Enter a new email"}
                      />
                      <Form.Text>
                        {emailSuggestion && (
                          <>
                            Did you mean:{" "}
                            <a
                              onClick={(): void =>
                                setFieldValue("newEmail", emailSuggestion)
                              }
                            >
                              {emailSuggestion}
                            </a>
                            ?
                          </>
                        )}
                      </Form.Text>
                      <Form.Control.Feedback type={"invalid"}>
                        {errors.newEmail}
                      </Form.Control.Feedback>
                      <Form.Text className="text-muted">
                        If you do not want to change your email, either leave
                        this field blank or set it to your current email.
                      </Form.Text>
                    </Form.Group>
                  ) : (
                    <>{user.email || "Not Set"}</>
                  )}
                </AccountDetailField>
                <AccountDetailField name={"Password"} renderIf={editable}>
                  <Form.Group>
                    <Field
                      as={NewPassword}
                      name={"newPassword"}
                      isInvalid={errors.newPassword && touched.newPassword}
                      error={errors.newPassword}
                      placeholder={"Enter a new password"}
                    />
                    <Form.Text className="text-muted">
                      If you do not want to change your password, leave this
                      field blank.
                    </Form.Text>
                  </Form.Group>
                </AccountDetailField>
                <AccountDetailField name={"Password"} renderIf={!editable}>
                  <a onClick={(): void => onEditableChange(true)}>
                    Enter editing mode
                  </a>{" "}
                  to change your password
                </AccountDetailField>
                <AccountDetailField
                  name={"Confirm New Password"}
                  renderIf={editable && !!values.newPassword}
                >
                  <Form.Group>
                    <Field
                      as={Form.Control}
                      name={"confirmNewPassword"}
                      placeholder={"Confirm your new password"}
                      type="password"
                      isInvalid={
                        errors.confirmNewPassword && touched.confirmNewPassword
                      }
                    />

                    <Form.Control.Feedback type="invalid">
                      {errors.confirmNewPassword}
                    </Form.Control.Feedback>
                  </Form.Group>
                </AccountDetailField>
                <AccountDetailField empty />
              </tbody>
            </Table>
            {editable && (
              <>
                {changes.any && (
                  <div>
                    <h3>Summary of your unsaved changes</h3>
                    <ul>
                      {changes.newPassword && (
                        <li>
                          Password changed (
                          <a
                            onClick={(): void => {
                              setFieldValue("newPassword", "")
                              setFieldValue("confirmNewPassword", "")
                            }}
                          >
                            Undo
                          </a>
                          )
                        </li>
                      )}
                      {changes.newEmail && (
                        <li>
                          Email changed from {user.email} to{" "}
                          <b>{values.newEmail}</b> (
                          <a
                            onClick={(): void =>
                              setFieldValue("newEmail", user.email)
                            }
                          >
                            Undo
                          </a>
                          )
                        </li>
                      )}
                    </ul>
                  </div>
                )}
                <Button
                  variant="outline-danger"
                  className=""
                  onClick={(): void => onCancel()}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  type={"submit"}
                  className="float-right"
                  disabled={!changes.any || !isValid}
                >
                  {!changes.any
                    ? "No changes to save"
                    : !isValid
                    ? "Fix errors before saving"
                    : "Save"}
                </Button>
              </>
            )}
          </Form>
        )
      }}
    </Formik>
  )
}
const AccountPage = (): ReactElement => {
  const [user, loading, error] = useAuthState(firebase.auth())
  const [editable, setEditable] = React.useState(false)
  if (!loading && !user) {
    navigate("/account/login", {
      state: {
        from: "/account",
        message: true,
        return: true,
      } as AuthContinueState,
    })
  }
  // React.useEffect(() => {
  // 	if (!user)return;
  // 	user.updateProfile({
  // 		displayName: "Jeffrey Meng",
  // 	}).then(function() {
  // 		// Update successful.
  // 	}).catch(function(error) {
  // 		alert("ERROR");
  // 		console.log(error);
  // 	})
  // }, [user])
  return (
    <Layout>
      <SEO title="Your Account" />
      <h1>Account Settings</h1>
      <p>
        Hello, <b>{user?.displayName}</b>
      </p>
      <Alert variant={"success"} dismissible>
        Your password has been successfully updated.
      </Alert>
      {/*<button onClick={(): void => {*/}
      {/*	*/}
      {/*}}*/}
      {/*>click to reauthenticate*/}
      {/*</button>*/}
      <a onClick={(): void => setEditable(old => !old)}>
        {editable ? "Cancel Editing" : "Edit"}
      </a>

      {user && (
        <AccountDetails
          editable={editable}
          onEditableChange={(value): void => setEditable(value)}
          user={user}
          onCancel={(): void => setEditable(false)}
        />
      )}
    </Layout>
  )
}

export default AccountPage
