import { ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";

import Slide from "model/slide";
import { getDb } from "lib/db/getDb";
import { Presentation } from "model/presentation";
import { catchErrors } from "lib/exceptions/catcherrors";

const handler: NextApiHandler = async function (
  req: NextApiRequest,
  res: NextApiResponse<{ id: string }>
) {
  const { user } = getSession(req, res);

  if (!user?.email) {
    throw new Error("User Email required");
  }

  const db = await getDb();
  const collection = db.getCollection(Presentation);

  const newPresentation = new Presentation();
  newPresentation.slides = [
    {
      _id: new ObjectId(),
      id: "",
      mdContent: `# Slide One \n\n by ${user.name ?? "Unknown"}`,
      bgColor: "#fff",
      fontColor: "#000",
      fontFamily: "Inter",
    } as Slide,
  ];
  newPresentation.title = "Untitled";
  newPresentation.userEmail = user.email;
  newPresentation.createdAt = new Date().toISOString();

  const { insertedId } = await collection.insertOne(newPresentation);

  res.json({ id: insertedId.toHexString() });
};

export default catchErrors(withApiAuthRequired(handler));
