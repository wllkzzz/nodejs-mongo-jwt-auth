const UserModel = require("../models/User");
const bcrypt = require('bcrypt');
const uuid = require("uuid");
const MailService = require("./MailService");



class UserService {

    async registration(email, password) {
        const candidate = await UserModel.findOne({email});

        if(candidate) {
            resizeBy.status(400).json({
                "message": "User with this email already exists"
            })
        }

        const hashPassword = await bcrypt.hash(password, 5);
        const activationLink = uuid.v4();
        const user = UserModel.create({email, password: hashPassword, activationLink});
        await MailService.sendActivationMail(email, activationLink);
    }

}

module.exports = new UserService();