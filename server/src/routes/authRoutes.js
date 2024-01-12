const express = require("express");
const ROUTES = require("../constants/routePaths");
const authController = require("../controllers/authController");

const router = express.Router();

router.post(ROUTES.AUTH.LOGIN, authController.login);
router.post(ROUTES.AUTH.LOGOUT, authController.invalidateToken);
router.post(ROUTES.AUTH.REFRESH_TOKEN, authController.refreshToken);

module.exports = router;
