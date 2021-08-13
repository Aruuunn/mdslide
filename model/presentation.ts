import { Entity } from "lib/entity";
import { Slide } from "./slide";

@Entity({ name: "presentation" })
export class Presentation {
  id: string;

  title: string;

  // Uniquely identifies the user.
  // Currently the best way to uniquely identify the user.
  userEmail: string;

  slides: Slide[];
}
