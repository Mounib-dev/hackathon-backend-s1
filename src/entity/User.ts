import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Alert } from "./Alert";
import { ChatbotConversation } from "./ChatbotConversation";
import { Message } from "./Message";
import { Note } from "./Note";

export enum UserRole {
  USER = "user",
  ADMIN = "admin",
}

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

  @Column({ type: "enum", enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Column({ default: false })
  confirmedEmail: boolean;

  @OneToMany(() => Alert, (alert) => alert.user)
  alerts!: Alert[];

  @OneToMany(
    () => ChatbotConversation,
    (chatbotConversation) => chatbotConversation.user
  )
  chatbotConversations!: ChatbotConversation[];

  @OneToMany(() => Message, (message) => message.user)
  messages!: Message[];

  @OneToMany(() => Note, (note) => note.user)
notesReceived!: Note[];

@OneToMany(() => Note, (note) => note.rater)
notesGiven!: Note[];


  constructor(
    firstName: string,
    lastName: string,
    birthDate: Date,
    phoneNumber: string,
    email: string,
    password: string,
    role: UserRole,
    confirmedEmail: boolean
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.birthDate = birthDate;
    this.phoneNumber = phoneNumber;
    this.email = email;
    this.password = password;
    this.role = role;
    this.confirmedEmail = confirmedEmail;
  }
}
