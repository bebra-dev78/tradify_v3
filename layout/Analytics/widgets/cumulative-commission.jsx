"use client";

import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useTheme } from "@mui/material/styles";
import MenuItem from "@mui/material/MenuItem";
import Skeleton from "@mui/material/Skeleton";
import Select from "@mui/material/Select";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";

import { useMemo, useState } from "react";
import Chart from "react-apexcharts";
import { DateTime } from "luxon";
import moment from "moment";

import Iconify from "#/utils/iconify";

export default function CumulativeCommission({
  data,
  timeRange,
  isLoading,
  chartTypes,
  timeRangeStatus,
  handleDeleteWidget,
}) {
  const theme = useTheme();

  const [chartType, setChartType] = useState(() => {
    try {
      return chartTypes["cumulative-commission"] ?? "linear";
    } catch (e) {
      return "linear";
    }
  });

  const [series, categories] = useMemo(() => {
    switch (timeRangeStatus) {
      case "current-week":
        const currentDate = DateTime.now();
        const currentWeekStart = currentDate.startOf("week");

        const cumulativeCommissionData = data
          .filter((trade) => {
            const tradeDate = DateTime.fromMillis(parseInt(trade.entry_time));
            return tradeDate >= currentWeekStart && tradeDate <= currentDate;
          })
          .reduce((result, trade) => {
            const tradeCommission = parseFloat(trade.comission);
            const tradeDate = DateTime.fromMillis(parseInt(trade.entry_time));

            const dayOfWeek = tradeDate.weekday;

            if (!result[dayOfWeek]) {
              result[dayOfWeek] = 0;
            }

            result[dayOfWeek] += tradeCommission;

            return result;
          }, {});

        const cumulativeCommissionSeries = Object.values(cumulativeCommissionData);
        const cumulativeCommissionCategories = Object.keys(cumulativeCommissionData).map(
          (dayOfWeek) => DateTime.fromObject({ weekday: parseInt(dayOfWeek) }).toFormat("dd:MM")
        );

        return [cumulativeCommissionSeries, cumulativeCommissionCategories];
      default:
        return [[], []];
    }
  }, [data, timeRange, timeRangeStatus]);

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
          <>
            <FormControl sx={{ mr: 1 }} size="small">
              <InputLabel>Тип графика</InputLabel>
              <Select
                label="Тип графика"
                value={chartType}
                onChange={(e) => {
                  setChartType(e.target.value);
                  localStorage.setItem(
                    "chartTypes",
                    JSON.stringify({
                      ...chartTypes,
                      "cumulative-commission": e.target.value,
                    })
                  );
                }}
              >
                <MenuItem value={"linear"}>Линейный</MenuItem>
                <MenuItem value={"numeric"}>Числовой</MenuItem>
              </Select>
            </FormControl>
            <IconButton
              onClick={() => {
                handleDeleteWidget(4);
              }}
            >
              <Iconify
                icon="solar:close-square-outline"
                color="text.disabled"
              />
            </IconButton>
          </>
        }
        sx={{ p: "24px 24px 0px" }}
      />
      <Box sx={{ flexGrow: 1 }} />
      {chartType === "linear" ? (
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
            },
            dataLabels: {
              enabled: false,
            },
            xaxis: {
              categories,
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
                formatter: (value) => `$${value}`,
              },
            },
            tooltip: {
              x: {
                show: false,
              },
              y: {
                title: {
                  formatter: () => "",
                },
              },
            },
          }}
          series={[
            {
              name: "Всего",
              color: "rgb(255, 171, 0)",
              data: series,
            },
          ]}
          height="85%"
          type="area"
        />
      ) : (
        <Container
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <Typography variant="h3" sx={{ m: "auto" }}>
            Всего:
          </Typography>
          <Box
            sx={{
              m: "auto",
              lineHeight: 0,
              fontWeight: 700,
              cursor: "default",
              padding: "0px 6px",
              fontSize: "0.75rem",
              borderRadius: "6px",
              alignItems: "center",
              whiteSpace: "nowrap",
              width: "min-content",
              height: "min-content",
              display: "inline-flex",
              justifyContent: "center",
              backgroundColor: "rgba(0, 184, 217, 0.16)",
              transition: "all 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
              color:
                theme.palette.mode === "dark"
                  ? "rgb(97, 243, 243)"
                  : "rgb(0, 108, 156)",
            }}
          >
            <Typography variant="h3">
              ${Number(series[series.length - 1] || 0).toFixed(0)}
            </Typography>
          </Box>
        </Container>
      )}
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
