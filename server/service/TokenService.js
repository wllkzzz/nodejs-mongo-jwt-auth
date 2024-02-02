const jwt = require("jsonwebtoken");
const Token = require("../models/Token");
const TOKEN = process.env.JWT_KEY;
const TOKEN_REFRESH = process.env.JWT_KEY_REFRESH;

class TokenService {

    generateTokens(payload) {
        const accessToken = jwt.sign(payload, TOKEN, {
            expiresIn: "30m"
        })
        const refreshToken = jwt.sign(payload, TOKEN_REFRESH, {
            expiresIn: "30d"
        })
        return {
            accessToken,
            refreshToken
        }
    }

    async saveToken(id, refreshToken) {
        const tokenData = await Token.findOne({user: id});

        if(tokenData) {
            tokenData.refreshToken = refreshToken;
            return tokenData.save()
        }

        const token = await Token.create({user: id, refreshToken});

        return token;
    }

}


module.exports = new TokenService();