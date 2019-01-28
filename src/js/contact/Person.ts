import PhoneNumber from "./PhoneNumber";

/**
 * A person has a name and different contact methods.
 */

class Person {
	public firstName: string;
	public lastName: string;
	public cellPhone: PhoneNumber;
	public email: string
}



export default Person;
export { Person }