import PhoneNumber from "./PhoneNumber";

/**
 * A person has a name and different contact methods.
 */

class Person {
	public firstName: string;
	public lastName: string;
	public cellPhone: PhoneNumber | null;
	public email: string;
	public slack: string;

	constructor(firstName: string, lastName: string, cellPhone: PhoneNumber | null, email: string, slack: string) {
		this.firstName = firstName;
		this.lastName = lastName;
		this.cellPhone = cellPhone;
		this.email = email;
		this.slack = slack;
	}
}



export default Person;
export { Person }