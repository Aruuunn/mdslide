import { Entity, ObjectID, ObjectIdColumn, Column } from "typeorm";

export class Slide {
  @Column()
  mdContent: string;

  @Column()
  bgColor: string;

  @Column()
  fontColor: string;

  constructor(mdContent: string, bgColor: string, fontColor: string) {
    this.mdContent = mdContent;
    this.bgColor = bgColor;
    this.fontColor = fontColor;
  }
}
