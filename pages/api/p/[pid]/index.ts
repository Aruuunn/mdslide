import { catchErrors } from './../../../../lib/exceptions/catcherrors';
import { UnAuthorizedException, InternalServerException, NotFoundException } from './../../../../lib/exceptions/common';
import type { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import { ObjectId } from "mongodb";
import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";

import { Presentation } from "../../../../model/presentation";
import { getDb } from "../../../../lib/db";
import { mapUnderscoreIdToId } from "../../../../lib/utils/mapUnderscoreId";

const handler: NextApiHandler = async function (
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { user } = getSession(req, res);

  if (!user?.email) {
    console.error("got empty email from session");
    throw new InternalServerException()
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
    throw new NotFoundException()
  }

  if (presentation.userEmail !== user.email) {
    throw new UnAuthorizedException()
  }

  res.json(mapUnderscoreIdToId(presentation));
}

export default catchErrors(withApiAuthRequired(handler));
