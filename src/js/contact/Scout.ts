import Person from "./Person";
import PhoneNumber from "./PhoneNumber";


/**
 * A scout is a person with two parents and a home phone.
 */
class Scout extends Person{

	public mother: Person;
	public father: Person;
	public homePhone: PhoneNumber;
}

export default Scout;
export {Scout};