import React, { Dispatch, ReactElement, SetStateAction } from "react"

import Layout from "../components/layout/Layout"
import SEO from "../components/layout/seo"
import { useAuthState } from "react-firebase-hooks/auth"
import firebase from "gatsby-plugin-firebase"
import { Button, Form, Table } from "react-bootstrap"

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
   * A function to be called each time the editable state changes. This is also called if the user submits, since that is considered a state change as well.
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

const AccountDetails = ({
  editable,
  onEditableChange,
  userData,
}: AccountDetailsProps): ReactElement => {
  const [newEmail, setNewEmail] = React.useState(userData.email || "")
  const [newPassword, setNewPassword] = React.useState("")

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
      <Table>
        <tbody>
          <tr>
            <th>Full Name</th>
            <td>
              {userData.displayName || "Not Set"}
              {editable && (
                <b>
                  {" "}
                  (Please contact the webmaster to change your account name)
                </b>
              )}
            </td>
          </tr>
          <tr>
            <th>Email</th>
            <td>
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
            </td>
          </tr>
          <tr>
            <th>Password</th>
            <td>
              {editable ? (
                <Form.Control
                  placeholder="Enter a new password..."
                  type="password"
                  value={newPassword}
                  onChange={(e): void => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                />
              ) : (
                <>
                  <a onClick={(): void => onEditableChange(true)}>
                    Enter editing mode
                  </a>{" "}
                  to change your password
                </>
              )}
            </td>
          </tr>
          {editable && changes.password && (
            <tr>
              <th>Confirm New Password</th>
              <td>
                {editable ? (
                  <Form.Control
                    placeholder="Confirm Password"
                    type="password"
                    value={newPassword}
                    onChange={(e): void => setNewPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                ) : (
                  <>
                    <a onClick={(): void => onEditableChange(true)}>
                      Enter editing mode
                    </a>{" "}
                    to change your password
                  </>
                )}
              </td>
            </tr>
          )}
          <tr>
            <th>Sign in with google</th>
            <td>
              <a>Disable</a>
            </td>
          </tr>
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
  return (
    <Layout>
      <SEO title="Your Account" />
      <h1>Your Account</h1>
      <p>Hello, {user?.displayName || user?.email}!</p>
      <p>Your Name: {user?.displayName}</p>
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
