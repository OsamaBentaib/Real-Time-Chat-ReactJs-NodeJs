import React from "react";
import NotSelected from "./NotSelected";
import ChatContent from "./ChatContent";
import { useMessageState } from "../../../context/message";

export default function MainContent() {
  const { selectedConversation } = useMessageState();
  return (
    <div className="main">
      {selectedConversation ? <ChatContent /> : <NotSelected />}
    </div>
  );
}
