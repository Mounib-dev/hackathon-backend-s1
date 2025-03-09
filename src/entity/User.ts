import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Alert } from "./Alert";
import { ChatbotConversation } from "./ChatbotConversation";

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

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Alert, (alert) => alert.user)
  alerts!: Alert[];

  @OneToMany(
    () => ChatbotConversation,
    (chatbotConversation) => chatbotConversation.user
  )
  chatbotConversations!: ChatbotConversation[];

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
