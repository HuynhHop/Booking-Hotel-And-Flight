const nodemailer = require("nodemailer");
const sendMail = async (action, { email, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_NAME,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: `"Booking System" <${process.env.EMAIL_NAME}>`,
      to: email,
      subject: action,
      html: html,
    });

    return info;
  } catch (error) {
    console.error("Send mail error:", error);
    throw new Error(error);
  }
};

// const sendMail = async (action, { email, html }) => {
//   await new Promise(resolve => setTimeout(resolve, 200));
//   console.log("📧 SEND TO:", email);
//   return true;
// };

const sendMailRegister = async ({ email, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_NAME,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });
    const info = await transporter.sendMail({
      from: '"Speaking English" <no-reply@speakingen.gmail.com>', // sender address
      to: email, // list of receivers
      subject: "Create Account", // Subject line
      text: "Hello world", // plain text body
      html: html, // html body
    });
    return info;
  } catch (error) {
    throw new Error(error);
  }
};
const sendMailEditProfile = async ({ email, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // Use `true` for port 465, `false` for all other ports
      auth: {
        user: process.env.EMAIL_NAME,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });
    const info = await transporter.sendMail({
      from: '"Speaking English" <no-reply@speakingen.gmail.com>', // sender address
      to: email, // list of receivers
      subject: "Edit Account", // Subject line
      text: "Hello world", // plain text body
      html: html, // html body
    });
    return info;
  } catch (error) {
    throw new Error(error);
  }
};

const sendMailCancelPackage = async ({ email, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // Use `true` for port 465, `false` for all other ports
      auth: {
        user: process.env.EMAIL_NAME,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });
    const info = await transporter.sendMail({
      from: '"Speaking English" <no-reply@speakingen.gmail.com>', // sender address
      to: email, // list of receivers
      subject: "Package Cancelled Notification", // Subject line
      text: "Hello world", // plain text body
      html: html, // html body
    });
    return info;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = { sendMail, sendMailRegister, sendMailEditProfile, sendMailCancelPackage };
