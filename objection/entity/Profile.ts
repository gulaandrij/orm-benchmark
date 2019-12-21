import {Model} from "objection";

export class Profile extends Model {
    static get tableName() {
        return 'profile';
    }
}
