import React, { createContext, useReducer, useContext } from "react";
import * as actionTypes from "./actionTypes";

const MessageStateContext = createContext();
const MessageDispatchContext = createContext();

const messageReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.CONV_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case actionTypes.SET_CONVERSATIONS:
      return {
        ...state,
        conversations: action.payload,
      };
    case actionTypes.SET_CONVERSATION_MESSAGES:
      return {
        ...state,
        conversationMessages: action.payload,
      };
    case actionTypes.SET_SELECTED_CONVERSATION:
      return {
        ...state,
        selectedConversation: action.payload,
      };
    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
};

export const MessageProvider = ({ children }) => {
  const [state, dispatch] = useReducer(messageReducer, { users: null });

  return (
    <MessageDispatchContext.Provider value={dispatch}>
      <MessageStateContext.Provider value={state}>
        {children}
      </MessageStateContext.Provider>
    </MessageDispatchContext.Provider>
  );
};

export const useMessageState = () => useContext(MessageStateContext);
export const useMessageDispatch = () => useContext(MessageDispatchContext);
