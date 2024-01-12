// desc: Reducer for events
//purpose: to manage the state of events
export function savedEventsReducer(state, { type, payload }) {
  switch (type) {
    case "INITIAL_EVENT":
      return payload;
    case "CREATE_EVENT":
      return [...state, payload];
    case "REMOVE_EVENT":
      return state.filter((event) => event.id !== payload.id);
    case "UPDATE_EVENT":
      return state.map((event) => (event.id === payload.id ? payload : event));
    default:
      return state;
  }
}

//desc: Reducer for event types
//purpose: to manage the state of event types
export function eventTypesReducer(totalEventTypes, { type, payload }) {
  switch (type) {
    case "INITIAL_EVENT_TYPE":
      return payload;
    case "ADD_EVENT_TYPE":
      if (totalEventTypes.length < 5) {
        return [...totalEventTypes, payload];
      } else {
        alert("You can only have 5 event types");
        return totalEventTypes;
      }
    // case "SET_NEW_EVENT_TYPE":
    //   return { ...totalEventTypes, newEventType: payload };
    // case "SELECTED_EVENT_TYPE":
    //   return { ...totalEventTypes, selectedEventType: payload };
    case "UPDATE_EVENT_TYPE":
      return [
        ...totalEventTypes.map((evt, i) =>
          i === payload.index ? payload.eventType : evt
        ),
      ];
    case "REMOVE_EVENT_TYPE":
      return [...totalEventTypes.filter((eventType) => eventType !== payload)];
    default:
      return totalEventTypes;
  }
}
//[
// {
//     eventTypes: ['Type 1', 'Type 2', 'Type 3'],
//     newEventType: 'Type 4',
//     selectedEventType: 'Type 2'
//   },
// {
//     eventTypes: ['Type 1', 'Type 2', 'Type 3'],
//     newEventType: 'Type 4',
//     selectedEventType: 'Type 2'
//   }
//]
