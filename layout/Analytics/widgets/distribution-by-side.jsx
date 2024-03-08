"use client";

import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import { useTheme } from "@mui/material/styles";
import Skeleton from "@mui/material/Skeleton";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";

import Chart from "react-apexcharts";
import { useMemo } from "react";

import Iconify from "#/utils/iconify";

export default function DistributionBySide({
  data,
  isLoading,
  handleDeleteWidget,
}) {
  const theme = useTheme();

  const counter = useMemo(() => {
    let l = 0;
    let s = 0;

    data.forEach((trade) => {
      if (trade.side === "BUY") {
        l++;
      } else {
        s++;
      }
    });

    return [l, s];
  }, [data]);

  return isLoading ? (
    <Skeleton sx={{ height: "100%" }} />
  ) : (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CardHeader
        title="Распределение по LONG/SHORT"
        titleTypographyProps={{
          className: "drag-header",
          sx: { cursor: "move" },
        }}
        action={
          <IconButton
            onClick={() => {
              handleDeleteWidget(2);
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
            type: "donut",
            animations: {
              dynamicAnimation: {
                enabled: false,
              },
            },
          },
          labels: ["LONG", "SHORT"],
          colors: [theme.palette.info.main, theme.palette.warning.main],
          stroke: {
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
            enabled: false,
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
        height="70%"
        type="donut"
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
}
