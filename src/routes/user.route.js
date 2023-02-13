const { Router } = require('express');
const auth = require("../middlewares/auth");
const userController = require('../controllers/user.controller');

const router = Router();

router.post("/register", userController.createUser);
router.get("/get", auth, userController.getUser);

module.exports = router;