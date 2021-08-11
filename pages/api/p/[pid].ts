import type { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";
import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";

import { Presentation } from "../../../model/presentation";
import { getDb } from "../../../lib/db";
import { mapUnderscoreIdToId } from "../../../lib/mapUnderscoreId";

export default withApiAuthRequired(async function (
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { user } = getSession(req, res);

  if (!user?.email) {
    res.status(500);
    console.error("User.Email is empty.", user);
    return;
  }

  const db = await getDb();

  const collection = db.getCollection(Presentation);

  const presentation = await collection.findOne<
    Presentation & { _id: ObjectId }
  >({
    userEmail: {
      $eq: user.email,
    },
  });

  if (!presentation) {
    res.status(404);
    return;
  }

  if (presentation.userEmail !== user.email) {
    res.status(401);
    return;
  }

  res.json(mapUnderscoreIdToId(presentation));
});
