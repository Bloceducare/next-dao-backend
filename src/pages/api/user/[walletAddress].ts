import connectDB from 'config/db';
import type { NextApiRequest, NextApiResponse } from 'next'
import { getUser } from 'server/services/user';
import NextCors from 'nextjs-cors';


class CustomError extends Error {
  statusCode: number
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  
  }
}


connectDB()
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await NextCors(req, res, {
    // Options
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: '*',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
 });
    const walletAddress = String(req.query.walletAddress) as string
   
    if (!walletAddress) {
      throw new CustomError("Missing wallet address",400)     
    }
   
    try{
      if(req.method==="GET"){
        const user = await getUser(walletAddress)
        if(!user){
          throw new CustomError("User not found",404)
        }
        return res.status(200).json(user)

      }

      throw  new CustomError("Method not supported", 405)
    }
    catch(e){      
      return res.status(e?.statusCode ?? 500).json({
        error: {
          message: e?.message ?? "Server error",
        }
      })
    }   
}
