const nodemailer = require("nodemailer")
const dotenv = require("dotenv");
dotenv.config();


class MailService {

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            secure: false,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            }

        })
    }

    async sendActivationMail(to, link) {
        await this.transporter.sendMail({
            from: process.env.MAIL_USER,
            to,
            subject: "Account activation",
            text: "",
            html: 
            `
            <div>
                <h1>To activate your account follow this link:</h1>
                <a href="${link}">${link}</a>
            </div>
            `
        })
    }
}

module.exports = new MailService();