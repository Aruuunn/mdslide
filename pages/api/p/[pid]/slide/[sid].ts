import { catchErrors } from "./../../../../../lib/exceptions/catcherrors";
import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { ObjectId } from "mongodb";
import { getDb } from "lib/db/getDb";
import { getSession } from "@auth0/nextjs-auth0";
import { NextApiHandler } from "next";
import { BadRequestException } from "lib/exceptions/common";
import { Presentation } from "model/presentation";
import { isValidSlide } from "lib/utils/isValidSlide";

const handler: NextApiHandler = async (req, res) => {
  const { user } = getSession(req, res);

  const { sid, pid } = req.query as { sid: string; pid: string };

  const { slide } = req.body;

  if (!isValidSlide(slide)) {
    throw new BadRequestException();
  }

  const db = await getDb();
  const collection = db.getCollection(Presentation);
  const filter = { _id: new ObjectId(pid), userEmail: user.email };

  if (sid === "new") {
    const id = new ObjectId();
    collection.updateOne(filter, { $push: { slides: { ...slide, _id: id } } });
    res.json({ id: id.toHexString() });
    return;
  }

  await collection.updateOne(
    filter,
    { $set: { "slides.$[slide]": { ...slide, _id: new ObjectId(sid) } } },
    { arrayFilters: [{ "slide._id": new ObjectId(sid) }] }
  );

  res.json(200);
};

export default withApiAuthRequired(catchErrors(handler));
