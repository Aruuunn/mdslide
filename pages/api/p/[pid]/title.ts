import { getSession } from '@auth0/nextjs-auth0';
import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import { ObjectId } from "mongodb";
import { Presentation } from './../../../../model/presentation';
import { NextApiRequest, NextApiResponse } from "next";

import { getDb } from "../../../../lib/db";

export default withApiAuthRequired(async function (req: NextApiRequest, res: NextApiResponse) {
    const { user } = getSession(req, res);

    try {
        if (req.method === "PATCH") {
            const {title: newTitle} = req.body;
            const { pid } = req.query;
    
            if (!newTitle) {
                res.status(400).json({message: "title should not be empty"});
            } else {
                const db = await getDb()
                const id = new ObjectId(pid as string);
                const collection = db.getCollection(Presentation);

                const {userEmail} = await collection.findOne<Presentation>({_id: id}, {projection: {userEmail: 1}})

                if (userEmail !== user.email) {
                    res.status(401).json({message: "UnAuthorized"})
                } else {
                    await collection.updateOne({_id: id}, { $set: {
                        title: newTitle
                    } });
        
                    res.json(200);
                }
            }
        } else {
            res.status(404).send({});
        }
    } catch(e) {
        console.error(e);
        res.status(500).send({});
    }
})