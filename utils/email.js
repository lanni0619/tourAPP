const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

// new Email(user, url).sendWelcome()

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Roy Wang🤠 <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'development') {
      return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false, // Use `true` for port 465, `false` for all other ports
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
    }
    // Production Mode: Brevo Transport
    return nodemailer.createTransport({
      service: 'Brevo',
      host: process.env.BREVO_SMTP_SERVER,
      port: process.env.BREVO_SMTP_PORT,
      auth: {
        user: process.env.BREVO_SMTP_LOGIN,
        pass: process.env.BREVO_SMTP_APIKEY,
      },
    });
  }

  async send(template, subject) {
    // 1) Render HTML based on a pug template
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`,
      {
        firstName: this.firstName,
        url: this.url,
        subject,
      },
    );

    // 2) Define email option
    const emailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.convert(html),
    };
    console.log(this.to);

    // 3) Create a transport & send email
    await this.newTransport().sendMail(emailOptions);
  }

  sendWelcome() {
    this.send('welcome', 'Hello & Welcome to the family 😁');
  }

  sendResetPassword() {
    this.send('ResetPassword', 'Your password reset token (valid for 10 min)');
  }
};
