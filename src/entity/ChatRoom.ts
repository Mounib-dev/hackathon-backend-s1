import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Message } from "./Message";

@Entity()
export class ChatRoom {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name!: string;

  @Column()
  icon!: string;

  @OneToMany(() => Message, (message) => message.room)
  messages!: Message[];
}
