import {Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Deposit} from './deposit';
import {IsEmail, IsNotEmpty, Length} from 'class-validator';
import bcrypt from 'bcryptjs'

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Length(4, 20)
    name: string;

    @Column()
    @IsEmail()
    @Length(4, 100)
    email: string;

    @Column()
    @Length(4, 100)
    password: string;

    @Column()
    @IsNotEmpty()
    role: string = 'NORMAL';

    @Column({
        default: false
    })
    isDeleted: boolean = false;

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @CreateDateColumn()
    updatedAt: Date;

    @OneToMany(type => Deposit, deposit => deposit.user)
    deposits: Deposit[];

    checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
        return bcrypt.compareSync(unencryptedPassword, this.password);
    }

    hashPassword() {
        this.password = bcrypt.hashSync(this.password, 8);
    }

    serialize() {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
            role: this.role,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        }
    }
}