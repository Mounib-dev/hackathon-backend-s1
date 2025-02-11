import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  ManyToOne,
} from "typeorm";
import { User } from "./User";

@Entity()
export class Alert {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  priorityLevel: string;

  @Column({ unique: true })
  location: string;

  @ManyToOne(() => User, (user) => user.alerts)
  user!: User;

  constructor(
    title: string,
    description: string,
    priorityLevel: string,
    location: string
  ) {
    this.title = title;
    this.description = description;
    this.priorityLevel = priorityLevel;
    this.location = location;
  }
}
