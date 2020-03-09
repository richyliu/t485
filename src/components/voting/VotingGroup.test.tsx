import * as React from "react"
import { mount, shallow } from "enzyme"
import toJson from "enzyme-to-json"
import VotingGroup, { VotingGroupProps } from "./VotingGroup"

const defaultProps: Partial<VotingGroupProps> = {
  title: "Title",
  description: "A nice description can go here.",
}

describe("VotingGroup calls onSelectChanged with the proper argument", () => {
  test("with number values", () => {
    const onSelectChange = jest.fn()
    const props: VotingGroupProps = {
      ...defaultProps,
      onSelectChange,
      options: [
        {
          label: "Option One",
          value: 1,
        },
        {
          label: "Option Two",
          value: 2,
        },
        {
          label: "Option Three",
          value: 3,
        },
      ],
    }

    // subject under test
    const sut = shallow(<VotingGroup {...props} />)
    // console.log(sut);
    sut
      .find("#check-0-number-1")
      .simulate("change", { target: { value: "true" } })
    expect(onSelectChange).toHaveBeenNthCalledWith(1, 1)
    sut
      .find("#check-1-number-2")
      .simulate("change", { target: { value: "true" } })
    expect(onSelectChange).toHaveBeenNthCalledWith(2, 2)
    sut
      .find("#check-2-number-3")
      .simulate("change", { target: { value: "true" } })
    expect(onSelectChange).toHaveBeenNthCalledWith(3, 3)
  })
  test("with string values", () => {
    const onSelectChange = jest.fn()
    const props: VotingGroupProps = {
      ...defaultProps,
      onSelectChange,
      options: [
        {
          label: "Option One",
          value: "1",
        },
        {
          label: "Option Two",
          value: "two",
        },
        {
          label: "Option Three",
          value: "thiisareallylongstringvalue",
        },
      ],
    }

    const sut = shallow(<VotingGroup {...props} />)
    // console.log(sut);
    sut
      .find("#check-0-string-1")
      .simulate("change", { target: { value: "true" } })
    expect(onSelectChange).toHaveBeenNthCalledWith(1, "1")
    sut
      .find("#check-1-string-two")
      .simulate("change", { target: { value: "true" } })
    expect(onSelectChange).toHaveBeenNthCalledWith(2, "two")
    sut
      .find("#check-2-string-thiisareallylongstringvalue")
      .simulate("change", { target: { value: "true" } })
    expect(onSelectChange).toHaveBeenNthCalledWith(
      3,
      "thiisareallylongstringvalue"
    )
  })
})
describe("It matches the snapshot", () => {
  test("with title and description", () => {
    const props: VotingGroupProps = {
      ...defaultProps,
      title: undefined,
      description: undefined,
      onSelectChange: () => {
        /* noop */
      },
      options: [
        {
          label: "Option One",
          value: "1",
        },
        {
          label: "Option Two",
          value: 2,
        },
        {
          label: "Option Three",
          value: "thiisareallylongstringvalue",
        },
      ],
      value: ["1", 2],
    }

    const sut = mount(<VotingGroup {...props} />)
    expect(toJson(sut)).toMatchSnapshot()
    // expect(true).toBe(true);
    sut.unmount()
  })
  test("with no title or description", () => {
    const props: VotingGroupProps = {
      ...defaultProps,
      title: undefined,
      description: undefined,
      onSelectChange: () => {
        /* noop */
      },
      options: [
        {
          label: "Option One",
          value: "1",
        },
        {
          label: "Option Two",
          value: 2,
        },
        {
          label: "Option Three",
          value: "thiisareallylongstringvalue",
        },
      ],
      value: ["1", 2],
    }

    const sut = mount(<VotingGroup {...props} />)
    expect(toJson(sut)).toMatchSnapshot()
    // expect(true).toBe(true);
    sut.unmount()
  })
})
