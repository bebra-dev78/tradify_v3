"use client";

import { useState, useRef } from "react";

import DataTableCardWrapper from "#/client/My/Trades/data-table-card-wrapper";
import KlinesChart from "#/client/My/Trades/klines-chart";
import DataTable from "#/client/My/Trades/data-table";

export default function Index() {
  const [activate, setActivate] = useState({ status: false });

  const dataRef = useRef(null);

  return (
    <>
      <KlinesChart
        dataRef={dataRef}
        activate={activate}
        setActivate={setActivate}
      />
      <DataTableCardWrapper>
        <DataTable dataRef={dataRef} setActivate={setActivate} />
      </DataTableCardWrapper>
    </>
  );
}
