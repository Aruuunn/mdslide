import { NextApiHandler } from "next";
import { ObjectId, MongoServerError } from "mongodb";
import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";

import { getDb } from "lib/db/getDb";
import { isValidSlug } from "utils/isValidSlug";
import { Presentation } from "model/presentation";
import { catchErrors } from "lib/exceptions/catcherrors";
import { BadRequestException } from "lib/exceptions/common";

const handler: NextApiHandler = async (req, res) => {
  const { user } = getSession(req, res);
  const { pid } = req.query as { pid: string };
  const payload = req.body;

  if (!payload || !isValidSlug(payload.slug)) {
    throw new BadRequestException();
  }

  const db = await getDb();
  const collection = db.getCollection(Presentation);

  try {
    await collection.updateOne(
      { _id: new ObjectId(pid), userEmail: user.email },
      {
        $set: {
          "pubmeta.slug": payload.slug,
        },
      }
    );
  } catch (e) {
    if (e instanceof MongoServerError && e.code === 11000) {
      throw new BadRequestException("not available. try something else");
    } else {
      throw e;
    }
  }

  res.status(200).send("OK");
};

export default catchErrors(withApiAuthRequired(handler));
