import type { NextApiRequest, NextApiResponse } from 'next'
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';

import { getMongoConnection } from "../../../lib/get-mongo-connection"
import {Presentation} from "../../../model/presentation.entity";


export default withApiAuthRequired(async function (req: NextApiRequest, res: NextApiResponse) {
    const {user} = getSession(req, res);


    if (!user?.email) {
        res.status(500);
        console.error("User.Email is empty.",user);
        return;
    }

    const conn = await getMongoConnection();
    const repository = conn.getMongoRepository(Presentation)

    const presentation = await repository.findOne(req.query.pid as string)

    console.log({presentation})

     if (!presentation) {
        res.status(404);
        return
    }

    if (presentation.userEmail !== user.email) {
        res.status(401)
        return
    }

    res.json(presentation);
})
