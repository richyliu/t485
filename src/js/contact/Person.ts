import PhoneNumber from "./PhoneNumber";

/**
 * A person has a name and different contact methods.
 */

class Person {
	public firstName: string;
	public lastName: string;
	public cellPhone: PhoneNumber;
	public email: string;
	public slackUsername: string;

	constructor(firstName: string, lastName: string, cellPhone: PhoneNumber, email: string, slackUsername: string) {
		this.firstName = firstName;
		this.lastName = lastName;
		this.cellPhone = cellPhone;
		this.email = email;
		this.slackUsername = slackUsername;
	}
}



export default Person;
export { Person }