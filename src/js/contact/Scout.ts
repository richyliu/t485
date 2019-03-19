import Person from "./Person";
import PhoneNumber from "./PhoneNumber";


/**
 * A scout is a person with two parents and a home phone.
 */
enum Patrol{
	Dragon, Serpent, Blobfish,
	Hawk, Wildcat, Cacti
}
const patrolMap = ["Dragon", "Serpent", "Blobfish", "Hawk", "Wildcat", "Cacti"];
class Scout extends Person {

	public mother: Person;
	public father: Person;
	public homePhone: PhoneNumber;
	public patrol:Patrol;
	public jobs: string[] = [];
	public WFATrained: string;
    [index:string] : any;

	constructor(firstName:string, lastName:string, patrol:Patrol, cellPhone:PhoneNumber, email:string, slack:string, homePhone:PhoneNumber, mother:Person, father:Person) {
		super(firstName, lastName, cellPhone, email, slack);
		this.mother = mother;
		this.father = father;
		this.homePhone = homePhone;
		this.patrol = patrol;
	}
}

export default Scout;
export {Scout, Patrol, patrolMap};