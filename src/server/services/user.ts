import User from "@models/user"


export const getUsers =async ()=>{
    const users = await User.find()
    return users;
}

export const getUser =async (walletAddress:string)=>{  
    const user = await User.findOne({ walletAddress });
    return user;
}