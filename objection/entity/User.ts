import {Model} from "objection";
import {Profile} from "./Profile";
import {Photo} from "./Photo";

export class User extends Model {
    static get tableName() {
        return 'user';
    }

    static get relationMappings() {
        return {
            profile: {
                relation: Model.HasOneRelation,
                modelClass: Profile,
                join: {
                    from: 'user.profileId',
                    to: 'profile.id'
                }
            },
            photo: {
                relation: Model.HasManyRelation,
                modelClass: Photo,
                join: {
                    from: 'user.id',
                    to: 'photo.userId'
                }
            }
        };
    }
}
