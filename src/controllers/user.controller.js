import { user } from '../Models/user.model.js';
import ApiError from '../utils/apierror.js';
import Apiresponse from '../utils/apiresponse.js';
import { asyncHandler } from '../utils/asynchandler.js';
import { isValidURL, validEmail, validPassword } from '../utils/function.js';

const generateAccessandrefreshtoken = async (userid) => {
  try {
    const userbyid = await user.findById(userid)
    if(userbyid){
      const accessToken = userbyid.generateAccesstoken()
      const refreshToken = userbyid.generateRefreshtoken()
  
      userbyid.refreshToken = refreshToken
      await userbyid.save({ validateBeforeSave: false })
  
      return { accessToken, refreshToken }
    }
  } catch (error) {
    throw new ApiError("something went wrong",500)
  }
}

const registerUser = asyncHandler(async (req, res) => {
  // 🧾 1. Data frontend se get karo
  const { username, email, password, avatar } = req.body;

  // ✅ 2. Required fields validation
  const requiredFields = [
    { key: 'username', label: 'Username' },
    { key: 'email', label: 'Email' },
    { key: 'password', label: 'Password' },
    { key: 'avatar', label: 'Image' },
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
    throw new ApiError('Invalid Url', 500);
  }

  // 🧍 5. Check if user already exists
  const isUserExist = await user.findOne({ email });
  if (isUserExist) {
    throw new ApiError('User already exists', 400);
  }

  // 🆕 6. Create new user in DB
  const newUser = await user.create({
    username,
    email,
    password,
    avatar
  });

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
    throw new ApiError('Email is required',400);
  }
  if (!password?.trim()) {
    throw new ApiError(400, 'Password is required',400);
  }

  //  2. Check if user exists
  const existingUser = await user.findOne({ email });
  if (!existingUser) {
    throw new ApiError('User does not exist',404);
  }

  //  3. Validate password
  const isValidPassword = await existingUser.isPasswordcorrect(password);
  if (!isValidPassword) {
    throw new ApiError('Invalid password',401);
  }

  //  4. Generate access and refresh token
  const { accessToken, refreshToken } = await generateAccessandrefreshtoken(existingUser._id);

  //  5. Remove sensitive fields
  const safeUser = await user.findById(existingUser._id).select('-password -refreshToken');

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



export { registerUser,loginUser };


//const user = await user.findOne({
// $or:[{email,username}]
//})
