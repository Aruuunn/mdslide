import { getSession } from '@auth0/nextjs-auth0';
import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import { ObjectId, UpdateFilter } from "mongodb";
import { Presentation } from '../model/presentation';
import { NextApiRequest, NextApiResponse } from "next";

import { getDb } from "./db";


export const patchFieldApi = <T, V>(property: string, getUpdateFilter: (newValue: V, meta: any) =>  UpdateFilter<T> | Partial<T>) =>  
    withApiAuthRequired(async function (req: NextApiRequest, res: NextApiResponse) {
        const { user } = getSession(req, res);

        try {
            if (req.method === "PATCH") {
                const {[property]: newPropertyValue, meta } = req.body;
                const { pid } = req.query;
        
                if (!newPropertyValue) {
                    res.status(400).json({message: `${property} should not be empty`});
                } else {
                    const db = await getDb()
                    const id = new ObjectId(pid as string);
                    const collection = db.getCollection(Presentation);

                    const {userEmail, [property]: oldPropertyValue} = await collection.findOne<Presentation>({_id: id}, {projection: {userEmail: 1, [property]: 1}}) as Record<string, any>;

                    if (typeof oldPropertyValue !== typeof newPropertyValue) {
                        res.status(400).json({message: "type mismatch"});
                        return;
                    }

                    if (userEmail !== user.email) {
                        res.status(401).json({message: "UnAuthorized"})
                    } else {
                        await collection.updateOne({_id: id}, getUpdateFilter(newPropertyValue, meta), {upsert: true});
            
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
