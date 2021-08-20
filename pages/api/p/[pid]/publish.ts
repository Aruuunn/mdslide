import { UnAuthorizedException } from "./../../../../lib/exceptions/common";
import { ObjectId } from "mongodb";
import { Presentation } from "model/presentation";
import { getDb } from "lib/db";
import { getSession } from "@auth0/nextjs-auth0";
import { NextApiHandler } from "next";
import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { catchErrors } from "lib/exceptions/catcherrors";

const handler: NextApiHandler<{ pubmeta: { slug: string } }> = async (
  req,
  res
) => {
  const { user } = getSession(req, res);
  const { pid } = req.query as { pid: string };

  const db = await getDb();
  const collection = db.getCollection(Presentation);
  const filter = { _id: new ObjectId(pid) };

  const { isPublished, pubmeta, title, userEmail } = await collection.findOne(
    filter,
    { projection: { isPublished: 1, pubmeta: 1, title: 1, userEmail: 1 } }
  );

  if (userEmail !== user.email) {
    throw new UnAuthorizedException();
  }

  if (isPublished) {
    res.json({ pubmeta });
    return;
  }

  const slug = (title as string).toLowerCase() + "_" + pid;

  await collection.updateOne(filter, {
    $set: { pubmeta: { slug }, isPublished: true },
  });

  res.json({ pubmeta: { slug } });
};

export default catchErrors(withApiAuthRequired(handler));
