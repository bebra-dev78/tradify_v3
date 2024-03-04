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
    if (data) {
      let totalCommission = 0;

      switch (timeRangeStatus) {
        case "current-day":
          var cumulativeCommission = Array(24).fill(0);

          data.forEach((trade) => {
            var entryHour = moment(parseInt(trade.entry_time)).hour();

            for (let i = entryHour; i < 24; i++) {
              cumulativeCommission[i] += parseFloat(trade.comission);
            }
          });

          return [
            cumulativeCommission.map((totalCommission) =>
              totalCommission.toFixed(3)
            ),
            Array(24)
              .fill()
              .map((_, index) =>
                DateTime.now()
                  .startOf("day")
                  .plus({ hours: index })
                  .toFormat("HH:mm")
              ),
          ];

        case "current-week":
          const cumulativeCommissionWeek = Array(7).fill(0);

          data.forEach((trade) => {
            const entryDay = moment(parseInt(trade.entry_time)).day();

            // Accumulate commission for the current day and subsequent days in the week
            for (let i = entryDay; i < 7; i++) {
              cumulativeCommissionWeek[i] += parseFloat(trade.comission);
            }
          });

          return [
            cumulativeCommissionWeek.map((totalCommission) =>
              totalCommission.toFixed(3)
            ),
            Array(7)
              .fill()
              .map((_, index) =>
                DateTime.now()
                  .startOf("week")
                  .plus({ days: index })
                  .toFormat("dd.MM")
              ),
          ];

        case "current-month":
          const cumulativeCommissionMonth = Array(
            DateTime.now().daysInMonth
          ).fill(0);
          let currentDayMonth = 1;

          data.forEach((trade) => {
            const entryDay = moment(parseInt(trade.entry_time)).date();

            // Accumulate commission for the current day and subsequent days in the month
            for (let i = entryDay - 1; i < DateTime.now().daysInMonth; i++) {
              cumulativeCommissionMonth[i] += parseFloat(trade.comission);
            }
          });

          return [
            cumulativeCommissionMonth.map((totalCommission) =>
              totalCommission.toFixed(3)
            ),
            Array(DateTime.now().daysInMonth)
              .fill()
              .map(() => (currentDayMonth++).toString()),
          ];

        case "last-7":
          const cumulativeCommissionLast7 = Array(7).fill(0);

          data.forEach((trade) => {
            const entryDate = moment(parseInt(trade.entry_time)).format(
              "YYYY-MM-DD"
            );
            const index = moment().diff(entryDate, "days");

            // Accumulate commission for the current day and subsequent days in the last 7 days
            if (index >= 0 && index < 7) {
              cumulativeCommissionLast7[index] += parseFloat(trade.comission);
            }
          });

          return [
            cumulativeCommissionLast7.map((totalCommission) =>
              totalCommission.toFixed(3)
            ),
            Array(7)
              .fill()
              .map((_, index) =>
                DateTime.now()
                  .minus({ days: 6 - index })
                  .toFormat("dd.MM")
              ),
          ];

        case "last-30":
          const cumulativeCommissionLast30 = Array(30).fill(0);

          data.forEach((trade) => {
            const entryDate = moment(parseInt(trade.entry_time)).format(
              "YYYY-MM-DD"
            );
            const index = moment().diff(entryDate, "days");

            // Accumulate commission for the current day and subsequent days in the last 30 days
            if (index >= 0 && index < 30) {
              cumulativeCommissionLast30[index] += parseFloat(trade.comission);
            }
          });

          return [
            cumulativeCommissionLast30.map((totalCommission) =>
              totalCommission.toFixed(3)
            ),
            Array(30)
              .fill()
              .map((_, index) =>
                DateTime.now()
                  .minus({ days: 29 - index })
                  .toFormat("dd.MM")
              ),
          ];

        default:
          return [[], []];
      }
    } else {
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
