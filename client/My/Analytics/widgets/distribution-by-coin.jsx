"use client";

import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { useTheme } from "@mui/material/styles";
import Skeleton from "@mui/material/Skeleton";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";

import { useState, useEffect } from "react";
import Chart from "react-apexcharts";

import Iconify from "#/utils/iconify";

export default function DistributionByCoin({ trades, onDeleteWidget }) {
  const theme = useTheme();

  const [counter, setCounter] = useState({});

  useEffect(() => {
    if (trades.length > 0) {
      const u = {};
      trades.forEach((trade) => {
        u[trade.symbol] = u[trade.symbol] ? u[trade.symbol] + 1 : 1;
      });
      setCounter(u);
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
          <IconButton onClick={onDeleteWidget}>
            <Iconify
              icon="solar:close-square-outline"
              sx={{ color: "text.disabled" }}
            />
          </IconButton>
        }
        sx={{ p: "24px 24px 0px" }}
      />
      <Box sx={{ flexGrow: 1 }} />
      <Chart
        options={{
          chart: {
            type: "pie",
          },
          labels: Object.keys(counter),
          stroke: {
            show: true,
            colors: [theme.palette.background.paper],
            width: 3,
          },
          colors: [
            theme.palette.info.main,
            theme.palette.error.main,
            theme.palette.warning.main,
            theme.palette.success.main,
            theme.palette.secondary.main,
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
