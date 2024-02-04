const bcrypt = require('bcrypt');
const uuid = require("uuid");
const jwt = require("jsonwebtoken")
const MailService = require('./MailService')
const { generateTokens, saveToken } = require("./TokenService");
const TokenService = require("./TokenService");
const User = require("../models/User");
const ApiError = require('../error/ApiError');
const UserModel = require("../models/User")



class UserService {

    async registration(email, password) {
        const candidate = await UserModel.findOne({email});

        if(candidate) {
          throw ApiError.BadRequest("The user already exists")
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
            throw ApiError.BadRequest("Something is wrong with the activation link")
        }

        user.isActivated = true;

        await user.save();
    }


    async login(email, password) {

        const user = await UserModel.findOne({email}) 

        if (!user) {
            throw ApiError.BadRequest("The user doesn't exist")
        }

        const comparePass = await bcrypt.compare(password, user.password);

        if(!comparePass) {
            throw ApiError.BadRequest("Wrong password")
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


    async refresh(refreshToken) {
        if(!refreshToken) {
            throw ApiError.BadRequest("Wrong token")
        }

        const userData = TokenService.validateRefreshToken(refreshToken);
        const tokenDB = await TokenService.findToken(refreshToken);

        if(!userData || !tokenDB) {
            throw ApiError.UnauthorizedError()
        }

        const user = User.findById(userData.id)

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


    async sendResetMail(email) {
        const user = await User.findOne({email});

        if (!user) {
            throw ApiError.BadRequest("The user doesn't exist")
        }

        const secret = user._id + process.env.JWT_KEY;

        const token = jwt.sign({id: user._id}, secret, {
            expiresIn: "10m",
        })

        const link=`${process.env.API_URL}/api/resetPassword/${user._id}/${token}`;

        await MailService.sendResetMail(email, link);
    }

    async setNewPass(id, token, password, password_confirmation) {
        const user = await User.findById(id);
        const secret = user._id + process.env.JWT_KEY;

        jwt.verify(token, secret)

        if (!password || !password_confirmation) {
            throw ApiError.BadRequest("")
          } else if (password !== password_confirmation) {
            throw ApiError.BadRequest("Passwords don't match")
          } else {
            
            const salt = await bcrypt.genSalt(5);
            const newHashPassword = await bcrypt.hash(password, salt);
          
            const updatedUser = await User.findByIdAndUpdate(
                user._id,
                { password: newHashPassword },
            );
          }
          
    }
}

module.exports = new UserService();