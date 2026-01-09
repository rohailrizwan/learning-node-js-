
import { User } from '../models/user.model.js';
import ApiError from '../utils/apierror.js';
import Apiresponse from '../utils/apiresponse.js';
import { asyncHandler } from '../utils/asynchandler.js';
import { isValidURL, validEmail, validPassword } from '../utils/function.js';

const generateAccessandrefreshtoken = async (userid) => {
  try {
    const userbyid = await User.findById(userid)
    if (userbyid) {
      const accessToken = userbyid.generateAccesstoken()
      const refreshToken = userbyid.generateRefreshtoken()

      userbyid.refreshToken = refreshToken
      await userbyid.save({ validateBeforeSave: false })

      return { accessToken, refreshToken }
    }
  } catch (error) {
    throw new ApiError("something went wrong", 500)
  }
}

const registerUser = asyncHandler(async (req, res) => {
  // 🧾 1. Data frontend se get karo
  const { username, email, password, avatar,lname,role } = req.body;
  console.log(username, email, password, avatar,lname);
  // ✅ 2. Required fields validation
  const requiredFields = [
    { key: 'username', label: 'Username' },
    { key: 'email', label: 'Email' },
    { key: 'password', label: 'Password' },
    { key: 'avatar', label: 'Image' },
    // { key: 'role', label: 'Role' },
  ];

  const ifempty = requiredFields
    .filter(({ key }) => !req.body[key] || req.body[key].trim() === '')
    .map(({ key, label }) => ({
      field: key,
      message: `${label} is required`,
    }));

  if (ifempty?.length > 0) {
    throw new ApiError('Fields are missing', 400, ifempty);
  }

  // 📧 3. Email validation
  if (!validEmail(email)) {
    throw new ApiError('Email is invalid', 400);
  }

  // 🔐 4. Password validation
  if (!validPassword(password)) {
    throw new ApiError('Password length must be at least 8 characters', 400);
  }

  if (!isValidURL(avatar)) {
    throw new ApiError('Invalid image url', 500);
  }

  // 🧍 5. Check if user already exists
  const isUserExist = await User.findOne({ email });
  if (isUserExist) {
    throw new ApiError('User already exists', 400);
  }

  // 🆕 6. Create new user in DB
  const newUser = await User.create({
    username,
    lname,
    email,
    password,
    avatar,
    role
  });

  console.log(newUser);
  

  // 🪙 7. Generate Access Token
  const accessToken = newUser.generateAccesstoken();

  // 🔁 8. (Optional) Generate Refresh Token — comment for now
  // const refreshToken = newUser.generateRefreshToken();
  // newUser.refreshToken = refreshToken;
  // await newUser.save({ validateBeforeSave: false });

  // 🚫 9. Remove sensitive fields from response
  const { password: _, ...userWithoutSensitive } = newUser.toObject();

  // 🍪 10. (Optional) Cookie set karna agar chaho to — abhi skip kiya hai
  // const options = {
  //   httpOnly: true,
  //   secure: process.env.NODE_ENV === 'production',
  //   sameSite: 'strict',
  // };

  // 11. ✅ Final Response (Access Token ke sath)
  return res
    .status(201)
    // .cookie('accessToken', accessToken, options)  // optional
    .json(
      new Apiresponse(
        201,
        'User registered successfully',
        {
          user: userWithoutSensitive,
          accessToken,
          // refreshToken, // optional (commented)
        }
      )
    );
});

// login user


const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  //  1. Basic validation
  if (!email?.trim()) {
    throw new ApiError('Email is required', 400);
  }
  if (!password?.trim()) {
    throw new ApiError(400, 'Password is required', 400);
  }

  //  2. Check if user exists
  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    throw new ApiError('User does not exist', 404);
  }

  //  3. Validate password
  const isValidPassword = await existingUser.isPasswordcorrect(password);
  if (!isValidPassword) {
    throw new ApiError('Invalid password', 401);
  }

  //  4. Generate access and refresh token
  const { accessToken, refreshToken } = await generateAccessandrefreshtoken(existingUser._id);

  //  5. Remove sensitive fields
  const safeUser = await User.findById(existingUser._id).select('-password -refreshToken');

  // 🍪 6. (Optional) Set cookies — better UX for web apps
  // const cookieOptions = {
  //   httpOnly: true,
  //   secure: process.env.NODE_ENV === 'production',
  //   sameSite: 'strict',
  // };
  // res.cookie('accessToken', accessToken, cookieOptions);

  //  7. Final response
  return res.status(200).json(
    new Apiresponse(
      200,
      'User login successfully',
      {
        user: safeUser,
        accessToken,
      }
    )
  );
});

// logout user

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user?._id,
    {
      $unset: { refreshToken: 1 }, // removes the field completely
    },
    { new: true }
  );
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  };

  // return res.status(200).clearCookie("accessToken",cookieOptions).clearCookie("refreshToken",cookieOptions).json(new Apiresponse(200,"User logout successfully"))
  return res.status(200).json(new Apiresponse(200, "User logout successfully"))
})

// change password

const changePassword = asyncHandler(async (req,res)=>{
  const {oldpassword,newpassword,confirm_password} = req.body;

  if(!(newpassword == confirm_password)){
      throw new ApiError("Password not match",404)
  }

  const finduser= await User.findById(req.user._id)
  const isPasswordcorrect = await finduser.isPasswordcorrect(oldpassword)

  if(!isPasswordcorrect){
    throw new ApiError("wrong password",400)
  }
  finduser.password = newpassword

  await finduser.save({validateBeforeSave:false})

  return res.status(200).json(new Apiresponse(200,"password updated successfully"))


})



export { registerUser, loginUser, logoutUser,changePassword };


//const user = await user.findOne({
// $or:[{email,username}]
//})
