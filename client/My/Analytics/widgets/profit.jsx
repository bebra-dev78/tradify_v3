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

export default memo(function CumulativeProfit({ trades, handleDeleteWidget }) {
  const theme = useTheme();

  const counter = useMemo(() => {
    if (trades !== null) {
      const last30DaysStart = moment()
        .subtract(30, "days")
        .startOf("day")
        .valueOf();
      const last30DaysEnd = moment().endOf("day").valueOf();

      const last30DaysTrades = trades.filter((trade) => {
        const entryTime = parseInt(trade.entry_time);
        return entryTime >= last30DaysStart && entryTime <= last30DaysEnd;
      });

      const cumulativeProfitByDay = Array.from({ length: 30 }, (_, index) => {
        const dayStart = moment()
          .subtract(index, "days")
          .startOf("day")
          .valueOf();
        const dayEnd = moment().subtract(index, "days").endOf("day").valueOf();

        const dailyTrades = last30DaysTrades.filter((trade) => {
          const entryTime = parseInt(trade.entry_time);
          return entryTime >= dayStart && entryTime <= dayEnd;
        });

        const dailyCumulativeProfit = dailyTrades.reduce(
          (acc, trade) =>
            acc + parseFloat(trade.income) - parseFloat(trade.comission),
          0
        );

        return dailyCumulativeProfit;
      });

      return cumulativeProfitByDay.reverse(); // Reverse the array to match the order of categories
    } else {
      return [];
    }
  }, [trades]);

  const categories = useMemo(
    () =>
      Array.from({ length: 30 }, (_, index) => {
        const date = moment().subtract(index, "days");
        return date.format("DD.MM");
      }).reverse(),
    []
  );

  return counter.length > 0 ? (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CardHeader
        title="Прибыль"
        titleTypographyProps={{
          className: "drag-header",
          sx: { cursor: "move" },
        }}
        action={
          <IconButton
            onClick={() => {
              handleDeleteWidget(6);
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
            categories: categories,
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
              offsetX: -10,
              formatter: (val) => val?.toFixed(0),
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
            name: "",
            color: "rgb(0, 167, 111)",
            data: counter,
          },
        ]}
        height="85%"
        type="area"
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
  ) : (
    <Skeleton animation="wave" sx={{ height: "100%" }} />
  );
});
