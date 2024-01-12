const express = require("express");
const { authenticateToken } = require("../middleware");
const eventController = require("../controllers/eventController");
const ROUTES = require("../constants/routePaths");

const router = express.Router();

// Authenticate JWT
// router.use(authenticateToken);

router.post(ROUTES.EVENTS.CREATE, eventController.createEvent);
router.get(ROUTES.EVENTS.GET, eventController.listEvents);
router.get(ROUTES.EVENTS.GET_BY_ID, eventController.getEventById);
router.put(ROUTES.EVENTS.UPDATE, eventController.updateEvent);
router.delete(ROUTES.EVENTS.DELETE, eventController.deleteEvent);

module.exports = router;
