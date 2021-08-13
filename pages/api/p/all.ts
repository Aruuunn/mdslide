import { Presentation } from "model/presentation";
import { getSession } from "@auth0/nextjs-auth0";
import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { getDb } from "lib/db";
import { mapUnderscoreIdToId } from "lib/mapUnderscoreId";

export default withApiAuthRequired(async function (req, res) {
  const { user } = getSession(req, res);

  const db = await getDb();

  const collection = db.getCollection(Presentation);

  const presentations = await collection
    .find<Presentation>({ userEmail: user.email })
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
});
