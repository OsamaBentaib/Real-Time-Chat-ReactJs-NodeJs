import React, { useEffect } from "react";
import Sidebar from "./Containers/Sidebar";
import MainContent from "./Containers/MainContent/MainContent";

function Layout({ history }) {
 
  return (
    <div className="layout">
      <div className="sidebar">
        <div className="tab-content h-100">
          <Sidebar />
        </div>
      </div>
      <MainContent />
    </div>
  );
}

export default Layout;
