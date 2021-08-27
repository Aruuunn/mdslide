import { NextApiHandler } from "next";
import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";

import { getDb } from "lib/db/getDb";
import { Presentation } from "model/presentation";
import { catchErrors } from "lib/exceptions/catcherrors";
import { mapUnderscoreIdToId } from "lib/utils/mapUnderscoreId";

const handler: NextApiHandler = async function (req, res) {
  const { user } = getSession(req, res);

  const db = await getDb();

  const collection = db.getCollection(Presentation);

  const presentations = await collection
    .find<Presentation>({ userEmail: user.email })
    .sort({ createdAt: -1 })
    .project({ title: 1, slides: { $slice: 1 } })
    .toArray();

  res.json(
    presentations
      .map((p) => ({
        ...p,
        slides: undefined,
        coverSlide: p.slides[0],
      }))
      .map(mapUnderscoreIdToId)
  );
};

export default catchErrors(withApiAuthRequired(handler));
