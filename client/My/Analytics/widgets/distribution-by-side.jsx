"use client";

import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import { useTheme } from "@mui/material/styles";
import Skeleton from "@mui/material/Skeleton";
import Card from "@mui/material/Card";

import { useState, useEffect } from "react";
import Chart from "react-apexcharts";

import Iconify from "#/utils/iconify";

export default function DistributionBySide({ trades, onDeleteWidget }) {
  const theme = useTheme();

  const [counter, setCounter] = useState([0, 0]);

  useEffect(() => {
    if (trades.length > 0) {
      let l = 0;
      let s = 0;
      trades.forEach((trade) => {
        if (trade.side === "BUY") {
          l++;
        } else {
          s++;
        }
      });
      setCounter([l, s]);
    }
  }, [trades]);

  return counter[0] > 0 || counter[1] > 0 ? (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CardHeader
        title="Распределение по LONG/SHORT"
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
            type: "donut",
          },
          labels: ["LONG", "SHORT"],
          colors: [theme.palette.info.main, theme.palette.warning.main],
          stroke: {
            show: true,
            colors: [theme.palette.background.paper],
            width: 3,
          },
          legend: {
            position: "bottom",
            horizontalAlign: "center",
            labels: {
              colors: "text.primary",
            },
            fontFamily: "inherit",
            fontWeight: 500,
            fontSize: "13px",
            itemMargin: {
              horizontal: 14,
            },
            markers: {
              width: 12,
              height: 12,
              offsetX: -2,
            },
          },
          dataLabels: {
            enabled: false,
          },
          tooltip: {
            fillSeriesColor: false,
          },
          plotOptions: {
            pie: {
              donut: {
                size: "90%",
                labels: {
                  show: true,
                  name: {
                    formatter: (v) => {
                      if (v === "LONG") {
                        return "Long";
                      } else if (v === "SHORT") {
                        return "Short";
                      } else {
                        return v;
                      }
                    },
                  },
                  value: {
                    fontSize: "1.5rem",
                    fontWeight: "700",
                    color: theme.palette.text.primary,
                  },
                  total: {
                    show: true,
                    label: "Всего",
                    fontFamily: "inherit",
                    fontWeight: 600,
                    color: theme.palette.text.secondary,
                  },
                },
              },
            },
          },
        }}
        series={counter}
        height={"70%"}
        type="donut"
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
