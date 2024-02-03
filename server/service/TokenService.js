const jwt = require("jsonwebtoken");
const Token = require("../models/Token");

class TokenService {

    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_KEY, {
            expiresIn: "30m"
        })
        const refreshToken = jwt.sign(payload, process.env.JWT_KEY_REFRESH, {
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

    async removeToken(refreshToken) {
        const token = await Token.deleteOne({refreshToken})
        return token;
    }
}


module.exports = new TokenService();