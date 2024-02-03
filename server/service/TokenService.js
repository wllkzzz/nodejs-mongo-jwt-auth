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

    async findToken(refreshToken) {
        const token = await Token.findOne({refreshToken})
        return token;
    }


    async validateRefreshToken(refreshToken) {
        try {
            const data = jwt.verify(refreshToken, process.env.JWT_KEY_REFRESH);
            return data;
        } catch (error) {
            return null;
        }
    }

    async validateAccessToken(accessToken) {
        try {
            const data = jwt.verify(refreshToken, process.env.JWT_KEY);
            return data;
        } catch (error) {
            return null;
        }
    }
}


module.exports = new TokenService();