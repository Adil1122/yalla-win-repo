// @ts-ignore
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  // credentials for live
  service: "gmail",
  //port: 587,
  //secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: 'khansahib7090@gmail.com',
    pass: 'kfun qbaa mwpi slno',
  },

  // credentials for local
  /*host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'clifton58@ethereal.email',
        pass: 'EX2QxYNT5gBRgwrbRQ'
    }*/
});

// async..await is not allowed in global scope, must use a wrapper
async function sendEmail(to: String, subject: String, text: String, html: String) {
  // send mail with defined transport object
  console.log(process.env.APP_EMAIL)
  const info = await transporter.sendMail({
    from: {
        name: "Muhammad Adil",
        address: 'adil7090@gmail.com'
    }, // sender address
    to: [to], // list of receivers
    subject: subject, // Subject line
    text: text, // plain text body
    html: html, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}

export default sendEmail;

//main().catch(console.error);

