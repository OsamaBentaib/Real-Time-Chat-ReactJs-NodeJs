import React from "react";

export default function NotSelected() {
  return (
    <div className="chat flex-column justify-content-center text-center">
      <div className="container-xxl">
        <div className="avatar avatar-lg mb-5">
          <img
            className="avatar-img"
            src={require("./../../../assets/images/avatar-1.jpg")}
            alt=""
          />
        </div>
        <h6>Hey!</h6>
        <p>Please select a chat to start messaging.</p>
      </div>
    </div>
  );
}
