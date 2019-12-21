import {Model} from "objection";

export class Photo extends Model {
    static get tableName() {
        return 'photo';
    }
}
