import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity()
export class Note {
  @PrimaryGeneratedColumn()
  id!: number;

  // Le volontaire qu'on note
  @ManyToOne(() => User, (user) => user.notesReceived, {  nullable: true ,onDelete: "CASCADE" })
  user: User;

  // Celui qui met la note (optionnel)
  @ManyToOne(() => User, (user) => user.notesGiven, { nullable: true, onDelete: "SET NULL" })
  rater?: User;

  // Le nombre d'étoiles
  @Column({ type: "int" })
  rating: number;

  constructor(user: User, rating: number, rater?: User) {
    this.user = user;
    this.rating = rating;
    this.rater = rater;
  }
}
