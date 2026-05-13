/** @format */

import React from "react";
import BookingListTable from "@/components/BookingListComponents/BookingListTable";

const BookingListPage = () => {
  return (
    <div className="w-full p-3 md:p-4">
      <div className="max-w-625 mx-auto space-y-4 md:space-y-6">
        <BookingListTable />
      </div>
    </div>
  );
};

export default BookingListPage;
