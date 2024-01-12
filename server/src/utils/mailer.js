const nodemailer = require('nodemailer');
const config = require('../configs/config');
const { logger } = require('./logger');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.email_user,
        pass: config.email_password,
    },
});

exports.sendEmail = async (to, subject, text) => {
    const mailOptions = {
        from: config.email_user,
        to: to,
        subject: subject,
        text: text,
    };

    try {
        await transporter.sendMail(mailOptions);
        logger.infof("Email sent successfully");
    } catch (error) {
        logger.errorf("Error sending email: %v", error);
    }
};