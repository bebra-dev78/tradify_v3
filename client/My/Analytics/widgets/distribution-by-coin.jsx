"use client";

import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Skeleton from "@mui/material/Skeleton";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";

import { useMemo, memo } from "react";
import Chart from "react-apexcharts";

import Iconify from "#/utils/iconify";

export default memo(function DistributionByCoin({
  trades,
  handleDeleteWidget,
}) {
  const counter = useMemo(() => {
    if (trades !== null) {
      const u = {};
      trades.forEach((trade) => {
        u[trade.symbol] = u[trade.symbol] ? u[trade.symbol] + 1 : 1;
      });
      return u;
    } else {
      return {};
    }
  }, [trades]);

  return trades.length > 0 ? (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CardHeader
        title="Распределение по монетам"
        titleTypographyProps={{
          className: "drag-header",
          sx: { cursor: "move" },
        }}
        action={
          <IconButton
            onClick={() => {
              handleDeleteWidget(1);
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
            type: "pie",
            animations: {
              dynamicAnimation: {
                enabled: false,
              },
            },
          },
          labels: Object.keys(counter),
          stroke: {
            show: true,
            colors: ["rgb(33, 43, 54)"],
            width: 3,
          },
          colors: [
            "rgb(0, 184, 217)",
            "rgb(255, 86, 48)",
            "rgb(255, 171, 0)",
            "rgb(142, 51, 255)",
            "rgb(34, 197, 94)",
            "#009E69",
            "#FF5630",
            "#FFAB00",
            "#006C9C",
            "#00bfa5",
            "#00b8d4",
            "#637381",
          ],
          legend: {
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
          tooltip: {
            fillSeriesColor: false,
          },
          dataLabels: {
            enabled: true,
            style: {
              fontSize: "14px",
              fontFamily: "inherit",
              fontWeight: "400",
            },
            dropShadow: {
              enabled: false,
            },
          },
        }}
        series={Object.values(counter)}
        height={"65%"}
        type="pie"
      />
      <Box sx={{ flexGrow: 1 }} />
      <Divider />
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          textAlign: "center",
        }}
      >
        <Stack
          sx={{
            pt: "16px",
            pb: "16px",
            borderRight: "1px dashed rgba(145, 158, 171, 0.2)",
          }}
        >
          <Typography
            variant="body2"
            sx={{ mb: "8px", color: "text.secondary" }}
          >
            Всего монет
          </Typography>
          <Typography variant="h6">{Object.keys(counter).length}</Typography>
        </Stack>
        <Stack
          sx={{
            pt: "16px",
            pb: "16px",
          }}
        >
          <Typography
            variant="body2"
            sx={{ mb: "8px", color: "text.secondary" }}
          >
            Количество сделок
          </Typography>
          <Typography variant="h6">
            {Object.values(counter).reduce((a, v) => a + v, 0)}
          </Typography>
        </Stack>
      </Box>
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
