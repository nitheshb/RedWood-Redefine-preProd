// import nodemailer from "nodemailer";

// const EMAIL_USER = "chaitanyakrishna7330@gmail.com";
// const EMAIL_PASS = "ubhk rqpf cdej bzew";

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: EMAIL_USER,
//     pass: EMAIL_PASS,
//   },
// });

//  const sendEmail = async (email, userFirstname, resetPasswordLink) => {
//   const mailOptions = {
//     from: EMAIL_USER,
//     to: email,
//     subject: "Reset your Dropbox password",
//     html: `
//       <html>
//         <body style="background-color: #f6f9fc; padding: 10px 0;">
//           <div style="background-color: #ffffff; padding: 45px; border: 1px solid #f0f0f0;">
//             <img src="https://yourdomain.com/static/dropbox-logo.png" width="40" height="33" alt="Dropbox"/>
//               <p>Hi ${userFirstname},</p>
//             <p>Someone recently requested a password change for your Dropbox account. Click below to reset your password:</p>
//             <a href="${resetPasswordLink}" style="background-color: #007ee6; color: white; padding: 10px 20px; text-decoration: none; display: inline-block;">Reset password</a>
//             <p>If you didn't request this, ignore this email.</p>
//           </div>
//         </body>
//       </html>
//     `,
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     return { success: true, message: "Email sent successfully." };
//   } catch (error) {
//     return { success: false, message: "Failed to send email.", error: error.message };
//   }
// };

// export default sendEmail;
