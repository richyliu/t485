import React, { Dispatch, ReactElement, ReactNode, SetStateAction } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import firebase from "gatsby-plugin-firebase"
import { Button, Form, Table } from "react-bootstrap"
import { Layout, SEO } from "../components/layout"
import NewPassword from "../components/forms/NewPassword"
import { navigate } from "gatsby-link"
import AuthContinueState from "../components/auth/AuthContinueState"

const UpdateDisplayNameForm = (): ReactElement => {
  const [user, loading, error] = useAuthState(firebase.auth())
  const [name, setName] = React.useState(user?.displayName || "Loading...")
  if (!user) return <></>

  const handleSubmit = (): void => {
    user
      .updateProfile({
        displayName: name,
        // photoURL: "https://example.com/jane-q-user/profile.jpg"
      })
      .then(function() {
        console.log("DONE")
      })
      .catch(function(error) {
        console.log(error)
      })
  }
}

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
  userData: {
    displayName?: string
    email?: string
  }
}

interface AccountDetailFieldProps {
  name: string
  children: ReactNode
  renderIf?: boolean
}

const AccountDetailField = ({
  name,
  children,
  renderIf,
}: AccountDetailFieldProps): ReactElement => {
  if (renderIf === false) return <></>
  // if renderIf is undefined, don't return nothing

  return (
    <tr>
      <td
        className="w-33"
        style={{
          height: "4em",
          verticalAlign: "middle",
        }}
      >
        {name}
      </td>
      <td
        className="w-66"
        style={{
          height: "4em",
          verticalAlign: "middle",
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
  userData,
}: AccountDetailsProps): ReactElement => {
  const [newEmail, setNewEmail] = React.useState(userData.email || "")
  const [newPassword, setNewPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")

  interface ChangeMap {
    [key: string]: boolean
  }

  const [changes, setChanges]: [
    ChangeMap,
    Dispatch<SetStateAction<ChangeMap>>
  ] = React.useState({
    any: false,
    email: false,
    password: false,
  })
  React.useEffect(() => {
    const newChanges: Partial<ChangeMap> = {}
    newChanges.email = newEmail !== userData.email
    newChanges.password = newPassword !== ""
    newChanges.any = false
    Object.keys(newChanges).forEach(function(key) {
      if (key == "any") return
      if (newChanges[key]) newChanges.any = true
    })
    setChanges(newChanges)
  }, [newEmail, newPassword])

  return (
    <Form onSubmit={(e): void => e.preventDefault()}>
      <Table responsive>
        <tbody>
          <AccountDetailField name={"Full Name"}>
            {userData.displayName || "Not Set"}
            {editable && (
              <b> (Please contact the webmaster to change your account name)</b>
            )}
          </AccountDetailField>
          <AccountDetailField name={"Email"}>
            {editable ? (
              <Form.Control
                placeholder="Enter a new email"
                value={newEmail}
                onChange={(e): void => setNewEmail(e.target.value)}
                autoComplete="new-email"
              />
            ) : (
              <>{userData.email || "Not Set"}</>
            )}
          </AccountDetailField>
          <AccountDetailField name={"Password"} renderIf={editable}>
            <NewPassword
              value={newPassword}
              onChange={(v): void => setNewPassword(v)}
            />
          </AccountDetailField>
          <AccountDetailField name={"Password"} renderIf={!editable}>
            <a onClick={(): void => onEditableChange(true)}>
              Enter editing mode
            </a>{" "}
            to change your password
          </AccountDetailField>
          <AccountDetailField
            name={"Confirm New Password"}
            renderIf={editable && changes.password}
          >
            <Form.Group>
              <Form.Control
                placeholder="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e): void => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                isInvalid={
                  newPassword !== confirmPassword && confirmPassword !== ""
                }
                isValid={
                  newPassword === confirmPassword && confirmPassword !== ""
                }
              />
              <Form.Control.Feedback type="invalid">
                Passwords don&apos;t match!
              </Form.Control.Feedback>
            </Form.Group>
          </AccountDetailField>
          <AccountDetailField name={"Login with Google"}>
            <a>Unlink</a>
          </AccountDetailField>
        </tbody>
      </Table>
      {editable && (
        <>
          {changes.any && (
            <div>
              <h3>Summary of your unsaved changes</h3>
              <ul>
                {changes.password && <li>Password changed</li>}
                {changes.email && (
                  <li>
                    Email changed from {userData.email} to <b>{newEmail}</b>
                  </li>
                )}
              </ul>
            </div>
          )}
          <Button variant="danger" className="">
            Cancel
          </Button>
          <Button
            variant="primary"
            className="float-right"
            disabled={!changes.any}
          >
            {changes.any ? "Save Changes" : "No changes to save"}
          </Button>
        </>
      )}
    </Form>
  )
}
const AccountPage = (): ReactElement => {
  const [user, loading, error] = useAuthState(firebase.auth())
  const [editable, setEditable] = React.useState(false)
  if (!user) {
    navigate("/account/login", {
      state: {
        from: "/account",
        message: true,
        return: true,
      } as AuthContinueState,
    })
  }
  return (
    <Layout>
      <SEO title="Your Account" />
      <h1>Your Account</h1>
      <p>Hello, {user?.displayName || user?.email}!</p>
      <p>Your Name: {user?.displayName}</p>
      {/*TODO: make it so that it clears inputs if you cancel, especially passwor dinput*/}
      <a onClick={(): void => setEditable(old => !old)}>
        {editable ? "Cancel Editing (don't save changes)" : "Edit"}
      </a>
      {user && (
        <AccountDetails
          editable={editable}
          onEditableChange={(value): void => setEditable(value)}
          userData={user}
        />
      )}
    </Layout>
  )
}

export default AccountPage
