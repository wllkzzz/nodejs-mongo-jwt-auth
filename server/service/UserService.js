const UserModel = require("../models/User");
const bcrypt = require('bcrypt');
const uuid = require("uuid");
const MailService = require('./MailService')
const { generateTokens, saveToken } = require("./TokenService");
const TokenService = require("./TokenService");



class UserService {

    async registration(email, password) {
        const candidate = await UserModel.findOne({email});

        if(candidate) {
          throw new Error("User already exists")
        }

        const hashPassword = await bcrypt.hash(password, 5);
        const activationLink = uuid.v4();
        const user = await UserModel.create({email, password: hashPassword, activationLink});
        await MailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`);

        const userInput = {
           id: user._id,
           email: user.email,
           isActivated: user.isActivated
        }

        const tokens = generateTokens(userInput);
        await saveToken(userInput.id, tokens.refreshToken);


        return {
            ...tokens,
            user: userInput,
        }
    }

    async activate(activationLink) {
        const user = await UserModel.findOne({activationLink})

        if(!user) {
            throw new Error("Something is wrong with the activation link")
        }

        user.isActivated = true;

        await user.save();
    }


    async login(email, password) {

        const user = await UserModel.findOne({email}) 

        if (!user) {
            throw new Error("The user doesn't exist")
        }

        const comparePass = await bcrypt.compare(password, user.password);

        if(!comparePass) {
            throw new Error("Wrong password")
        }

        const userInput = {
            id: user._id,
            email: user.email,
            isActivated: user.isActivated
         }
 
         const tokens = generateTokens(userInput);
         await saveToken(userInput.id, tokens.refreshToken);
 
 
         return {
             ...tokens,
             user: userInput,
         }
        

    }

    async logout(refreshToken) {
        const token = await TokenService.removeToken(refreshToken);
        return token
    }
}

module.exports = new UserService();