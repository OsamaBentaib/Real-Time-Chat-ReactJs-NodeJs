import React from "react";
import { useAuthState } from "../../../context/auth";

export default function MessageCard(props) {
  const item = props.item;
  const { _id } = useAuthState();
  console.log("IIIIIIIII" + localStorage.getItem("_id"));
  if (item.from !== localStorage.getItem("_id")) {
    return (
      <div className="message">
        <div className="avatar avatar-sm mr-4 mr-lg-5">
          <img
            className="avatar-img"
            src={require("./../../../assets/images/avatar-1.jpg")}
            alt=""
          />
        </div>
        <div className="message-body">
          <div className="message-row">
            <div className="d-flex align-items-center">
              <div className="message-content bg-light">
                <div>{item.content}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="message message-right">
      <div className="avatar avatar-sm ml-4 ml-lg-5 d-none d-lg-block">
        <img
          className="avatar-img"
          src={require("./../../../assets/images/avatar-1.jpg")}
          alt=""
        />
      </div>
      <div className="message-body">
        <div className="message-row">
          <div className="d-flex align-items-center justify-content-end">
            <div className="message-content bg-primary text-white">
              <div>{item.content}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
