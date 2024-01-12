const express = require("express");
const recurringEventController = require("../controllers/recurringEventController");
const { authenticateToken } = require("../middleware");
const ROUTES = require("../constants/routePaths");

const router = express.Router();

// Authenticate JWT
// router.use(authenticateToken);

router.post(
  ROUTES.RECURRING_EVENT.CREATE,
  recurringEventController.createRecurringEvent
);
// router.get(ROUTES.RECURRING_EVENT.GET_BY_ID, recurringEventController.getRecurringEventById);
// router.put(ROUTES.RECURRING_EVENT.UPDATE, recurringEventController.updateRecurringEventById);
// router.delete(ROUTES.RECURRING_EVENT.DELETE, recurringEventController.deleteRecurringEvent);

module.exports = router;
