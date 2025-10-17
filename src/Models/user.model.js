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
      required: false,
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
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});


// for checking password correct
userSchema.methods.isPasswordcorrect = async function(password){
    return await bcrypt.compare(password,this.password)
}
userSchema.methods.generateAccesstoken=function (){
   return jwt.sign({
        _id : this._id,
        email:this.email,
        username:this.username,
    },
    process.env.ACCESS_TOKEN_SECRET,{
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }
)
}
userSchema.methods.generateRefreshtoken = function () {
  return jwt.sign(
    { _id: this._id },
    process.env.ACCESS_TOKEN_REFRESH,
    {
      expiresIn: process.env.ACCESS_REFRESH_EXPIRY,
    }
  );
};

export const user = mongoose.model('user', userSchema);
