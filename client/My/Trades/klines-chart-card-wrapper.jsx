"use client";

import CardHeader from "@mui/material/CardHeader";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";

import { useState, useRef } from "react";

import KlinesChartOverlaysToolsbar from "#/client/My/Trades/klines-chart-overlays-toolsbar";
import KlinesChartHeaderIndicators from "#/client/My/Trades/klines-chart-header-indicators";
import KlinesChartCardOptionsMenu from "#/client/My/Trades/klines-chart-card-options-menu";
import KlinesChartSwitchButtons from "#/client/My/Trades/klines-chart-switch-buttons";
import KlinesChart from "#/client/My/Trades/klines-chart";

export default function KlinesChartCardWrapper({ data, setData }) {
  const [installMainIndicator, setInstallMainIndicator] = useState(null);
  const [removeMainIndicator, setRemoveMainIndicator] = useState(null);
  const [installSubIndicator, setInstallSubIndicator] = useState(null);
  const [removeSubIndicator, setRemoveSubIndicator] = useState(null);
  const [indicators, setIndicators] = useState(() => []);
  const [gridStatus, setGridStatus] = useState(false);
  const [addOverlay, setAddOverlay] = useState(null);
  const [showGrid, setShowGrid] = useState(false);
  const [interval, setInterval] = useState("5m");

  return data !== null ? (
    <Card
      sx={{
        mb: 5,
      }}
    >
      <Stack
        sx={{
          pl: "6px",
          pr: "6px",
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <CardHeader title={data.symbol} />
        <KlinesChartSwitchButtons
          setInterval={setInterval}
          interval={interval}
        />
        <KlinesChartHeaderIndicators
          installMainIndicator={installMainIndicator}
          removeMainIndicator={removeMainIndicator}
          installSubIndicator={installSubIndicator}
          removeSubIndicator={removeSubIndicator}
          setIndicators={setIndicators}
          indicators={indicators}
        />
        <KlinesChartCardOptionsMenu
          setGridStatus={setGridStatus}
          gridStatus={gridStatus}
          showGrid={showGrid}
          setData={setData}
        />
      </Stack>
      <Box sx={{ display: "flex" }}>
        <KlinesChartOverlaysToolsbar addOverlay={addOverlay} />
        <KlinesChart
          setInstallMainIndicator={setInstallMainIndicator}
          setRemoveMainIndicator={setRemoveMainIndicator}
          setInstallSubIndicator={setInstallSubIndicator}
          setRemoveSubIndicator={setRemoveSubIndicator}
          setIndicators={setIndicators}
          setAddOverlay={setAddOverlay}
          setShowGrid={setShowGrid}
          gridStatus={gridStatus}
          interval={interval}
          data={data}
        />
      </Box>
    </Card>
  ) : null;
}
