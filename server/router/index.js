const Router = require("express");
const UserController = require("../controllers/UserController");
const {body} = require("express-validator");
const UserService = require("../service/UserService");

const router = new Router();

router.post("/registration",
    body("email").isEmail(),
    body("password").isLength({min: 5, max: 25}),
    UserController.registration);
router.post("/login", UserController.login);
router.post("/logout", UserController.logout);
router.get("/refresh");
router.get("/activate/:link", UserController.activate);

module.exports = router;

