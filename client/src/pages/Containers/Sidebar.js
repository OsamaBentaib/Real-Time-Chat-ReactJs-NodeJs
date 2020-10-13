import React, { useEffect } from "react";
import { gql, useQuery, useSubscription, useLazyQuery } from "@apollo/client";
import * as actionTypes from "../../context/actionTypes";
import { useMessageDispatch, useMessageState } from "../../context/message";
import ConversationCard from "./Components/ConversationCard";
import { useAuthDispatch } from "../../context/auth";

const GET_CONVERSATION_MESSAGES = gql`
  query getMessages($from: ID!, $start: Int!, $limit: Int!) {
    getMessages(from: $from, start: $start, limit: $limit) {
      from
      to
      content
    }
  }
`;
const GET_CONVERSATIONS = gql`
  query getConversations {
    getConversations {
      user {
        username
        _id
      }
      latestMessage {
        content
      }
    }
  }
`;
const NEW_MESSAGE = gql`
  subscription {
    newMessage {
      from
      to
      content
    }
  }
`;
export default function Sidebar() {
  const dispatch = useMessageDispatch();
  const MESSAGES_LIST = [];
  const { conversations, selectedConversation } = useMessageState();
  const [getMessages, { data: messagesData }] = useLazyQuery(
    GET_CONVERSATION_MESSAGES
  );
  const { loading } = useQuery(GET_CONVERSATIONS, {
    onCompleted: (data) => {
      const convData = data.getConversations.filter(function (ele) {
        return ele !== null;
      });
      dispatch({
        type: actionTypes.SET_CONVERSATIONS,
        payload: convData,
      });
    },
    onError: (err) => console.log(err),
  });
  const { data: newMessage, loading: NewMessageLoading } = useSubscription(
    NEW_MESSAGE
  );
  useEffect(() => {
    if (newMessage) {
      MESSAGES_LIST.push(newMessage.newMessage);
      dispatch({
        type: actionTypes.SET_CONVERSATION_MESSAGES,
        payload: MESSAGES_LIST,
      });
      const cnv = conversations;
      let newList = [];
      cnv.forEach((ele) => {
        if (
          ele.user._id === newMessage.newMessage.from ||
          ele.user._id === newMessage.newMessage.to
        ) {
          newList.push({
            user: ele.user,
            latestMessage: [
              {
                __typename: "Message",
                content: newMessage.newMessage.content,
              },
            ],
          });
        } else {
          newList.push(ele);
        }
      });
      dispatch({
        type: actionTypes.SET_CONVERSATIONS,
        payload: newList,
      });
    }
    if (messagesData !== undefined) {
      const data = messagesData.getMessages;
      const payload = data.slice().sort((e, i) => {
        return -1;
      });
      dispatch({
        type: actionTypes.CONV_LOADING,
        payload: false,
      });
      dispatch({
        type: actionTypes.SET_CONVERSATION_MESSAGES,
        payload: payload,
      });
      payload.forEach((element) => {
        MESSAGES_LIST.push(element);
      });
    }
  }, [newMessage, messagesData]);
  const onTap = (e) => {
    getMessages({
      variables: { from: e.user._id, start: 0, limit: 10 },
    });
    dispatch({
      type: actionTypes.CONV_LOADING,
      payload: true,
    });
    dispatch({
      type: actionTypes.SET_CONVERSATION_MESSAGES,
      payload: [],
    });
    dispatch({
      type: actionTypes.SET_SELECTED_CONVERSATION,
      payload: e,
    });
  };
  const authDispatch = useAuthDispatch();
  const logout = () => {
    authDispatch({ type: "LOGOUT" });
    window.location.href = "/signin/";
  };
  return (
    <div className="tab-pane bk-white fade h-100 show active border-right">
      <div className="d-flex flex-column h-100">
        <div className="w-100">
          <div className="container py-6">
            <h2 className="font-bold mb-6">
              Chats{" "}
              <button className="btn btn-outline-danger" onClick={logout}>
                Logout
              </button>
            </h2>

            <nav className="nav d-block list-discussions-js mb-n6">
              {/* */}
              {loading && <p>Loading.....</p>}
              {!loading &&
                conversations !== undefined &&
                conversations.map((item, index) => (
                  <ConversationCard
                    isSelected={
                      selectedConversation !== undefined &&
                      selectedConversation.user === item.user
                        ? true
                        : false
                    }
                    onTap={onTap}
                    key={index}
                    item={item}
                  />
                ))}
              {/*  */}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
