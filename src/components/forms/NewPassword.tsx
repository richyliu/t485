import React, { ReactElement } from "react"
import { Form } from "react-bootstrap"
import zxcvbn from "zxcvbn"

const NewPassword = ({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}): ReactElement => {
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
      <Form.Control
        placeholder="Enter a new password..."
        type="password"
        value={value}
        onChange={(e): void => onChange(e.target.value)}
      />

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
