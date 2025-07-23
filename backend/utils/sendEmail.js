import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  // Create a test account
  const testAccount = await nodemailer.createTestAccount();

  // Create a transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });

  // For production, you would use a real email service like SendGrid, Mailgun, etc.
  // Example for SendGrid:
  /*
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  */

  // Send mail with defined transport object
  const info = await transporter.sendMail({
    from: 'no-reply@yourapp.com', // sender address
    to: options.to, // list of receivers
    subject: options.subject, // Subject line
    html: options.html, // html body
  });

  console.log('Message sent: %s', info.messageId);
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

  return info;
};

export default sendEmail;
