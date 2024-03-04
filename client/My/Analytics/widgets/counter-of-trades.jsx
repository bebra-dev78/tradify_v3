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

export default function СurrentOfTrades({
  data,
  colors,
  isLoading,
  chartTypes,
  timeRangeStatus,
  handleDeleteWidget,
}) {
  const theme = useTheme();

  const [chartType, setChartType] = useState(() => {
    try {
      return chartTypes["counter-of-trades"] ?? "bar";
    } catch (e) {
      return "bar";
    }
  });

  const [series, categories] = useMemo(() => {
    if (data) {
      let current = {};
      let bebra = [];

      switch (timeRangeStatus) {
        case "current-day":
          data.forEach((trade) => {
            var symbol = trade.symbol;
            if (!current[symbol]) {
              current[symbol] = Array(24).fill(0);
            }

            var entryHour = moment(parseInt(trade.entry_time)).hour();
            current[symbol][entryHour] += 1;
          });

          return [
            Object.entries(current).map(([symbol, counts]) => ({
              name: symbol,
              data: counts,
            })),
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
          data.forEach((trade) => {
            var symbol = trade.symbol;
            if (!current[symbol]) {
              current[symbol] = Array(7).fill(0);
            }

            var entryDay = moment(parseInt(trade.entry_time)).day();
            var luxonDayIndex = (entryDay + 6) % 7;
            current[symbol][luxonDayIndex] += 1;
          });

          return [
            Object.entries(current).map(([symbol, counts]) => ({
              name: symbol,
              data: counts,
            })),
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
          bebra = Array(DateTime.now().daysInMonth).fill(0);

          data.forEach((trade) => {
            var entryDay = moment(parseInt(trade.entry_time)).date();
            bebra[entryDay - 1] += 1;
          });

          return [
            [
              {
                name: "сделки",
                data: bebra,
              },
            ],
            Array(DateTime.now().daysInMonth)
              .fill()
              .map((_, index) =>
                DateTime.now()
                  .startOf("month")
                  .plus({ days: index })
                  .toFormat("dd")
              ),
          ];

        case "last-7":
          bebra = Array.from({ length: 7 }, (_, i) =>
            moment().subtract(i, "days").format("YYYY-MM-DD")
          );

          data.forEach((trade) => {
            if (!current[trade.symbol]) {
              current[trade.symbol] = {};
              bebra.forEach((day) => (current[trade.symbol][day] = 0));
            }
            current[trade.symbol][
              moment(parseInt(trade.entry_time)).format("YYYY-MM-DD")
            ]++;
          });

          return [
            Object.keys(current)
              .map((symbol) => ({
                name: symbol,
                data: bebra.map((day) => current[symbol][day]).reverse(),
              }))
              .filter((item) => item.data.some((value) => value !== 0)),
            Array(7)
              .fill()
              .map((_, index) =>
                DateTime.now()
                  .minus({ days: 6 - index })
                  .toFormat("dd.MM")
              ),
          ];

        case "last-30":
          bebra = Array.from({ length: 30 }, (_, i) =>
            DateTime.now().minus({ days: i }).toFormat("dd.MM")
          ).reverse();

          data.forEach((trade) => {
            var entryDay = moment(parseInt(trade.entry_time)).format("DD.MM");
            if (!current[entryDay]) {
              current[entryDay] = 0;
            }
            current[entryDay]++;
          });

          return [
            [
              {
                name: "сделки",
                data: bebra.map((day) => current[day] || 0),
              },
            ],
            bebra,
          ];

        default:
          return [[], []];
      }
    } else {
      return [[], []];
    }
  }, [data]);

  const disabled = timeRangeStatus === "custom";

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
          <>
            <FormControl sx={{ mr: 1 }} size="small" disabled={disabled}>
              <InputLabel>Тип графика</InputLabel>
              <Select
                label="Тип графика"
                value={disabled ? "numeric" : chartType}
                onChange={(e) => {
                  setChartType(e.target.value);
                  localStorage.setItem(
                    "chartTypes",
                    JSON.stringify({
                      ...chartTypes,
                      "counter-of-trades": e.target.value,
                    })
                  );
                }}
              >
                <MenuItem value={"bar"}>Столбчатый</MenuItem>
                <MenuItem value={"numeric"}>Числовой</MenuItem>
              </Select>
            </FormControl>
            <IconButton
              onClick={() => {
                handleDeleteWidget(3);
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
      {chartType === "bar" && !disabled && (
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
              animations: {
                dynamicAnimation: {
                  enabled: false,
                },
              },
            },
            colors,
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
              theme: true,
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
          }}
          series={series}
          height="85%"
          type="bar"
        />
      )}
      {(chartType === "numeric" || disabled) && (
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
            <Typography variant="h3">{data.length}</Typography>
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
