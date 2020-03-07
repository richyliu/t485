import React from "react"
import { Form } from "react-bootstrap"

interface VotingGroupProps {
  /**
   * The title of the group.
   */
  title?: string
  /**
   * The description of the group.
   */
  description?: string
  /**
   * The options to render. Each option should have a label property dictating what will be
   * shown to the user, and a value property, which will be referenced in events.
   */
  options: {
    /**
     * TEST Label
     */
    label: string
    value: string | number
  }[]
  /**
   * An array of values that should be selected.
   */
  selected?: string[]
  /**
   * A callback onselect.
   * @param value
   */
  onSelect: (value: string) => undefined
}
export const VotingGroup = ({
  title,
  description,
  options,
}: VotingGroupProps) => {
  return (
    <div>
      <h4>{title}</h4>
      <p>{description}</p>
      {options.map((opt, i) => (
        <Form.Check
          custom
          id={`check-${i}-${opt.value}, "")}`} // required for react bootstrap
          label={opt.label}
        />
      ))}
    </div>
  )
}
export default VotingGroup
