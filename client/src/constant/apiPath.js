const API_PATH = "http://localhost:3001/api/v1";

export const ROUTES = {
  // User Authentication Route
  AUTH: {
    BASE: `${API_PATH}/auth`,
    LOGIN: `/login`,
  },

  // Calendars Route
  CALENDARS: {
    BASE: `${API_PATH}/calendars`,
  },

  // Events Route
  EVENTS: {
    BASE: `${API_PATH}/events`,
    CREATE: "/",
    GET: "/",
    GET_BY_ID: "/:eventId",
    UPDATE: "/:eventId",
    DELETE: "/:eventId",
  },

  // Recurring Event Route
  RECURRING_EVENT: {
    BASE: `${API_PATH}/events/recurring`,
    CREATE: "/",
    GET_BY_ID: "/:eventId",
    UPDATE: "/:eventId",
    DELETE: "/:eventId",
  },

  // Search & Filter Route
  SEARCH: {
    BASE: `${API_PATH}/search`,
  },
};
