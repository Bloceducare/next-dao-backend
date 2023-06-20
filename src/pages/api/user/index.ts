// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import User from "@models/user"
import Transaction from "@models/transaction"
import { getUsers , getUser} from 'server/services/user'
import { createRouter } from 'next-connect';
import { getTransaction } from 'server/services/transaction';
import connectDB from 'config/db';


connectDB();

// const router = createRouter<NextApiRequest, NextApiResponse>();



export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    if(req.method==="GET"){
        const users = await getUsers(); 
        return  res.json(users);
        // return  res.json({users:["ade"]});
    }

    if(req.method==="POST"){
        const { walletAddress, txnId } = req.body;
        const amount = Number(req.body.amount);
        const currentDate = Date.now();
        if (!walletAddress || !txnId) {
          return res.status(403).json({
            success: false,
            message: "All fields are required",
          });
        }

        try {

            // Find the user with the specified wallet address
            const findUser = getUser(walletAddress)
            const findTx =  getTransaction(txnId)
            let [user, tx] = await Promise.all([findUser, findTx]);
            if (!tx) {
              Transaction.create({
                user: walletAddress,
                txnId,
                amount,
                data: currentDate,
              });
            }
        
            if (user) {
              let updateUser = user;
              if (!tx) {
                updateUser = await User.findOneAndUpdate(
                  { walletAddress },
                  {
                    amount: user.amount + amount,
                    $push: {
                      transactionId: {
                        txnId,
                        amount,
                        date: currentDate,
                      },
                    },
                  }
                );
              }
        
              return res.status(201).send({
                success: true,
                message: "Amount Updated Successfully",
                data: updateUser._doc,
              });
            } else {
              const newUser = await User.create({
                ...req.body,
                transactionId: [
                  {
                    txnId: req.body.txnId,
                    amount,
                    date: currentDate,
                  },
                ],
              });
        
              return res.status(201).send({
                success: true,
                message: "User Details Added Successfully",
                data: newUser._doc,
              });
            }
          } catch (error) {
            console.error(error);
         return   res.status(400).send({
              success: false,
              message: error,
            });
          }

        
    }

   return res.status(200).json({   error:"Method not Allowed" })
    
  }

  
// router.get('/', async (req: NextApiRequest, res: NextApiResponse) => {

// });

// ("/", async (req: NextApiRequest, res: NextApiResponse)=>{
//     const { walletAddress, txnId } = req.body;
//     const amount = Number(req.body.amount);
//     const currentDate = Date.now();
//     if (!walletAddress || !txnId) {
//       return res.status(403).json({
//         success: false,
//         message: "All fields are required",
//       });
//     }

    
// try {

//     // Find the user with the specified wallet address
//     const findUser = getUser(walletAddress)
//     const findTx =  getTransaction(txnId)
//     let [user, tx] = await Promise.all([findUser, findTx]);
//     if (!tx) {
//       Transaction.create({
//         user: walletAddress,
//         txnId,
//         amount,
//         data: currentDate,
//       });
//     }

//     if (user) {
//       let updateUser = user;
//       if (!tx) {
//         updateUser = await User.findOneAndUpdate(
//           { walletAddress },
//           {
//             amount: user.amount + amount,
//             $push: {
//               transactionId: {
//                 txnId,
//                 amount,
//                 date: currentDate,
//               },
//             },
//           }
//         );
//       }

//       return res.status(201).send({
//         success: true,
//         message: "Amount Updated Successfully",
//         data: updateUser._doc,
//       });
//     } else {
//       const newUser = await User.create({
//         ...req.body,
//         transactionId: [
//           {
//             txnId: req.body.txnId,
//             amount,
//             date: currentDate,
//           },
//         ],
//       });

//       return res.status(201).send({
//         success: true,
//         message: "User Details Added Successfully",
//         data: newUser._doc,
//       });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(400).send({
//       success: false,
//       message: error,
//     });
//   }



// })

// export default router.handler({
//     // @ts-ignore
//     onError: (err, req, res, next) => {
//       console.error(err.stack);
//     return  res.status(500).json({
//         error:"Server error"
//       })
//     },
//     onNoMatch: (req, res) => {
//      return res.status(404).json({
//         error:"Method not Allowed"
//      });
//     },
//   });
  
