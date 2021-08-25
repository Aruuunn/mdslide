import { ObjectId } from "mongodb";
import { Presentation } from "model/presentation";
import { getDb } from "lib/db/getDb";
import { NextApiHandler } from "next";
import { catchErrors } from "lib/exceptions/catcherrors";
import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";

const handler: NextApiHandler = async (req, res) => {
  const { user } = getSession(req, res);
  const { pid } = req.query as { pid: string };

  const db = await getDb();
  const collection = db.getCollection(Presentation);

  await collection.updateOne(
    { _id: new ObjectId(pid), userEmail: user.email },
    { $set: { isPublished: false } }
  );

  res.status(200).send("OK");
};

export default withApiAuthRequired(catchErrors(handler));
