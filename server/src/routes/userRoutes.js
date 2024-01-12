const express = require("express");
const ROUTES = require("../constants/routePaths");
const { authenticateToken } = require("../middleware");
const userController = require("../controllers/userController");

const router = express.Router();

// Authenticate JWT
router.use(authenticateToken);

router.get(ROUTES.USER.GET, userController.getUserProfile);
router.put(ROUTES.USER.PUT, userController.updateUserProfile);
router.put(ROUTES.USER.PASSWORD, userController.updatePassword);

module.exports = router;
