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

import { useState, useMemo } from "react";
import Chart from "react-apexcharts";
import moment from "moment";

import Iconify from "#/utils/iconify";

export default function StatisticsItem({ trades }) {
  const [openInfo, setOpenInfo] = useState(false);

  const counter = useMemo(() => 0, [trades]);

  return trades !== null ? (
    <Card>
      <CardHeader
        title="Статистика за 7 дней"
        action={
          <IconButton onClick={() => setOpenInfo((prev) => !prev)}>
            <Iconify
              icon="solar:info-circle-linear"
              sx={{ color: openInfo ? "secondary.main" : "text.secondary" }}
            />
          </IconButton>
        }
        sx={{ p: "24px 24px 0px" }}
      />
      <Collapse in={openInfo} timeout="auto" unmountOnExit>
        <Typography sx={{ p: "24px", color: "text.secondary" }}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis
          ipsam explicabo repudiandae aperiam doloribus quaerat veniam quam quo
          quidem, error dolorum vitae nulla dolorem. Labore debitis delectus qui
          incidunt, nisi et illum reprehenderit voluptate, saepe totam quaerat
          suscipit explicabo expedita?
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
              type: "line",
              stacked: false,
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
              categories: [
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
            yaxis: {
              labels: {
                style: {
                  colors: "#637381",
                  fontSize: "12px",
                  fontFamily: "inherit",
                },
                offsetX: -10,
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
            stroke: {
              show: true,
              curve: "smooth",
              colors: undefined,
              width: 2,
              dashArray: 0,
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
            plotOptions: {
              bar: {
                columnWidth: "30%",
              },
            },
          }}
          series={[
            {
              name: "Бебра",
              type: "column",
              data: [0, 0, 0, 0, 0, 0, 0],
            },
            {
              name: "Абоба",
              type: "area",
              data: [0, 0, 0, 0, 0, 0, 0],
            },
            {
              name: "Фандинг",
              type: "line",
              data: [0, 0, 0, 0, 0, 0, 0],
            },
          ]}
          height={364}
          type="line"
        />
      </Box>
      <Divider
        sx={{
          borderColor: "rgba(145, 158, 171, 0.24)",
          borderWidth: "0px 0px thin",
          borderStyle: "solid",
          margin: "0px",
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
            Бебра
          </Typography>
          <Typography
            sx={{
              fontWeight: "700",
              fontSize: "1.5rem",
            }}
          >
            {counter}
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
            Абоба
          </Typography>
          <Typography
            sx={{
              fontWeight: "700",
              fontSize: "1.5rem",
            }}
          >
            {counter}
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
            Фандинг
          </Typography>
          <Typography
            sx={{
              fontWeight: "700",
              fontSize: "1.5rem",
            }}
          >
            ${counter.toFixed(2)}
          </Typography>
        </Box>
      </Stack>
    </Card>
  ) : (
    <Skeleton animation="wave" sx={{ height: 590 }} />
  );
}
