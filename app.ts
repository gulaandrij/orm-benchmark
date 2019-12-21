import express = require('express');
import {createConnection} from "typeorm";
import {User} from "./typeorm/entity/User";
import {User as OUser} from "./objection/entity/User";
import {Profile} from "./typeorm/entity/Profile";
import {Photo} from "./typeorm/entity/Photo";

const {Model} = require('objection');
const Knex = require('knex');

// Create a new express application instance
const app: express.Application = express();

const connection = createConnection();

const knex = Knex({
    client: 'pg',

    useNullAsDefault: true,
    connection: 'postgres://postgres:root@localhost:5433/bench',
});
Model.knex(knex);

app.get('/typeorm/create', (req, res) => {
    connection.then(async connection => {

        for (let i = 0; i < 1000; i++) {

            const profile: Profile = new Profile();
            profile.gender = 'm';
            profile.phone = '1234567';
            await connection.manager.save(profile);

            const photo1 = new Photo();
            photo1.name = "me.jpg";
            await connection.manager.save(photo1);

            const photo2 = new Photo();
            photo2.name = "me-and-bears.jpg";
            await connection.manager.save(photo2);

            const user = new User();
            user.firstName = "Timber";
            user.lastName = "Saw";
            user.age = 25;
            user.profile = profile;
            user.photos = [photo1, photo2];
            await connection.manager.save(user);

            console.log(user);
        }
    }).catch(error => console.log(error));

    return res.send('1');
});

app.get('/objection', async (req, res) => {
    OUser.query()
        .findById(getRandomInt(1000))
        .then(value => res.send(value))
});

app.get('/objection/eager', async (req, res) => {
    OUser.query()
        .findById(getRandomInt(1000))
        .withGraphFetched('[profile, photo]')
        .then(value => res.send(value))
});

app.get('/typeorm', (req, res) => {
    let result;
    connection.then(async con => {
        result = await con.getRepository(User).createQueryBuilder('u')
            .where('u.id = :id', {id: getRandomInt(1000)})
            .getOne();
        res.send(result);
    });
});

app.get('/typeorm/eager', (req, res) => {
    let result;
    connection.then(async con => {
        result = await con.getRepository(User).createQueryBuilder('u')
            .where('u.id = :id', {id: getRandomInt(1000)})
            .leftJoinAndSelect('u.profile', 'p')
            .leftJoinAndSelect('u.photos', 'ph')
            .getOne();
        res.send(result);
    });
});

app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
});


function getRandomInt(max) {
    const min = 1;
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
