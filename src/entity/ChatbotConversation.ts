import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from "typeorm";
import { User } from "./User";

@Entity()
export class ChatbotConversation {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.chatbotConversations, {
    nullable: true,
  })
  user!: User;

  @Column("jsonb")
  messages!: { role: "user" | "assistant"; content: string }[];

  @CreateDateColumn()
  createdAt!: Date;
}
