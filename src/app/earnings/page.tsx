/** @format */

import EarningTable from "@/components/EarningComponents/EarningTable";

const EarningsPage = () => {
  return (
    <div className="w-full p-3 md:p-4">
      <div className="max-w-625 mx-auto space-y-4 md:space-y-6">
        <EarningTable />
      </div>
    </div>
  );
};

export default EarningsPage;
