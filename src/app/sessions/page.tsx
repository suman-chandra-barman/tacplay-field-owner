/** @format */

import React from "react";
import SessionTable from "@/components/SessionComponents/SessionTable";

const SessionsPage = () => {
  return (
    <div className="w-full p-3 md:p-4">
      <div className="max-w-625 mx-auto space-y-4 md:space-y-6">
        {" "}
        <SessionTable />
      </div>
    </div>
  );
};

export default SessionsPage;
