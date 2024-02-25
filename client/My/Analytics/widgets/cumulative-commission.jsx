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

export default memo(function CumulativeCommission({
  data,
  isLoading,
  handleDeleteWidget,
}) {
  const theme = useTheme();

  const counter = useMemo(() => {
    if (data) {
      const last30DaysStart = moment()
        .subtract(30, "days")
        .startOf("day")
        .valueOf();
      const last30DaysEnd = moment().endOf("day").valueOf();

      const last30DaysTrades = data.filter((trade) => {
        const exitTime = parseInt(trade.exit_time);
        return exitTime >= last30DaysStart && exitTime <= last30DaysEnd;
      });

      const cumulativeCommission = [];
      let totalCommission = 0;

      last30DaysTrades.forEach((trade) => {
        totalCommission += parseFloat(trade.comission);
        cumulativeCommission.push(totalCommission.toFixed(3));
      });

      return cumulativeCommission.slice(-30);
    } else {
      return [];
    }
  }, [data]);

  return isLoading ? (
    <Skeleton sx={{ height: "100%" }} />
  ) : (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CardHeader
        title="Кумулятивная комиссия"
        titleTypographyProps={{
          className: "drag-header",
          sx: { cursor: "move" },
        }}
        action={
          <IconButton
            onClick={() => {
              handleDeleteWidget(4);
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
            categories: Array.from({ length: 30 }, (_, index) =>
              moment().subtract(index, "days").format("DD.MM")
            ).reverse(),
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
            color: "rgb(255, 171, 0)",
            data: counter,
          },
        ]}
        height={"85%"}
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
  );
});
