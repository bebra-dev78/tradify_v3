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

export default function CumulativeCommission({ trades, onDeleteWidget }) {
  const theme = useTheme();

  const [counter, setCounter] = useState([]);

  useEffect(() => {
    if (trades.length > 0) {
      const lastSevenDaysTrades = trades.filter((trade) => {
        const tradeDate = moment(Number(trade.exit_time));
        const lastSevenDays = moment().subtract(7, "days");
        return tradeDate.isAfter(lastSevenDays);
      });
      // Сортировка сделок по времени выхода (exit_time)
      lastSevenDaysTrades.sort(
        (a, b) => moment(Number(a.exit_time)) - moment(Number(b.exit_time))
      );
      const cumulativeCommission = [];
      let totalCommission = 0;
      lastSevenDaysTrades.forEach((trade) => {
        totalCommission += trade.comission;
        cumulativeCommission.push(totalCommission.toFixed(2));
      });
      // Формирование массива для series с кумулятивной комиссией
      setCounter(cumulativeCommission.slice(-7));
    }
  }, [trades]);

  return counter.length > 0 ? (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CardHeader
        title="Кумулятивная комиссия"
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
            type: "area",
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
          colors: ["#00A76F"],
          fill: {
            type: "gradient",
            gradient: {
              shadeIntensity: 1,
              inverseColors: false,
              opacityFrom: 0.45,
              opacityTo: 0.05,
              stops: [20, 100, 100, 100],
            },
          },
          grid: {
            borderColor: "rgba(145, 158, 171, 0.2)",
            strokeDashArray: 3,
            xaxis: {
              lines: {
                show: false,
              },
            },
            yaxis: {
              lines: {
                show: true,
              },
            },
            row: {
              colors: undefined,
              opacity: 0.5,
            },
            column: {
              colors: undefined,
              opacity: 0.5,
            },
            padding: {
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
            },
          },
          dataLabels: {
            enabled: false,
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
            name: "Всего",
            data: counter,
          },
        ]}
        height={"85%"}
        type="area"
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
