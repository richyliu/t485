import React, { ReactElement } from "react"
import { Form } from "react-bootstrap"

interface VotingGroupProps {
  /**
   * The title of the group.
   */
  title?: string;
  /**
   * The description of the group.
   */
  description?: string;
  /**
   * The options to render. Each option should have a label property dictating what will be
   * shown to the user, and a value property, which will be referenced in events.
   */
  options: {
    /**
     * TEST Label
     */
    label: string;
    value: string | number;
  }[];
  /**
   * An array of values that should be selected.
   */
  value?: (string | number)[];
  /**
   * A function to be called each time the value of an option changes.
   * @param value - The `value` of the option that was changed.
   * @param state - Whether or not the checkbox should now be checked (after the change).
   */
  onSelectChange: (value: string | number, state: boolean) => void;
}

/*
 * TODO
 * Add typedoc and see how that works Maybe even write some way to link typedoc with storybook? Probably not that hard.
 * Re setup storybook because we don't use storybook for gatsby pages, only components.
 */
const VotingGroup = ({
  title,
  description,
  options,
  value,
  onSelectChange,
}: VotingGroupProps): ReactElement => {
  return (
    <div>
      <h4 className="mb-1">{title}</h4>
      <p className="text-muted mb-2 mt-1" hidden={!description}>
        {description}
      </p>
      {options.map((opt, i) => {
        const checked = value?.indexOf(opt.value + "") > -1
        return (
          <Form.Check
            key={i}
            custom
            id={`check-${i}-${typeof opt.value}-${opt.value}`} // required for react bootstrap
            label={opt.label}
            checked={checked}
            onChange={(): void => onSelectChange(opt.value, !checked)}
          />
        )
      })}
    </div>
  )
}
// eslint-disable-next-line no-undef
export {VotingGroup, VotingGroupProps}
export default VotingGroup
