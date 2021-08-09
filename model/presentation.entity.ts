import { Entity, ObjectID, ObjectIdColumn, Column } from "typeorm";
import { Slide } from "./slide";

@Entity({name: "presentation"})
export class Presentation {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  title: string;

  // Uniquely identifies the user.
  // Currently the best way to uniquely identify the user.
  @Column()
  userEmail: string;

  @Column((type) => Slide)
  slides: Slide[];
}
