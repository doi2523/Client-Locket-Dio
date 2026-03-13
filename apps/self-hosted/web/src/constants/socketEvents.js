// constants/socketEvents.js
export const SocketEvent = {
  CONNECT: "connect",
  DISCONNECT: "disconnect",
  CONNECT_ERROR: "connect_error",

  LIST_MESSAGE: "list_message",
  NEW_MESSAGE: "new_message",
  GET_MESSAGE: "get_message",

  // Emit events
  GET_LIST_MESSAGES: "get_list_messages",
  GET_MESSAGES_WITH_USER: "get_messages_with_user",
};
