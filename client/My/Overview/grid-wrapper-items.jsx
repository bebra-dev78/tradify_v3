"use client";

import Grid from "@mui/material/Unstable_Grid2";

import { useState, useEffect } from "react";

import StatisticsItem from "#/client/My/Overview/statistics-item";
import CommissionItem from "#/client/My/Overview/commission-item";
import VolumeItem from "#/client/My/Overview/volume-item";
import ProfitItem from "#/client/My/Overview/profit-item";
import { getTrades } from "#/server/trades";
import { useUser } from "#/app/my/layout";

export default function GridWrapperItems() {
  const {
    user: { id },
  } = useUser();

  const [trades, setTrades] = useState(null);

  useEffect(() => {
    if (id) {
      getTrades(id).then((t) => {
        setTrades(t);
      });
    }
  }, [id]);

  return (
    <>
      <Grid item xs={12} md={4}>
        <ProfitItem trades={trades} />
      </Grid>
      <Grid item xs={12} md={4}>
        <CommissionItem trades={trades} />
      </Grid>
      <Grid item xs={12} md={4}>
        <VolumeItem trades={trades} />
      </Grid>
      <Grid item xs={12} md={12} xl={12}>
        <StatisticsItem trades={trades} />
      </Grid>
    </>
  );
}
