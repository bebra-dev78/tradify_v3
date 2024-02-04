"use client";

import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import { useTheme } from "@mui/material/styles";
import Skeleton from "@mui/material/Skeleton";
import Card from "@mui/material/Card";

import { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import moment from "moment";

import Iconify from "#/utils/iconify";

export default function CounterOfTrades({ trades, onDeleteWidget }) {
  const theme = useTheme();

  const [counter, setCounter] = useState([]);

  useEffect(() => {
    if (trades.length > 0) {
      const s = {};
      const d = Array.from({ length: 7 }, (_, i) =>
        moment().subtract(i, "days").format("YYYY-MM-DD")
      );
      trades
        .filter((trade) =>
          moment(Number(trade.entry_time)).isAfter(moment().subtract(7, "days"))
        )
        .forEach((trade) => {
          if (!s[trade.symbol]) {
            s[trade.symbol] = {};
            d.forEach((day) => (s[trade.symbol][day] = 0));
          }
          s[trade.symbol][
            moment(Number(trade.entry_time)).format("YYYY-MM-DD")
          ]++;
        });
      setCounter(
        Object.keys(s)
          .map((symbol) => ({
            name: symbol,
            data: d.map((day) => s[symbol][day]).reverse(),
          }))
          .filter((item) => item.data.some((value) => value !== 0))
      );
    }
  }, [trades]);

  return counter.length > 0 ? (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CardHeader
        title="Счетчик сделок"
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
            stacked: true,
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
          colors: [
            "#009E69",
            "#FF5630",
            "#FFAB00",
            "#006C9C",
            "#00bfa5",
            "#00b8d4",
            "#637381",
            "#795548",
          ],
          grid: {
            borderColor: "rgba(145, 158, 171, 0.2)",
            strokeDashArray: 3,
          },
          legend: {
            position: "top",
            horizontalAlign: "right",
            labels: {
              colors: theme.palette.text.primary,
            },
            fontFamily: "inherit",
            fontWeight: 500,
            fontSize: "13px",
            itemMargin: {
              horizontal: 14,
              vertical: 5,
            },
            markers: {
              width: 11,
              height: 11,
              offsetX: -2,
            },
          },
          dataLabels: {
            enabled: false,
          },
          plotOptions: {
            bar: {
              columnWidth: "13%",
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
          yaxis: {
            labels: {
              style: {
                colors: theme.palette.text.secondary,
              },
            },
          },
          xaxis: {
            categories: [
              moment().subtract(6, "days").format("L").split("/")[1] +
                "." +
                moment().subtract(6, "days").format("L").split("/")[0],
              moment().subtract(5, "days").format("L").split("/")[1] +
                "." +
                moment().subtract(5, "days").format("L").split("/")[0],
              moment().subtract(4, "days").format("L").split("/")[1] +
                "." +
                moment().subtract(4, "days").format("L").split("/")[0],
              moment().subtract(3, "days").format("L").split("/")[1] +
                "." +
                moment().subtract(3, "days").format("L").split("/")[0],
              moment().subtract(2, "days").format("L").split("/")[1] +
                "." +
                moment().subtract(2, "days").format("L").split("/")[0],
              moment().subtract(1, "days").format("L").split("/")[1] +
                "." +
                moment().subtract(1, "days").format("L").split("/")[0],
              moment().subtract(0, "days").format("L").split("/")[1] +
                "." +
                moment().subtract(0, "days").format("L").split("/")[0],
            ],
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
        }}
        series={counter}
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
