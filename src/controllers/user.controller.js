import { user } from '../Models/user.model.js';
import ApiError from '../utils/apierror.js';
import Apiresponse from '../utils/apiresponse.js';
import { asyncHandler } from '../utils/asynchandler.js';
import { validEmail, validPassword } from '../utils/function.js';

const registerUser = asyncHandler(async (req, res) => {
  // 🧾 1. Data frontend se get karo
  const { username, email, password,avatar } = req.body;

  // ✅ 2. Required fields validation
  const requiredFields = [
    { key: 'username', label: 'Username' },
    { key: 'email', label: 'Email' },
    { key: 'password', label: 'Password' },
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
  });

  // 🪙 7. Generate Access Token
  const accessToken = newUser.generateAccesstoken();

  // 🔁 8. (Optional) Generate Refresh Token — comment for now
  // const refreshToken = newUser.generateRefreshToken();
  // newUser.refreshToken = refreshToken;
  // await newUser.save({ validateBeforeSave: false });

  // 🚫 9. Remove sensitive fields from response
  const { password: _,  ...userWithoutSensitive } = newUser.toObject();

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

export { registerUser };
