const Router = require("express");

const router = new Router();

router.post("/registration");
router.post("/login");
router.post("/logout");
router.get("/refresh");
router.get("/activate/:link");

module.exports = router;

