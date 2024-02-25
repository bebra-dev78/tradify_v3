"use client";

import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import { useTheme } from "@mui/material/styles";
import Skeleton from "@mui/material/Skeleton";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";

import { useMemo, memo } from "react";
import Chart from "react-apexcharts";
import moment from "moment";

import Iconify from "#/utils/iconify";

export default memo(function CounterOfTrades({
  data,
  isLoading,
  handleDeleteWidget,
}) {
  const theme = useTheme();

  const counter = useMemo(() => {
    if (data) {
      const s = {};
      const d = Array.from({ length: 7 }, (_, i) =>
        moment().subtract(i, "days").format("YYYY-MM-DD")
      );
      data
        .filter((trade) =>
          moment(parseInt(trade.entry_time)).isAfter(
            moment().subtract(7, "days")
          )
        )
        .forEach((trade) => {
          if (!s[trade.symbol]) {
            s[trade.symbol] = {};
            d.forEach((day) => (s[trade.symbol][day] = 0));
          }
          s[trade.symbol][
            moment(parseInt(trade.entry_time)).format("YYYY-MM-DD")
          ]++;
        });
      return Object.keys(s)
        .map((symbol) => ({
          name: symbol,
          data: d.map((day) => s[symbol][day]).reverse(),
        }))
        .filter((item) => item.data.some((value) => value !== 0));
    } else {
      return [];
    }
  }, [data]);

  return isLoading ? (
    <Skeleton sx={{ height: "100%" }} />
  ) : (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CardHeader
        title="Счетчик сделок"
        titleTypographyProps={{
          className: "drag-header",
          sx: { cursor: "move" },
        }}
        action={
          <IconButton
            onClick={() => {
              handleDeleteWidget(3);
            }}
          >
            <Iconify icon="solar:close-square-outline" color="text.disabled" />
          </IconButton>
        }
        sx={{ p: "24px 24px 0px" }}
      />
      <Box sx={{ flexGrow: 1 }} />
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
      <Box sx={{ flexGrow: 1 }} />
      <Iconify
        icon="tabler:border-corner-ios"
        color="#637381"
        width={18}
        sx={{
          position: "absolute",
          rotate: "180deg",
          bottom: 0,
          right: 0,
        }}
      />
    </Card>
  );
});
