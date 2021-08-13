import { UnAuthorizedException, NotFoundException } from "./exceptions/common";
import { BadRequestException } from "lib/exceptions/common";
import { catchErrors } from "lib/exceptions/catcherrors";
import { getSession } from "@auth0/nextjs-auth0";
import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { ObjectId, UpdateFilter } from "mongodb";
import { Presentation } from "../model/presentation";
import { NextApiRequest, NextApiResponse } from "next";
import { getDb } from "./db";

export const patchFieldApi = <T, V>(
  property: string,
  getUpdateFilter: (newValue: V, meta: any) => UpdateFilter<T> | Partial<T>
) =>
  catchErrors(
    withApiAuthRequired(async function (
      req: NextApiRequest,
      res: NextApiResponse
    ) {
      const { user } = getSession(req, res);

      if (req.method !== "PATCH") {
        throw new NotFoundException();
      }
      const { [property]: newPropertyValue, meta } = req.body;
      const { pid } = req.query;

      if (!newPropertyValue)
        throw new BadRequestException(`${property} should not be empty`);

      const db = await getDb();
      const id = new ObjectId(pid as string);
      const collection = db.getCollection(Presentation);

      const { userEmail, [property]: oldPropertyValue } =
        (await collection.findOne<Presentation>(
          { _id: id },
          { projection: { userEmail: 1, [property]: 1 } }
        )) as Record<string, any>;

      if (typeof oldPropertyValue !== typeof newPropertyValue) {
        throw new BadRequestException("type mismatch");
      }

      if (userEmail !== user.email) throw new UnAuthorizedException();

      await collection.updateOne(
        { _id: id },
        getUpdateFilter(newPropertyValue, meta)
      );

      res.json(200);
    })
  );
