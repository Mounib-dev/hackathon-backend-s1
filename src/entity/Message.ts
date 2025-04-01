import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { User } from "./User";
import { ChatRoom } from "./ChatRoom";

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.messages)
  user!: User;

  @ManyToOne(() => ChatRoom, (room) => room.messages)
  room!: ChatRoom;

  @Column()
  text!: string;

  @Column({ nullable: true })
  fileUrl?: string;

  @CreateDateColumn()
  createdAt!: Date;
}
