const transporter = require("nodemailer-sendgrid-transport");
const nodemailer = require("nodemailer");
const options = {
  auth: {
    api_key: process.env.SENDGRID_KEY,
  },
};
const mailer = nodemailer.createTransport(transporter(options));

module.exports = mailer;
