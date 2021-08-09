import type {NextApiRequest, NextApiResponse} from "next";
import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";
import {getMongoConnection} from "../../../lib/get-mongo-connection";
import {Presentation} from "../../../model/presentation.entity";

export default  withApiAuthRequired(async function (req: NextApiRequest, res: NextApiResponse) {
    const { user } = getSession(req, res);

    const conn = await getMongoConnection()
    const repository = conn.getMongoRepository(Presentation);

   const presentations = await repository.find({userEmail: user.email});

    res.json(presentations)
})
