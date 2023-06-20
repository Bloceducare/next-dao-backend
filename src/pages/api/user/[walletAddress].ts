import connectDB from 'config/db';
import type { NextApiRequest, NextApiResponse } from 'next'
import { getUser } from 'server/services/user';


connectDB()
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const walletAddress = req.query.walletAddress as string
    if (!walletAddress) {
      return res.status(400).json({ error: 'Missing wallet address' })
    }


    if(req.method==="GET"){
        try {          
        
            const user = await getUser(walletAddress)
        
            if (!user) {
              return res.status(404).json({ error: "User not found" });
            }
        
            // Return the user details in the response
            res.json(user);
          } catch (error) {
            console.error(error);
         return   res.status(400).send({
              success: false,
              message: error,
            });
          }
    }
  return  res.status(200).json({ error:"Method not allowed" })

}
