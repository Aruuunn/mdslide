import { Slide } from "model/slide";

export interface Presentation {
  id: string;

  title: string;

  userEmail: string;

  slides: Slide[];

  isPublished: boolean;

  createdAt: string;

  pubmeta?: { slug: string };
}

export default Presentation;
