import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class Profile {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    phone: string;

    @Column()
    gender: string;
}
