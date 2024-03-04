"use client";

import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";

import useSWRImmutable from "swr/immutable";
import { useState, useMemo } from "react";
import Chart from "react-apexcharts";
import moment from "moment";

import Iconify from "#/utils/iconify";

export default function StatisticsItem() {
  const { data, isLoading } = useSWRImmutable("null");

  const [openInfo, setOpenInfo] = useState(false);

  const counter = useMemo(() => {
    if (data) {
      const filteredTrades = data.filter((trade) => {
        const entryTime = parseInt(trade.entry_time);
        const lastWeekTimestamp = moment().subtract(7, "days").valueOf();
        return entryTime >= lastWeekTimestamp;
      });

      const daysData = Array(7)
        .fill(0)
        .map((_, index) => {
          const dayStart = moment()
            .subtract(6 - index, "days")
            .startOf("day")
            .valueOf();
          const dayEnd = moment()
            .subtract(6 - index, "days")
            .endOf("day")
            .valueOf();

          const dailyTrades = filteredTrades.filter((trade) => {
            const entryTime = parseInt(trade.entry_time);
            return entryTime >= dayStart && entryTime <= dayEnd;
          });

          return {
            profit: dailyTrades.reduce(
              (acc, trade) =>
                acc + (parseFloat(trade.income) - parseFloat(trade.comission)),
              0
            ),
            commission: dailyTrades.reduce(
              (acc, trade) => acc + parseFloat(trade.comission),
              0
            ),
            income: dailyTrades.reduce(
              (acc, trade) => acc + parseFloat(trade.income),
              0
            ),
          };
        });

      return {
        profitData: daysData.map((day) => day.profit),
        commissionData: daysData.map((day) => day.commission),
        incomeData: daysData.map((day) => day.income),
        cumulativeProfit: daysData
          .reduce((acc, day) => acc + day.profit, 0)
          .toFixed(2),
        cumulativeCommission: daysData
          .reduce((acc, day) => acc + day.commission, 0)
          .toFixed(3),
        cumulativeIncome: daysData
          .reduce((acc, day) => acc + day.income, 0)
          .toFixed(3),
      };
    } else {
      return {
        profitData: [0, 0, 0, 0, 0, 0, 0],
        commissionData: [0, 0, 0, 0, 0, 0, 0],
        incomeData: [0, 0, 0, 0, 0, 0, 0],
        cumulativeProfit: 0,
        cumulativeCommission: 0,
        cumulativeIncome: 0,
      };
    }
  }, [data]);

  const categories = useMemo(
    () => [
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
    []
  );

  return isLoading ? (
    <Skeleton sx={{ height: 592 }} />
  ) : (
    <Card>
      <CardHeader
        title="Статистика за 7 дней"
        action={
          <IconButton onClick={() => setOpenInfo((prev) => !prev)}>
            <Iconify icon="solar:info-circle-linear" color="text.disabled" />
          </IconButton>
        }
        sx={{ p: "24px 24px 0px" }}
      />
      <Collapse in={openInfo} timeout="auto" unmountOnExit>
        <Typography sx={{ p: "24px", color: "text.secondary" }}>
          Сводка данных за последние 7 дней в виде графика. Чтобы отобразить или
          скрыть тип данных, нажмите на маркеры справа.
        </Typography>
      </Collapse>
      <Box
        sx={{
          marginLeft: "20px",
          marginRight: "20px",
          paddingTop: "16.4px",
          paddingBottom: "16.4px",
        }}
      >
        <Chart
          options={{
            chart: {
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
            stroke: {
              width: [0, 4, 3],
              curve: "smooth",
            },
            plotOptions: {
              bar: {
                columnWidth: "20%",
                borderRadius: 5,
              },
            },
            fill: {
              type: ["solid", "solid", "gradient"],
              gradient: {
                type: "vertical",
                shadeIntensity: 0.5,
                inverseColors: false,
                opacityFrom: 0.5,
                opacityTo: 0.2,
                stops: [20, 100, 100, 100],
              },
            },
            legend: {
              position: "top",
              horizontalAlign: "right",
              labels: {
                colors: "text.primary",
              },
              fontWeight: 500,
              fontSize: "13px",
              fontFamily: "inherit",
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
            grid: {
              borderColor: "rgba(145, 158, 171, 0.2)",
              strokeDashArray: 3,
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
                  colors: "#637381",
                  fontSize: "12px",
                  fontFamily: "inherit",
                },
              },
            },
            markers: {
              strokeColors: "rgba(22, 28, 36, 0.8)",
            },
            yaxis: {
              max: data.length === 0 ? 5 : undefined,
              min: data.length === 0 ? 0 : undefined,
              labels: {
                style: {
                  colors: "#637381",
                  fontSize: "12px",
                  fontFamily: "inherit",
                },
                offsetX: -10,
                formatter: (val) => `${val?.toFixed(0)}$`,
              },
            },
            tooltip: {
              x: {
                show: false,
              },
              y: {
                formatter: (val) => `${val?.toFixed(2)}$`,
              },
              style: {
                fontSize: "12px",
                fontFamily: "inherit",
              },
            },
          }}
          series={[
            {
              name: "Доход",
              type: "column",
              color: "rgb(142, 51, 255)",
              data: counter.incomeData,
            },
            {
              name: "Комиссия",
              type: "line",
              color: "rgb(0, 184, 217)",
              data: counter.commissionData,
            },
            {
              name: "Прибыль",
              type: "area",
              color: "rgb(255, 171, 0)",
              data: counter.profitData,
            },
          ]}
          height={364}
        />
      </Box>
      <Divider
        sx={{
          borderStyle: "solid",
        }}
      />
      <Stack flexDirection="row">
        <Box
          sx={{
            paddingTop: "16px",
            paddingBottom: "16px",
            width: "100%",
            textAlign: "center",
          }}
        >
          <Typography
            sx={{
              margin: "0px 0px 8px",
              color: "rgb(145, 158, 171)",
            }}
          >
            Прибыль
          </Typography>
          <Typography
            sx={{
              fontWeight: "700",
              fontSize: "1.5rem",
            }}
          >
            {counter.cumulativeProfit}$
          </Typography>
        </Box>
        <Divider
          orientation="vertical"
          flexItem
          sx={{
            borderWidth: "0px thin 0px 0px",
            borderColor: "rgba(145, 158, 171, 0.24)",
            borderStyle: "solid",
          }}
        />
        <Box
          sx={{
            paddingTop: "16px",
            paddingBottom: "16px",
            width: "100%",
            textAlign: "center",
          }}
        >
          <Typography
            sx={{
              margin: "0px 0px 8px",
              color: "rgb(145, 158, 171)",
            }}
          >
            Комиссия
          </Typography>
          <Typography
            sx={{
              fontWeight: "700",
              fontSize: "1.5rem",
            }}
          >
            {counter.cumulativeCommission}$
          </Typography>
        </Box>
        <Divider
          orientation="vertical"
          flexItem
          sx={{
            borderWidth: "0px thin 0px 0px",
            borderColor: "rgba(145, 158, 171, 0.24)",
            borderStyle: "solid",
          }}
        />
        <Box
          sx={{
            paddingTop: "16px",
            paddingBottom: "16px",
            width: "100%",
            textAlign: "center",
          }}
        >
          <Typography
            sx={{
              margin: "0px 0px 8px",
              color: "rgb(145, 158, 171)",
            }}
          >
            Доход
          </Typography>
          <Typography
            sx={{
              fontWeight: "700",
              fontSize: "1.5rem",
            }}
          >
            {counter.cumulativeIncome}$
          </Typography>
        </Box>
      </Stack>
    </Card>
  );
}
