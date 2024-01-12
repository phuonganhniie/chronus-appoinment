import React from "react";
import { ROUTES } from "../constant/apiPath";
import axios from "axios";

const handleErrors = (error) => {
  if (error.response) {
    console.log(error.response);
  } else if (error.request) {
    console.log(error.request);
  } else {
    console.log("Error", error.message);
  }
  throw error;
};

export const calendarCreate = async (payload) => {
  try {
    const response = await fetch(ROUTES.CALENDARS.BASE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    handleErrors(error);
  }
};
export const calendarGet = async () => {
  try {
    const response = await axios.get("http://localhost:3001/api/v1/calendars", {
      withCredentials: true,
      headers: {
        "Cache-Control": "no-cache",
      },
    });
    return response.data;
  } catch (error) {
    handleErrors(error);
  }
};

export const calendarUpdate = async (eventTypes) => {
  try {
    const response = await axios.put(
      ROUTES.CALENDARS.BASE,
      { totalEventTypes: eventTypes },
      {
        withCredentials: true,
      }
    );
    // console.log(response);
    return response.data.data;
  } catch (error) {
    handleErrors(error);
  }
};
