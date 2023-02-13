const { Router } = require('express');
const authControllers = require('../controllers/auth.controllers');

const router = Router();

router.post("/register", authControllers.signup);
router.post("/login", authControllers.login);

module.exports = router;