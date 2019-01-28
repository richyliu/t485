import Person from "./Person";
import PhoneNumber from "./PhoneNumber";


/**
 * A scout is a person with two parents and a home phone.
 */
class Scout extends Person{

	public mother: Person;
	public father: Person;
	public homePhone: PhoneNumber;

	constructor(firstName:string, lastName:string, cellPhone:PhoneNumber, email:string, slack:string, homePhone:PhoneNumber, mother:Person, father:Person) {
		super(firstName, lastName, cellPhone, email, slack);
		this.mother = mother;
		this.father = father;
		this.homePhone = homePhone;
	}
}

export default Scout;
export {Scout};