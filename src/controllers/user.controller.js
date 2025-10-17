import ApiError from "../utils/apierror.js";
import { asyncHandler } from "../utils/asynchandler.js";

const registerUser = asyncHandler(async (req, res) => {
    // step get data from frontend
    const { username, email, password } = req.body

    // validation

    const requiredFields = [
        { key: "username", label: "Username" },
        { key: "email", label: "Email" },
        { key: "password", label: "Password" },
    ];
    const ifempty = requiredFields.filter(({ key }) => req.body[key].trim() == "" || !req.body[key]).map(({ key, label }) => (
        {
            field: key,
            message: `${label} is req`
        }
    ))

    if (ifempty?.length > 0) {
        throw new ApiError("Fields are missing", 400,ifempty)

    }
    // return res.status(400).json({
    //     success: false,
    //     message: "All fields are req",
    // });

    // check user existence
    // check for imaages
    // create user obj or entry in db
    // remove password and refresh token field
    // check user creation response

});

export { registerUser };
