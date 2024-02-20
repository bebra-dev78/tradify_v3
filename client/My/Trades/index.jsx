"use client";

import { useState } from "react";

import DataTableCardWrapper from "#/client/My/Trades/data-table-card-wrapper";
import KlinesChart from "#/client/My/Trades/klines-chart";
import DataTable from "#/client/My/Trades/data-table";

export default function Index() {
  const [data, setData] = useState(null);

  return (
    <>
      <KlinesChart data={data} setData={setData} />
      <DataTableCardWrapper>
        <DataTable setData={setData} />
      </DataTableCardWrapper>
    </>
  );
}
