"use client";

import { useState } from "react";

import KlinesChartCardWrapper from "#/client/My/Trades/klines-chart-card-wrapper";
import DataTableCardWrapper from "#/client/My/Trades/data-table-card-wrapper";
import DataTable from "#/client/My/Trades/data-table";

export default function Index() {
  const [data, setData] = useState(null);

  return (
    <>
      <KlinesChartCardWrapper data={data} setData={setData} />
      <DataTableCardWrapper>
        <DataTable setData={setData} />
      </DataTableCardWrapper>
    </>
  );
}
