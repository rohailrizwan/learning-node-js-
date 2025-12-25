import { contact } from "../models/contact.model.js";
import ApiError from "../utils/apierror.js";
import Apiresponse from "../utils/apiresponse.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { validEmail } from "../utils/function.js";


const addContact = asyncHandler(async (req, res) => {
    const { name, email, phone_number, description, subject } = req.body
    console.log(name, email, phone_number, description, subject);
    
    const requiredFields = [
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'phone_number', label: 'Phone Number' },
        { key: 'description', label: 'Description' },
        { key: 'subject', label: 'subject' },
    ];

    const ifempty = requiredFields.filter(({ key }) => !req.body[key] || req.body[key].trim() === '')?.map(({ key, label }) => ({
        field: key,
        message: `${label} is required`,
    }))

    if (ifempty?.length > 0) {
        throw new ApiError('Fields are missing', 400, ifempty);
    }

    // 📧 3. Email validation
    if (!validEmail(email)) {
        throw new ApiError('Email is invalid', 400);
    }
    
    const newcontact = await contact.create({
        name, email, phone_number, description, subject
    })

    if(newcontact){
        res.status(200).json(new Apiresponse(200,"Contact created successfully",newcontact))
    }
})

export {addContact}