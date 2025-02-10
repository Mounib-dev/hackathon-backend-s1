import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  birthDate: Date;

  @Column()
  phoneNumber: string;

  @Column()
  email: string;

  @Column()
  password: string;

  constructor(
    firstName: string,
    lastName: string,
    birthDate: Date,
    phoneNumber: string,
    email: string,
    password: string
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.birthDate = birthDate;
    this.phoneNumber = phoneNumber;
    this.email = email;
    this.password = password;
  }
}
