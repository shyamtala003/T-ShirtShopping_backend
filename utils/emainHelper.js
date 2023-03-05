const nodemailer = require("nodemailer");

const emailHelper = async (options) => {
  try {
    // configure transporte using mailtrap
    let transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER, // generated ethereal user
        pass: process.env.EMAIL_PASS, // generated ethereal password
      },
    });

    const emailContent = {
      from: "shyamtala003@gmail.com", // sender address
      to: options.to, // list of receivers
      subject: options.subject, // Subject line
      text: options.text, // plain text body
      html: options.html, // html body
    };

    await transporter.sendMail(emailContent);
  } catch (error) {
    console.log(error);
  }
};

module.exports = emailHelper;
