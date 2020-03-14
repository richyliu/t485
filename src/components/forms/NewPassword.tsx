import React, { FormEvent, ReactElement } from "react"
import { Form } from "react-bootstrap"
import zxcvbn from "zxcvbn"

const NewPassword = ({
  value,
  onChange,
  name,
  error,
  ...restProps
}: {
  value: string
  onChange: (value: FormEvent) => void
  name: string
  /**
   * Will be displayed only if invalid
   */
  error: string
} & React.HTMLAttributes<HTMLButtonElement>): ReactElement => {
  const feedback = zxcvbn(value, [
    "troop",
    "hoc5",
    "scouting",
    "boy",
    "scouts",
    "95014",
    "cupertino",
    "correcthorsebatterystaple",
  ])

  return (
    <>
      <Form.Group>
        <Form.Control
          placeholder="Enter a new password..."
          type="password"
          value={value}
          autoComplete="new-password"
          onChange={(e): void => onChange(e)}
          name={name}
          {...restProps}
        />
        <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
      </Form.Group>
      {value !== "" && feedback.score > -1 && (
        <>
          <p>
            <b>Strength:</b>{" "}
            <span
              className={`text-${
                ["muted", "danger", "danger", "warning", "warning", "success"][
                  feedback.score + 1
                ]
              }`}
            >
              {
                [
                  "Loading...",
                  "Very Weak",
                  "Weak",
                  "So-So",
                  "Decent",
                  "Strong",
                ][feedback.score + 1]
              }
            </span>
          </p>
          {feedback.feedback.warning !== "" && (
            <p className="text-warning">
              <b>Warning:</b> {feedback.feedback.warning}
            </p>
          )}
          {feedback.feedback.suggestions.length > 0 && (
            <>
              <b>Suggestions:</b>
              <ul>
                {feedback.feedback.suggestions.map((el, i) => (
                  <li key={i}>{el}</li>
                ))}
              </ul>
            </>
          )}
        </>
      )}
    </>
  )
}

export default NewPassword
