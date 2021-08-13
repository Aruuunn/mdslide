import type { NextApiRequest, NextApiResponse } from "next";
import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";

import { getDb } from "lib/db";

import { Presentation } from "model/presentation";

export default withApiAuthRequired(async function (
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { user } = getSession(req, res);

    if (!user?.email) {
      throw new Error("User Email required");
    }

    const db = await getDb();

    const collection = db.getCollection(Presentation);

    const newPresentation = new Presentation();
    newPresentation.slides = [
      {
        mdContent: `# Slide One \n by ${user.name ?? "Some One"}`,
        bgColor: "#fff",
        fontColor: "#000",
      },
    ];
    newPresentation.title = "Untitled";
    newPresentation.userEmail = user.email;

    const { insertedId } = await collection.insertOne(newPresentation);

    res.json({ id: insertedId.toHexString() });
  } catch (e) {
    console.error(e);
    res.status(500);
  }
});
