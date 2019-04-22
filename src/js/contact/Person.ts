import PhoneNumber from "./PhoneNumber";
import vCard from "vcards-js";
/**
 * A person has a name and different contact methods.
 */

class Person {
	public firstName: string;
	public lastName: string;
	public cellPhone: PhoneNumber;
	public email: string;
	public slack: string;

	constructor(firstName: string, lastName: string, cellPhone: PhoneNumber, email: string, slack: string) {
		this.firstName = firstName;
		this.lastName = lastName;
		this.cellPhone = cellPhone;
		this.email = email;
		this.slack = slack;
	}
	protected getExportObj() {
		let card = vCard();

		card.firstName = this.firstName;
		card.lastName = this.lastName;
		card.cellPhone = this.cellPhone.toString();
		card.email = this.email;
		card.organization = "BSA T485";

		return card;
	}
	public export() {

		return this.getExportObj().getFormattedString();
	}
}



export default Person;
export { Person }