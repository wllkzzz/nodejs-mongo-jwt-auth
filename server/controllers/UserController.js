const { validationResult } = require("express-validator");
const UserService = require("../service/UserService");



class UserController {
    async registration(req, res, next) {
        try {
            const erros = validationResult(req);

            if (!erros.isEmpty()) {
                return res.status(400).json({"message": "Validation error"})
            }

            const {email, password} = req.body;
            const userData = await UserService.registration(email, password);

            res.cookie("refreshToken", userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData);
        } catch (error) {
            next(error)
        }
    }

    async login(req, res, next) {
        try {
            const {email, password} = req.body;
            const userData = await UserService.login(email, password);
            res.cookie("refreshToken", userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
            return res.json(userData);
        } catch (error) {
            next(error)
        }
    }

    async logout(req, res, next) {
        try {
            const { refreshToken } = req.cookies;

            await UserService.logout(refreshToken);
            res.clearCookie("refreshToken");

            return res.status(200).json({ message: "Logout successful" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }

    async refresh(req, res, next) {
        try {
            const {refreshToken} = req.cookies;

            const userData = await UserService.refresh(refreshToken);
            res.cookie("refreshToken", userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
            return res.json(userData);
        } catch (error) {
            next(error)
        }
    }

    async activate(req, res, next) {
        try {
            const activationLink = req.params.link
            await UserService.activate(activationLink);
            return res.redirect(process.env.API_URL)
        } catch (error) {
            next(error)
        }
    }


    async sendResetPass(req, res, next) {
        try {

            const erros = validationResult(req);

            if (!erros.isEmpty()) {
                return res.status(400).json({"message": "Validation error"})
            }

            const {email} = req.body;
            await UserService.sendResetMail(email)

            return res.json({"message": "The letter has been sent" })
        } catch (error) {
            next(error)
        }
    }


    async resetPass(req, res, next) {
        try {
            const {password, password_confirmation} = req.body;
            const {id, token} = req.params;

            await UserService.setNewPass(id, token, password, password_confirmation)
            res.status(200).json({"message": "Password has been changed"})
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new UserController();