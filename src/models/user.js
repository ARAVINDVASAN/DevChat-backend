const mongoose=require("mongoose");
const validator=require("validator");
//schema is created

const userSchema=mongoose.Schema({

    firstName:{
        type:String,
        required:true
        ,minLength:4,
        maxLength:50
    },
    lastName:{
        type:String,
        required:true
    },
    
    emailId:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        validate(value)
        {
            if(!validator.isEmail(value))
            {
                throw new Error("Invalid email");
            }
        }
    },
    password:{
        type:String,
        required:true,
        validate(value)
        {
            if(!validator.isStrongPassword(value))
            {
                throw new Error("Invalid email");
            }
        }
    }
    ,
    age:{
        type:Number,
        required:true
    }
    ,
    gender:{
        type:String,
        required:true,
        validate(value)
        {
            if(!["male","female","other"].includes(value))
            {
                throw new Error("GENDER DATA IS NOT VALID ");
            }
        },
    },
    photoUrl:{
        type:String
    },about:{
        type:String,
        default:"This is a default about of the user",

    },
   },{timestamps:true});

const User=mongoose.model("User",userSchema);
module.exports=User;