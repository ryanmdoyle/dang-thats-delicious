const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice'); //inlines all css for the html emails (html email has to be inline)
const htmlToText = require('html-to-text'); //converts html to plain text
const promisify = require('es6-promisify');

const transport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
})

const generateHTML = (filename, options = {}) => {
  const html = pug.renderFile(`${__dirname}/../views/email/${filename}.pug`, options); //__dirname is a Node variable that represents the working directory
  const inlineCSS = juice(html);
  return inlineCSS;
}

exports.send = async (options) => {
  const html = generateHTML(options.filename, options);
  const text = htmlToText.fromString(html);
  const mailOptions = {
    from: `Ryan Doyle 🖥️ <ryan@doylecodes.com>`,
    to: options.user.email,
    subject: options.subject,
    html,
    text // like text:text, using the htmltotext to convert the html to plain text
  };
  const sendMail = promisify(transport.sendMail, transport);
  return sendMail(mailOptions);
}

// transport.sendMail({
//   from: '"Ryan Doyle 🖥️" <ryan@doylecodes.com>', // sender address
//   to: 'bar@example.com, baz@example.com', // list of receivers
//   subject: 'Hello ✔', // Subject line
//   text: 'Hello world?', // plain text body
//   html: '<b>Hello world?</b>' // html body
// })
