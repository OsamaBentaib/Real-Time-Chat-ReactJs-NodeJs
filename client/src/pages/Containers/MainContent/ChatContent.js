import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { useMessageState } from "../../../context/message";
import MessageCard from "../Components/MessageCard";
import { FiSend } from "react-icons/fi";
const SEND_MESSAGE = gql`
  mutation sendMessage($to: ID!, $content: String!) {
    sendMessage(to: $to, content: $content) {
      from
      to
      content
    }
  }
`;
export default function ChatContent() {
  const {
    conversationMessages,
    selectedConversation,
    loading,
  } = useMessageState();
  const [content, setContent] = useState("");
  const [sendMessage] = useMutation(SEND_MESSAGE, {
    onError: (err) => console.log(err),
    onCompleted: (data) => {
      console.log(data);
    },
  });
  const onSubmitMessage = (e) => {
    e.preventDefault();
    if (content.trim() === "" || !selectedConversation.user._id) return;
    setContent("");
    sendMessage({
      variables: { to: selectedConversation.user._id, content: content },
    });
  };

  return (
    <div className="chat dropzone-form-js">
      <div className="chat-body">
        <div className="chat-header border-bottom py-4 py-lg-6 px-lg-8">
          <div className="container-xxl">
            <div className="row align-items-center">
              <div className="col-6 col-xl-6">
                <div className="media text-center text-xl-left">
                  <div className="avatar avatar-sm d-none d-xl-inline-block mr-5">
                    <img
                      src={require("./../../../assets/images/avatar-1.jpg")}
                      className="avatar-img"
                      alt=""
                    />
                  </div>
                  <div className="media-body align-self-center text-truncate">
                    <h6 className="text-truncate mb-n1">
                      {selectedConversation.user.username}
                    </h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="chat-content bk-white px-lg-8">
          <div className="container-xxl py-6 py-lg-10">
            {loading && <p>loading.....</p>}
            {conversationMessages !== undefined &&
              conversationMessages.map((item, index) => (
                <MessageCard key={index} item={item} />
              ))}
          </div>
        </div>
        <div className="chat-footer border-top py-4 py-lg-6 px-lg-8">
          <div className="container-xxl">
            <div className="form-row align-items-center">
              <div className="col">
                <div className="input-group">
                  <textarea
                    id="chat-id-1-input"
                    className="form-control bg-transparent border-0"
                    placeholder="Type your message..."
                    rows="1"
                    data-emoji-input=""
                    data-autosize="true"
                    style={{
                      overflow: "hidden",
                      overflowWrap: "break-word",
                      resize: "none",
                      height: "46px",
                    }}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  ></textarea>
                </div>
              </div>
              <div className="col-auto">
                <button
                  onClick={onSubmitMessage}
                  className="btn btn-ico btn-primary rounded-circle"
                  type="submit"
                >
                  <span>
                    <FiSend />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
