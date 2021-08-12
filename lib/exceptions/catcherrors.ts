import { getReasonPhrase, ReasonPhrases, StatusCodes } from 'http-status-codes';
import { NextApiHandler, NextApiResponse } from 'next';
import { NextApiRequest } from 'next';
import { Exception } from './exception';


export const catchErrors: <T>(handler: NextApiHandler<T>)=> NextApiHandler<T> = 
        (handler: NextApiHandler) => async (req: NextApiRequest, res: NextApiResponse) => {
            try {
                await handler(req, res);
            } catch(e: Exception | any) {

                if (typeof e?.code === "number") {
                    res.status(e.code).json({ message: getReasonPhrase(e.code) });
                    return;
                }

                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR })
            }
        }