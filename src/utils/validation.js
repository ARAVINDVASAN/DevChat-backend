const validator=require("validator");
const validateSignUpData=(req)=>{

    const{firstName,lastName,emailId,password}=req.body;
    if(!firstName|| !lastName)
    {
        throw new Error("Name is not valid");
    }
    else if(!validator.isEmail(emailId))
    {
        throw new Error("Email id is not valid");

    }
    else if(!validator.isStrongPassword(password))
    {
        throw new Error("PLease enter a Strong password");   
    }
};
const validateEditprofileData=(req)=>
{
    const allowedEditfields=["firstName","lastName","emailId","gender","age","about"];
    const isEditAllowed=Object.keys(req.body).every((field)=>allowedEditfields.includes(field));

   return isEditAllowed;
};
module.exports={validateSignUpData,validateEditprofileData};