const Router = require("express");
const UserController = require("../controllers/UserController");

const router = new Router();

router.post("/registration", UserController.registration);
router.post("/login");
router.post("/logout");
router.get("/refresh");
router.get("/activate/:link", UserController.activate);

module.exports = router;

