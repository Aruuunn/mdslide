import { Entity } from "lib/entity";
import type { Slide } from "./slide";
import type { Presentation as IPresentation } from "./interfaces/presentation";

@Entity({ name: "presentation" })
export class Presentation implements IPresentation {
  id: string;

  title: string;

  // Uniquely identifies the user.
  // Currently the best way to uniquely identify the user.
  userEmail: string;

  slides: Slide[];
}
