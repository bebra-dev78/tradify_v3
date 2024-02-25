"use client";

import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import { useTheme } from "@mui/material/styles";
import Skeleton from "@mui/material/Skeleton";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";

import { useMemo, memo } from "react";
import Chart from "react-apexcharts";

import Iconify from "#/utils/iconify";

export default memo(function CoinVolume({
  data,
  isLoading,
  handleDeleteWidget,
}) {
  const theme = useTheme();

  const counter = useMemo(() => {
    if (data) {
      const aggregatedData = data.reduce((acc, trade) => {
        if (acc[trade.symbol]) {
          acc[trade.symbol] += parseFloat(trade.volume);
        } else {
          acc[trade.symbol] = parseFloat(trade.volume);
        }
        return acc;
      }, {});

      return {
        categories: Object.keys(
          Object.fromEntries(
            Object.entries(aggregatedData).sort((a, b) => a[1] - b[1])
          )
        ),
        series: Object.values(
          Object.fromEntries(
            Object.entries(aggregatedData).sort((a, b) => a[1] - b[1])
          )
        ),
      };
    } else {
      return { categories: {}, series: {} };
    }
  }, [data]);

  return isLoading ? (
    <Skeleton sx={{ height: "100%" }} />
  ) : (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CardHeader
        title="Объём по монете"
        titleTypographyProps={{
          className: "drag-header",
          sx: { cursor: "move" },
        }}
        action={
          <IconButton
            onClick={() => {
              handleDeleteWidget(5);
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
            marker: { show: false },
            x: {
              show: false,
            },
            y: {
              formatter: (value) => `$${value.toFixed(0)}`,
              title: {
                formatter: () => "",
              },
            },
            style: {
              fontSize: "14px",
              fontFamily: "inherit",
            },
          },
        }}
        series={[
          {
            data: counter.series,
          },
        ]}
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
