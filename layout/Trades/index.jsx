"use client";

import { useState, useRef } from "react";

import DataTableCardWrapper from "#/layout/Trades/data-table-card-wrapper";
import KlinesChart from "#/layout/Trades/klines-chart";
import DataTable from "#/layout/Trades/data-table";

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
