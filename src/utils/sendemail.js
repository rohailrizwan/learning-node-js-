import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
})

const sendEmail = async (email, otp) => {
    await transporter.sendMail({
        from: `"Otp System" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Verify your account",
        html: `
      <h2>Email Verification</h2>
      <p>Your OTP is:</p>
      <h1>${otp}</h1>
      <p>OTP valid for 5 minutes</p>
    `,
    })
}

export default sendEmail;