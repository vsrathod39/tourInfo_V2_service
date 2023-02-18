const { Router } = require('express');
const auth = require("../middlewares/authenticate");
const userController = require('../controllers/user.controller');

const router = Router();

router.post("/register", userController.createUser);
router.get("/get", userController.getUser);

module.exports = router;