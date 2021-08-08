import type { NextApiRequest, NextApiResponse } from 'next'
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';

import { getMongoConnection } from "../../../lib/get-mongo-connection"
import {Presentation} from "../../../model/presentation.entity";


export default withApiAuthRequired(async function (req: NextApiRequest, res: NextApiResponse)  {
    if (req.method !== 'POST') {
        res.status(404);
        return;
    }

    try {
        const { user } = getSession(req, res);

        if (!user?.email) {
            throw new Error("User Email required")
        }

        const connection = await getMongoConnection()
        const repository = await connection.getMongoRepository(Presentation)

        const newPresentation = new Presentation()
        newPresentation.slides = [ {mdContent: `# Slide One \n by ${user.name ?? "Some One"}`, bgColor: "#fff", fontColor: "#000"} ]
        newPresentation.title = "Untitled";
        newPresentation.userEmail = user.email;

        const savedPresentation =  await repository.save(newPresentation)

        res.json({id: savedPresentation.id})
    } catch (e) {
        console.error(e);
        res.status(500);
    }
});
