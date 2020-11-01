import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, RelationId} from 'typeorm';
import {User} from './user';
import {IsNotEmpty} from 'class-validator';

@Entity()
export class Deposit {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @IsNotEmpty()
    bankName: string;

    @Column()
    @IsNotEmpty()
    accountNumber: string;

    @Column()
    @IsNotEmpty()
    initialAmount: number;

    @Column()
    @CreateDateColumn()
    @IsNotEmpty()
    startDate: Date;

    @Column()
    @CreateDateColumn()
    @IsNotEmpty()
    endDate: Date;

    @Column()
    @IsNotEmpty()
    interestPercentage: number;

    @Column()
    @IsNotEmpty()
    taxesPercentage: number;

    @ManyToOne(type => User, user => user.deposits)
    user: User;

    @RelationId((deposit: Deposit) => deposit.user)
    @Column({
        nullable: true
    })
    userId: number;
}