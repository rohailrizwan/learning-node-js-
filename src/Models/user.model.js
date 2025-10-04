import mongoose from 'mongoose';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs';
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      //   index:true // for searching
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true,'Password is required'],
    },
    avatar: {
      type: String, // cliudinary url
      required: true,
    },
    coverimage: {
      type: String, // cliudinary url
      required: false,
    },
    watchhistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'video',
      },
    ],
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true },
);
// for becrypt password before save
userSchema.pre(("save"),async(next)=>{
    if(this.isModified("password")){
        this.password = bcrypt.hash(this.password,10)
        next()
    }
    next()
})

// for checking password correct
userSchema.methods.isPasswordcorrect = async function(password){
    return await bcrypt.compare(password,this.password)
}
userSchema.methods.generateAccesstoken=function (){
    jwt.sign({
        _id : this._id,
        email:this.email,
        username:this.username,
    },
    process.env.ACCESS_TOKEN_SECRET,{
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }
)
}
userSchema.methods.generateRefreshtoken=function (){}
export const user = mongoose.model('user', userSchema);
