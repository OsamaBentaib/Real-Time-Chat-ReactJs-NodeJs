import React from "react";

export default function ConversationCard(props) {
  const item = props.item;

  return (
    <div
      onClick={() => props.onTap(item)}
      className="text-reset pointer nav-link p-0 mb-6 border"
    >
      <div
        className={`card card-active-listener ${
          props.isSelected && "active-conv"
        }`}
      >
        <div className="card-body">
          <div className="media">
            <div className="avatar mr-5">
              <img
                className="avatar-img"
                src={require("./../../../assets/images/avatar-1.jpg")}
                alt="Bootstrap Themes"
              />
            </div>
            <div className="media-body overflow-hidden">
              <div className="d-flex align-items-center mb-1">
                <h6 className="text-truncate mb-0 mr-auto">
                  {item.user.username}
                </h6>
              </div>
              <div className="text-truncate">
                {props.item.latestMessage[0]
                  ? props.item.latestMessage[0].content
                    ? props.item.latestMessage[0].content
                    : "type new Message"
                  : "type new Message"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
