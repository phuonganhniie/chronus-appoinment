const config = require("../configs/config");

const BASE_URL = config.base_url;

const ROUTES = {
  // Authentication Route
  AUTH: {
    BASE: `${BASE_URL}/auth`,
    REGISTER: "/register",
    LOGIN: "/login",
    LOGOUT: "/logout",
    REFRESH_TOKEN: "/refresh-token",
  },

  // User Route
  USER: {
    BASE: `${BASE_URL}/users`,
    GET: "/profile",
    PUT: "/profile",
    PASSWORD: "/update-password",
  },

  // Calendars Route
  CALENDARS: {
    BASE: `${BASE_URL}/calendars`,
    CREATE: "/",
  },

  // Events Route
  EVENTS: {
    BASE: `${BASE_URL}/events`,
    CREATE: "/",
    GET: "/",
    GET_BY_ID: "/:eventId",
    UPDATE: "/:eventId",
    DELETE: "/:eventId",
  },

  // Recurring Event Route
  RECURRING_EVENT: {
    BASE: `/api/v1/events/recurring`,
    CREATE: "/",
    GET_BY_CALENDAR_ID: "/calendar/:calendarId",
    GET_BY_ID: "/:recurringEventId",
    UPDATE: "/:recurringEventId",
    DELETE: "/:recurringEventId",
  },

  // Search & Filter Route
  SEARCH: {
    BASE: `${BASE_URL}/search`,
  },
};

module.exports = ROUTES;
