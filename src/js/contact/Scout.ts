import Person from "./Person";
import PhoneNumber from "./PhoneNumber";


/**
 * A scout is a person with two parents and a home phone.
 */
enum Patrol {
    Dragon = "DRAGON", Serpent = "SERPENT", Blobfish = "BLOBFISH",
    Hawk = "HAWK", Wildcat = "WILDCAT", Cacti = "CACTI"
}

enum Active {
    Yes = "Y", Rarely = "R", No = "N", AgedOut = "A"
}

class Scout extends Person {

    public mother: Person;
    public father: Person;
    public homePhone: PhoneNumber;
    public patrol: Patrol;
    public jobs: string[] = [];
    public WFATrained: string;
    public joinDate: string;
    public active: Active;

    constructor(firstName: string, lastName: string, patrol: Patrol, cellPhone: PhoneNumber, email: string, slack: string, homePhone: PhoneNumber, mother: Person, father: Person) {
        super(firstName, lastName, cellPhone, email, slack);
        this.mother = mother;
        this.father = father;
        this.homePhone = homePhone;
        this.patrol = patrol;
    }

    public getExportObj() {
        let card = super.getExportObj();
        card.homePhone = this.homePhone ? this.homePhone.toString() : card.homePhone;


        return card;
    }

}

export default Scout;
export { Scout, Patrol, Active };