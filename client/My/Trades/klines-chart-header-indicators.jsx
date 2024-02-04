"use client";

import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import Typography from "@mui/material/Typography";

export default function KlinesChartHeaderIndicators({
  installMainIndicator,
  removeMainIndicator,
  installSubIndicator,
  removeSubIndicator,
  setIndicators,
  indicators,
}) {
  return (
    <ToggleButtonGroup
      size="small"
      value={indicators}
      onChange={(e, newIndicators) => {
        setIndicators(newIndicators);
      }}
    >
      <ToggleButton
        value="MA"
        onClick={() => {
          if (indicators.some((indicator) => indicator === "MA")) {
            removeMainIndicator("MA");
          } else {
            installMainIndicator("MA");
          }
        }}
      >
        <Typography variant="subtitle1" sx={{ p: "0px 6px" }}>
          MA
        </Typography>
      </ToggleButton>
      <ToggleButton
        value="EMA"
        onClick={() => {
          if (indicators.some((indicator) => indicator === "EMA")) {
            removeMainIndicator("EMA");
          } else {
            installMainIndicator("EMA");
          }
        }}
      >
        <Typography variant="subtitle1" sx={{ p: "0px 6px" }}>
          EMA
        </Typography>
      </ToggleButton>
      <ToggleButton
        value="SMA"
        onClick={() => {
          if (indicators.some((indicator) => indicator === "SMA")) {
            removeMainIndicator("SMA");
          } else {
            installMainIndicator("SMA");
          }
        }}
      >
        <Typography variant="subtitle1" sx={{ p: "0px 6px" }}>
          SMA
        </Typography>
      </ToggleButton>
      <ToggleButton
        value="BOLL"
        onClick={() => {
          if (indicators.some((indicator) => indicator === "BOLL")) {
            removeMainIndicator("BOLL");
          } else {
            installMainIndicator("BOLL");
          }
        }}
      >
        <Typography variant="subtitle1" sx={{ p: "0px 6px" }}>
          BOLL
        </Typography>
      </ToggleButton>
      <ToggleButton
        value="Custom"
        onClick={() => {
          if (indicators.some((indicator) => indicator === "Custom")) {
            removeMainIndicator("Custom");
          } else {
            installMainIndicator("Custom");
          }
        }}
      >
        <Typography variant="subtitle1" sx={{ p: "0px 6px" }}>
          Custom
        </Typography>
      </ToggleButton>
      <ToggleButton
        value="VOL"
        onClick={() => {
          if (indicators.some((indicator) => indicator === "VOL")) {
            removeSubIndicator(["VOL", "pane_1"]);
          } else {
            installSubIndicator(["VOL", "pane_1"]);
          }
        }}
      >
        <Typography variant="subtitle1" sx={{ p: "0px 6px" }}>
          VOL
        </Typography>
      </ToggleButton>
      <ToggleButton
        value="MACD"
        onClick={() => {
          if (indicators.some((indicator) => indicator === "MACD")) {
            removeSubIndicator(["MACD", "pane_2"]);
          } else {
            installSubIndicator(["MACD", "pane_2"]);
          }
        }}
      >
        <Typography variant="subtitle1" sx={{ p: "0px 6px" }}>
          MACD
        </Typography>
      </ToggleButton>
      <ToggleButton
        value="KDJ"
        onClick={() => {
          if (indicators.some((indicator) => indicator === "KDJ")) {
            removeSubIndicator(["KDJ", "pane_3"]);
          } else {
            installSubIndicator(["KDJ", "pane_3"]);
          }
        }}
      >
        <Typography variant="subtitle1" sx={{ p: "0px 6px" }}>
          KDJ
        </Typography>
      </ToggleButton>
      <ToggleButton
        value="RSI"
        onClick={() => {
          if (indicators.some((indicator) => indicator === "RSI")) {
            removeSubIndicator(["RSI", "pane_4"]);
          } else {
            installSubIndicator(["RSI", "pane_4"]);
          }
        }}
      >
        <Typography variant="subtitle1" sx={{ p: "0px 6px" }}>
          RSI
        </Typography>
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
