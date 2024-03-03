import User from "../Models/User.js";
import {Material} from "../Models/Material.js";

export async function CheckForAccess(material,user,access,creatorOfMaterial,role){
    let creator = creatorOfMaterial;
    if(!creator)creator =  await User.findById(material.creator).select('accessInfo');
    let Role = role;
    let accessInfo;
    if(!role){
        const userForRole = await User.findOne({_id:user._id},{_id:0,materials:{$elemMatch:{material:material._id}}})
        accessInfo = creator.accessInfo[userForRole.materials[0].role]
    }else{
        accessInfo = creator.accessInfo[Role];
    }
    // console.log(material._id);
    // console.log(user._id);
    // console.log(material);
    if(access){
        return {ok:accessInfo[access]};
    }else{
        return {access:accessInfo};
    }
}