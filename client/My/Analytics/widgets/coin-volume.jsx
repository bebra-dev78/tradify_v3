"use client";

import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import { useTheme } from "@mui/material/styles";
import Skeleton from "@mui/material/Skeleton";
import Card from "@mui/material/Card";

import { useState, useEffect } from "react";
import Chart from "react-apexcharts";

import Iconify from "#/utils/iconify";

export default function CoinVolume({ trades, onDeleteWidget }) {
  const theme = useTheme();

  const [counter, setCounter] = useState({});

  useEffect(() => {
    if (trades.length > 0) {
      setCounter({
        categories: trades.map((trade) => trade.symbol),
        series: trades.map((trade) => trade.volume.toFixed(0)),
      });
    }
  }, [trades]);

  return Object.keys(counter).length > 0 ? (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CardHeader
        title="Объём по монете"
        titleTypographyProps={{
          className: "drag-header",
          sx: { cursor: "move" },
        }}
        action={
          <IconButton onClick={onDeleteWidget}>
            <Iconify
              icon="solar:close-square-outline"
              sx={{ color: "text.disabled" }}
            />
          </IconButton>
        }
        sx={{ p: "24px 24px 0px" }}
      />
      <div style={{ flexGrow: 1 }} />
      <Chart
        options={{
          chart: {
            type: "bar",
            toolbar: {
              show: false,
            },
            zoom: {
              enabled: false,
            },
            dropShadow: {
              enabled: false,
            },
          },
          colors: ["#FFAC82"],
          dataLabels: {
            enabled: false,
          },
          grid: {
            borderColor: "rgba(145, 158, 171, 0.2)",
            strokeDashArray: 3,
          },
          plotOptions: {
            bar: {
              horizontal: true,
            },
          },
          xaxis: {
            categories: counter.categories,
            axisBorder: {
              show: false,
            },
            axisTicks: {
              show: false,
            },
            labels: {
              style: {
                colors: theme.palette.text.secondary,
              },
            },
          },
          yaxis: {
            labels: {
              style: {
                colors: theme.palette.text.secondary,
              },
            },
          },
          tooltip: {
            x: {
              show: false,
            },
            style: {
              fontSize: "12px",
              fontFamily: "inherit",
            },
          },
        }}
        series={[
          {
            name: "Объём ($)",
            data: counter.series,
          },
        ]}
        height={"85%"}
        type="bar"
      />
      <div style={{ flexGrow: 1 }} />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
        }}
      >
        <g transform="rotate(180 12 12)">
          <path
            fill="none"
            stroke="#637381"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 20v-5C4 8.925 8.925 4 15 4h5"
          />
        </g>
      </svg>
    </Card>
  ) : (
    <Skeleton animation="wave" sx={{ height: "100%" }} />
  );
}
