"use client";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import FormControlLabel from "@mui/material/FormControlLabel";
import DialogContent from "@mui/material/DialogContent";
import useMediaQuery from "@mui/material/useMediaQuery";
import NativeSelect from "@mui/material/NativeSelect";
import FormControl from "@mui/material/FormControl";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import RadioGroup from "@mui/material/RadioGroup";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2";
import Collapse from "@mui/material/Collapse";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Switch from "@mui/material/Switch";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Radio from "@mui/material/Radio";
import Card from "@mui/material/Card";
import Menu from "@mui/material/Menu";
import Box from "@mui/material/Box";

import { useState, useEffect, useRef, memo } from "react";
import crypto from "crypto";
import axios from "axios";

import Annotations from "#/client/My/Trades/tools/annotations";
import { useMode } from "#/client/Global/theme-registry";
import Figures from "#/client/My/Trades/tools/figures";
import Lineup from "#/client/My/Trades/tools/lineup";
import Lines from "#/client/My/Trades/tools/lines";
import Cuts from "#/client/My/Trades/tools/cuts";
import { useKeys } from "#/app/my/layout";
import Iconify from "#/utils/iconify";
import {
  init,
  dispose,
  getFigureClass,
  registerLocale,
  registerOverlay,
  registerIndicator,
} from "klinecharts";

registerLocale("ru", {
  time: "Время：",
  open: "Open: ",
  high: "High: ",
  low: "Low: ",
  close: "Close: ",
  volume: "Объём: ",
  turnover: "Оборот: ",
});

registerOverlay({
  name: "lineup",
  needDefaultPointFigure: true,
  needDefaultXAxisFigure: true,
  needDefaultYAxisFigure: true,
  totalStep: 3,
  createPointFigures: ({ coordinates, overlay }) => {
    if (coordinates.length === 2) {
      var x1 = Math.min(coordinates[0].x, coordinates[1].x);
      var y1 = Math.min(coordinates[0].y, coordinates[1].y);
      var x2 = Math.max(coordinates[0].x, coordinates[1].x);
      var y2 = Math.max(coordinates[0].y, coordinates[1].y);

      var verticalDown = coordinates[1].y > coordinates[0].y;
      var horizontalLeft = coordinates[1].x < coordinates[0].x;

      var centerX = (x1 + x2) / 2;
      var centerY = (y1 + y2) / 2;

      var currentColor = verticalDown
        ? "rgb(249, 40, 85)"
        : "rgb(22, 119, 255)";

      var styles = {
        color: currentColor,
      };

      return [
        {
          key: "lineup",
          type: "rect",
          attrs: {
            x: Math.min(x1, x2),
            y: Math.min(y1, y2),
            width: Math.abs(x2 - x1),
            height: Math.abs(y2 - y1),
          },
          styles: {
            color: verticalDown
              ? "rgba(249, 40, 85, .25)"
              : "rgba(22, 119, 255, .25)",
          },
        },
        {
          type: "line",
          attrs: {
            coordinates: [
              { x: x1, y: centerY },
              { x: x2, y: centerY },
            ],
          },
          styles,
        },
        {
          type: "line",
          attrs: {
            coordinates: [
              { x: horizontalLeft ? x1 + 10 : x2 - 10, y: centerY + 5 },
              { x: horizontalLeft ? x1 : x2, y: centerY },
            ],
          },
          styles,
        },
        {
          type: "line",
          attrs: {
            coordinates: [
              { x: horizontalLeft ? x1 + 10 : x2 - 10, y: centerY - 5 },
              { x: horizontalLeft ? x1 : x2, y: centerY },
            ],
          },
          styles,
        },
        {
          type: "line",
          attrs: {
            coordinates: [
              { x: centerX, y: y1 },
              { x: centerX, y: y2 },
            ],
          },
          styles,
        },
        {
          type: "line",
          attrs: {
            coordinates: [
              { x: centerX + 5, y: verticalDown ? y2 - 10 : y1 + 10 },
              { x: centerX, y: verticalDown ? y2 : y1 },
            ],
          },
          styles,
        },
        {
          type: "line",
          attrs: {
            coordinates: [
              { x: centerX - 5, y: verticalDown ? y2 - 10 : y1 + 10 },
              { x: centerX, y: verticalDown ? y2 : y1 },
            ],
          },
          styles,
        },
        {
          type: "text",
          attrs: {
            x: x1,
            y: y2 + 10,
            text: `${(
              overlay.points[1].value - overlay.points[0].value
            ).toFixed(4)}$ || ${(
              ((overlay.points[1].value - overlay.points[0].value) /
                overlay.points[0].value) *
              100
            ).toFixed(2)}%`,
          },
          styles: {
            style: "stroke_fill",
            family: "inherit",
            borderColor: currentColor,
            backgroundColor: currentColor,
          },
        },
      ];
    }
    return [];
  },
});

registerOverlay({
  name: "sampleEightWaves",
  needDefaultPointFigure: true,
  needDefaultXAxisFigure: true,
  needDefaultYAxisFigure: true,
  totalStep: 10,
  createPointFigures: ({ coordinates }) => {
    if (coordinates.length <= 10) {
      return {
        key: "sampleEightWaves",
        type: "line",
        attrs: {
          coordinates,
        },
        styles: {
          style: "dashed",
        },
      };
    }

    return [];
  },
});

registerOverlay({
  name: "sampleFiveWaves",
  needDefaultPointFigure: true,
  needDefaultXAxisFigure: true,
  needDefaultYAxisFigure: true,
  totalStep: 7,
  createPointFigures: ({ coordinates }) => {
    if (coordinates.length <= 7) {
      return {
        key: "sampleFiveWaves",
        type: "line",
        attrs: {
          coordinates,
        },
        styles: {
          style: "dashed",
        },
      };
    }

    return [];
  },
});

registerOverlay({
  name: "sampleThreeWaves",
  needDefaultPointFigure: true,
  needDefaultXAxisFigure: true,
  needDefaultYAxisFigure: true,
  totalStep: 5,
  createPointFigures: ({ coordinates }) => {
    if (coordinates.length <= 5) {
      return {
        key: "sampleThreeWaves",
        type: "line",
        attrs: {
          coordinates,
        },
        styles: {
          style: "dashed",
        },
      };
    }

    return [];
  },
});

registerOverlay({
  name: "sampleParallelogram",
  needDefaultPointFigure: true,
  needDefaultXAxisFigure: true,
  needDefaultYAxisFigure: true,
  totalStep: 5,
  createPointFigures: ({ coordinates }) => {
    if (coordinates.length === 2) {
      return {
        key: "sampleParallelogram",
        type: "line",
        attrs: {
          coordinates,
        },
      };
    }

    if (coordinates.length === 3 || coordinates.length === 4) {
      return {
        key: "sampleParallelogram",
        type: "polygon",
        attrs: {
          coordinates,
        },
        styles: {
          style: "stroke_fill",
        },
      };
    }

    return [];
  },
});

registerOverlay({
  name: "sampleTriangle",
  needDefaultPointFigure: true,
  needDefaultXAxisFigure: true,
  needDefaultYAxisFigure: true,
  totalStep: 4,
  createPointFigures: ({ coordinates }) => {
    if (coordinates.length === 2) {
      return {
        key: "sampleTriangle",
        type: "line",
        attrs: {
          coordinates,
        },
      };
    }

    if (coordinates.length === 3) {
      return {
        key: "sampleTriangle",
        type: "polygon",
        attrs: {
          coordinates,
        },
        // styles: {
        //   style: "stroke_fill",
        // },
      };
    }
    return [];
  },
});

registerOverlay({
  name: "sampleRect",
  needDefaultPointFigure: true,
  needDefaultXAxisFigure: true,
  needDefaultYAxisFigure: true,
  totalStep: 3,
  createPointFigures: ({ coordinates }) => {
    if (coordinates.length === 2) {
      const x1 = Math.min(coordinates[0].x, coordinates[1].x);
      const y1 = Math.min(coordinates[0].y, coordinates[1].y);
      const x2 = Math.max(coordinates[0].x, coordinates[1].x);
      const y2 = Math.max(coordinates[0].y, coordinates[1].y);
      return {
        key: "sampleRect",
        type: "rect",
        attrs: {
          x: Math.min(x1, x2),
          y: Math.min(y1, y2),
          width: Math.abs(x2 - x1),
          height: Math.abs(y2 - y1),
        },
        styles: {
          style: "stroke_fill",
        },
      };
    }
    return [];
  },
});

registerOverlay({
  name: "sampleCircle",
  needDefaultPointFigure: true,
  needDefaultXAxisFigure: true,
  needDefaultYAxisFigure: true,
  totalStep: 3,
  createPointFigures: ({ coordinates }) => {
    if (coordinates.length === 2) {
      const xDis = Math.abs(coordinates[0].x - coordinates[1].x);
      const yDis = Math.abs(coordinates[0].y - coordinates[1].y);
      return {
        key: "sampleCircle",
        type: "circle",
        attrs: {
          ...coordinates[0],
          r: Math.sqrt(xDis * xDis + yDis * yDis),
        },
        styles: {
          style: "stroke_fill",
        },
      };
    }
    return [];
  },
});

const mainDataStartTimestaps = {
  "1m": 600000,
  "3m": 1800000,
  "5m": 3000000,
  "30m": 18000000,
  "1h": 38100000,
  "2h": 77700000,
  "6h": 228900000,
  "1d": 941700000,
  "3d": 2842500000,
  "1w": 6644100000,
  "1M": 27898500000,
};

const mainDataEndTimestaps = {
  "1m": 5400000,
  "3m": 16200000,
  "5m": 27000000,
  "30m": 162000000,
  "1h": 321900000,
  "2h": 642300000,
  "6h": 1931100000,
  "1d": 7698300000,
  "3d": 23077500000,
  "1w": 53835900000,
  "1M": 239941500000,
};

const subDataStartTimestaps = {
  "1m": 6600000,
  "3m": 19740000,
  "5m": 33000000,
  "30m": 196500000,
  "1h": 398100000,
  "2h": 797700000,
  "6h": 2388900000,
  "1d": 9581700000,
  "3d": 28503300000,
  "1w": 63149700000,
  "1M": 270941700000,
};

const subDataEndTimestaps = {
  "1m": 600001,
  "3m": 1740001,
  "5m": 3000001,
  "30m": 16500001,
  "1h": 38100001,
  "2h": 77700001,
  "6h": 228900001,
  "1d": 941700001,
  "3d": 2583300001,
  "1w": 2669700001,
  "1M": 3101700001,
};

const convertIntervalsForBibyt = {
  "1m": 1,
  "3m": 3,
  "5m": 5,
  "30m": 30,
  "1h": 60,
  "2h": 120,
  "6h": 360,
  "1d": "D",
  "3d": 720,
  "1w": "W",
  "1M": "M",
};

function roundTimeToInterval(dealTime, interval) {
  const intervals = {
    "1m": 60,
    "3m": 180,
    "5m": 300,
    "30m": 1800,
    "1h": 3600,
    "2h": 7200,
    "6h": 21600,
    "1d": 86400,
    "3d": 259200,
    "1w": 604800,
    "1M": 2592000,
  };

  const intervalSeconds = intervals[interval];

  return (
    Math.floor(dealTime / (intervalSeconds * 1000)) * intervalSeconds * 1000
  );
}

const LineFigure = getFigureClass("line");
const TextFigure = getFigureClass("text");

const OptionsMenu = memo(function OptionsMenu({
  changeCandleTypeRef,
  showGridRef,
  setActivate,
  dataRef,
}) {
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <>
      <Tooltip title="Настройки" arrow>
        <IconButton
          onClick={() => {
            setOpenDialog(true);
          }}
          sx={{ color: "text.secondary" }}
        >
          <Iconify icon="solar:settings-minimalistic-bold-duotone" />
        </IconButton>
      </Tooltip>
      <Dialog
        open={openDialog}
        maxWidth="sm"
        fullWidth
        onClose={() => {
          setOpenDialog(false);
        }}
        PaperProps={{
          sx: {
            padding: 0,
            boxShadow: "none",
            borderRadius: "16px",
            backdropFilter: "none",
            backgroundImage: "none",
            backgroundPosition: "unset",
            backgroundRepeat: "no-repeat",
          },
        }}
      >
        <DialogTitle sx={{ p: "24px" }}>Настройки</DialogTitle>
        <DialogContent sx={{ pr: 3, pl: 3 }}>
          <Grid container>
            <Grid item xs={6} md={6}>
              <Typography variant="subtitle1" sx={{ mb: 5, mt: 2 }}>
                Тип графика
              </Typography>
              <Typography variant="subtitle1">Показать сетку</Typography>
            </Grid>
            <Grid item xs={6} md={6}>
              <Select
                fullWidth
                defaultValue={
                  localStorage.getItem("candleType") ?? "candle_solid"
                }
                onChange={(e) => {
                  changeCandleTypeRef.current(e.target.value);
                  localStorage.setItem("candleType", e.target.value);
                }}
              >
                <MenuItem value="candle_solid">Сплошная</MenuItem>
                <MenuItem value="candle_stroke">Штрих</MenuItem>
                <MenuItem value="candle_up_stroke">Штрих вверх</MenuItem>
                <MenuItem value="candle_down_stroke">Штрих вниз</MenuItem>
                <MenuItem value="ohlc">OHLC</MenuItem>
                <MenuItem value="area">Area</MenuItem>
              </Select>
              <Switch
                defaultChecked={
                  JSON.parse(localStorage.getItem("statusGrid")) ?? true
                }
                onChange={(e) => {
                  showGridRef.current(e.target.checked);
                  localStorage.setItem("statusGrid", e.target.checked);
                }}
                sx={{ mt: 3 }}
              />
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
      <Tooltip title="Закрыть" arrow>
        <IconButton
          color="error"
          onClick={() => {
            setActivate({ status: false });
            setTimeout(() => {
              dataRef.current = null;
            }, 1000);
          }}
        >
          <CloseRoundedIcon />
        </IconButton>
      </Tooltip>
    </>
  );
});

const HeaderIndicators = memo(function HeaderIndicators({
  installMainIndicatorRef,
  removeMainIndicatorRef,
  installSubIndicatorRef,
  removeSubIndicatorRef,
  activate,
}) {
  const isSmallScreen = useMediaQuery("(max-width:900px)");

  const [indicators, setIndicators] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    setIndicators(["Buy/Sell"]);
  }, [activate]);

  return (
    <>
      {isSmallScreen ? (
        <IconButton
          onClick={(e) => {
            setAnchorEl(e.currentTarget);
          }}
          sx={{ color: "text.secondary" }}
        >
          <Iconify icon="solar:tuning-line-duotone" />
        </IconButton>
      ) : (
        <Button
          variant="outlined"
          color="inherit"
          startIcon={<Iconify icon="solar:tuning-line-duotone" />}
          onClick={(e) => {
            setAnchorEl(e.currentTarget);
          }}
        >
          Индикаторы
        </Button>
      )}
      <Menu
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        onClose={() => {
          setAnchorEl(null);
        }}
      >
        <MenuItem
          onClick={() => {
            if (indicators.some((indicator) => indicator === "MA")) {
              removeMainIndicatorRef.current("MA");
              setIndicators((prev) => prev.filter((i) => i !== "MA"));
            } else {
              installMainIndicatorRef.current("MA");
              setIndicators((prev) => [...prev, "MA"]);
            }
          }}
          sx={{
            backgroundColor: indicators.some((indicator) => indicator === "MA")
              ? "rgba(0, 167, 111, 0.16)"
              : "transparent",
            "&:hover": {
              backgroundColor: indicators.some(
                (indicator) => indicator === "MA"
              )
                ? "rgba(0, 167, 111, 0.32)"
                : "rgba(255, 255, 255, 0.08)",
            },
          }}
        >
          MA - средняя скользящая
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (indicators.some((indicator) => indicator === "EMA")) {
              removeMainIndicatorRef.current("EMA");
              setIndicators((prev) => prev.filter((i) => i !== "EMA"));
            } else {
              installMainIndicatorRef.current("EMA");
              setIndicators((prev) => [...prev, "EMA"]);
            }
          }}
          sx={{
            backgroundColor: indicators.some((indicator) => indicator === "EMA")
              ? "rgba(0, 167, 111, 0.16)"
              : "transparent",
            "&:hover": {
              backgroundColor: indicators.some(
                (indicator) => indicator === "EMA"
              )
                ? "rgba(0, 167, 111, 0.32)"
                : "rgba(255, 255, 255, 0.08)",
            },
          }}
        >
          EMA - экспоненциальная скользящая средняя
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (indicators.some((indicator) => indicator === "SMA")) {
              removeMainIndicatorRef.current("SMA");
              setIndicators((prev) => prev.filter((i) => i !== "SMA"));
            } else {
              installMainIndicatorRef.current("SMA");
              setIndicators((prev) => [...prev, "SMA"]);
            }
          }}
          sx={{
            backgroundColor: indicators.some((indicator) => indicator === "SMA")
              ? "rgba(0, 167, 111, 0.16)"
              : "transparent",
            "&:hover": {
              backgroundColor: indicators.some(
                (indicator) => indicator === "SMA"
              )
                ? "rgba(0, 167, 111, 0.32)"
                : "rgba(255, 255, 255, 0.08)",
            },
          }}
        >
          SMA - простая скользящая средняя
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (indicators.some((indicator) => indicator === "BOLL")) {
              removeMainIndicatorRef.current("BOLL");
              setIndicators((prev) => prev.filter((i) => i !== "BOLL"));
            } else {
              installMainIndicatorRef.current("BOLL");
              setIndicators((prev) => [...prev, "BOLL"]);
            }
          }}
          sx={{
            backgroundColor: indicators.some(
              (indicator) => indicator === "BOLL"
            )
              ? "rgba(0, 167, 111, 0.16)"
              : "transparent",
            "&:hover": {
              backgroundColor: indicators.some(
                (indicator) => indicator === "BOLL"
              )
                ? "rgba(0, 167, 111, 0.32)"
                : "rgba(255, 255, 255, 0.08)",
            },
          }}
        >
          BOLL - полосы Боллинджера
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (indicators.some((indicator) => indicator === "Buy/Sell")) {
              removeMainIndicatorRef.current("Buy/Sell");
              setIndicators((prev) => prev.filter((i) => i !== "Buy/Sell"));
            } else {
              installMainIndicatorRef.current("Buy/Sell");
              setIndicators((prev) => [...prev, "Buy/Sell"]);
            }
          }}
          sx={{
            backgroundColor: indicators.some(
              (indicator) => indicator === "Buy/Sell"
            )
              ? "rgba(0, 167, 111, 0.16)"
              : "transparent",
            "&:hover": {
              backgroundColor: indicators.some(
                (indicator) => indicator === "Buy/Sell"
              )
                ? "rgba(0, 167, 111, 0.32)"
                : "rgba(255, 255, 255, 0.08)",
            },
          }}
        >
          Buy/Sell - индикатор сделок
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (indicators.some((indicator) => indicator === "VOL")) {
              removeSubIndicatorRef.current(["VOL", "pane_1"]);
              setIndicators((prev) => prev.filter((i) => i !== "VOL"));
            } else {
              installSubIndicatorRef.current(["VOL", "pane_1"]);
              setIndicators((prev) => [...prev, "VOL"]);
            }
          }}
          sx={{
            backgroundColor: indicators.some((indicator) => indicator === "VOL")
              ? "rgba(0, 167, 111, 0.16)"
              : "transparent",
            "&:hover": {
              backgroundColor: indicators.some(
                (indicator) => indicator === "VOL"
              )
                ? "rgba(0, 167, 111, 0.32)"
                : "rgba(255, 255, 255, 0.08)",
            },
          }}
        >
          VOL - индикатор объёма
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (indicators.some((indicator) => indicator === "MACD")) {
              removeSubIndicatorRef.current(["MACD", "pane_2"]);
              setIndicators((prev) => prev.filter((i) => i !== "MACD"));
            } else {
              installSubIndicatorRef.current(["MACD", "pane_2"]);
              setIndicators((prev) => [...prev, "MACD"]);
            }
          }}
          sx={{
            backgroundColor: indicators.some(
              (indicator) => indicator === "MACD"
            )
              ? "rgba(0, 167, 111, 0.16)"
              : "transparent",
            "&:hover": {
              backgroundColor: indicators.some(
                (indicator) => indicator === "MACD"
              )
                ? "rgba(0, 167, 111, 0.32)"
                : "rgba(255, 255, 255, 0.08)",
            },
          }}
        >
          MACD - схождение/расхождение скользящих средних
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (indicators.some((indicator) => indicator === "KDJ")) {
              removeSubIndicatorRef.current(["KDJ", "pane_3"]);
              setIndicators((prev) => prev.filter((i) => i !== "KDJ"));
            } else {
              installSubIndicatorRef.current(["KDJ", "pane_3"]);
              setIndicators((prev) => [...prev, "KDJ"]);
            }
          }}
          sx={{
            backgroundColor: indicators.some((indicator) => indicator === "KDJ")
              ? "rgba(0, 167, 111, 0.16)"
              : "transparent",
            "&:hover": {
              backgroundColor: indicators.some(
                (indicator) => indicator === "KDJ"
              )
                ? "rgba(0, 167, 111, 0.32)"
                : "rgba(255, 255, 255, 0.08)",
            },
          }}
        >
          KDJ - индикатор стохастического осциллятора
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (indicators.some((indicator) => indicator === "RSI")) {
              removeSubIndicatorRef.current(["RSI", "pane_4"]);
              setIndicators((prev) => prev.filter((i) => i !== "RSI"));
            } else {
              installSubIndicatorRef.current(["RSI", "pane_4"]);
              setIndicators((prev) => [...prev, "RSI"]);
            }
          }}
          sx={{
            backgroundColor: indicators.some((indicator) => indicator === "RSI")
              ? "rgba(0, 167, 111, 0.16)"
              : "transparent",
            "&:hover": {
              backgroundColor: indicators.some(
                (indicator) => indicator === "RSI"
              )
                ? "rgba(0, 167, 111, 0.32)"
                : "rgba(255, 255, 255, 0.08)",
            },
          }}
        >
          RSI - индекс относительной силы
        </MenuItem>
      </Menu>
    </>
  );
});

export default function KlinesChart({ dataRef, activate, setActivate }) {
  const isSmallScreen = useMediaQuery("(max-width:900px)");
  const { keys } = useKeys();
  const { mode } = useMode();

  const installMainIndicatorRef = useRef(null);
  const removeMainIndicatorRef = useRef(null);
  const installSubIndicatorRef = useRef(null);
  const removeSubIndicatorRef = useRef(null);
  const unsubscribeActionRef = useRef(null);
  const changeKlinesDataRef = useRef(null);
  const changeCandleTypeRef = useRef(null);
  const subscribeActionRef = useRef(null);
  const addOverlayRef = useRef(null);
  const showGridRef = useRef(null);
  const intervalRef = useRef("5m");

  var exchange = dataRef.current?.exchange;
  var procent = dataRef.current?.procent;
  var symbol = dataRef.current?.symbol;
  var start = dataRef.current?.start;
  var end = dataRef.current?.end;

  var t = Math.floor(start / 10000) * 10000;

  let lastNewKlineTimestamp = null;
  let lastOldKlineTimestamp = null;
  let updatedAggDealsRef = {};
  let aggDealsRef = [];

  registerIndicator({
    name: "Buy/Sell",
    calc: (kLineDataList) =>
      kLineDataList.map((kLineData) => kLineData.timestamp),
    draw: ({ ctx, visibleRange, indicator, xAxis, yAxis }) => {
      var result = indicator.result;

      for (let i = visibleRange.from; i < visibleRange.to; i++) {
        var deals = aggDealsRef.filter((deal) => deal.time === result[i]);

        deals.forEach((deal) => {
          var x = xAxis.convertToPixel(i);
          var y = yAxis.convertToPixel(deal.price);

          if (deal === aggDealsRef[0]) {
            new LineFigure({
              attrs: {
                coordinates: [
                  { x, y },
                  { x: x + 10000, y },
                ],
              },
              styles: {
                style: "dashed",
                color: deal.side === "BUY" ? "#00B8D9" : "#FFAB00",
                dashedValue: [3],
              },
            }).draw(ctx);
          }

          if (deal === aggDealsRef[aggDealsRef.length - 1]) {
            new LineFigure({
              attrs: {
                coordinates: [
                  { x, y },
                  { x: x + 10000, y },
                ],
              },
              styles: {
                style: "dashed",
                color: deal.side === "BUY" ? "#00B8D9" : "#FFAB00",
                dashedValue: [3],
              },
            }).draw(ctx);

            var yOpen = yAxis.convertToPixel(deals[0].price);

            var yClose = yAxis.convertToPixel(deals[deals.length - 1].price);

            new TextFigure({
              attrs: {
                x: x + 300,
                y:
                  Math.max(yOpen, yClose) - Math.min(yOpen, yClose) < 20
                    ? Math.max(yOpen, yClose) - 10
                    : (yOpen + yClose) / 2,
                text: procent + "%",
                align: ctx.textAlign,
                baseline: ctx.textBaseline,
              },
              styles: {
                style: "stroke",
                color: deal.side === "BUY" ? "#00B8D9" : "#FFAB00",
                family: "inherit",
              },
            }).draw(ctx);
          }

          var direction = deal.side === "BUY" ? 1 : -1;

          ctx.fillStyle = deal.side === "BUY" ? "#00B8D9" : "#FFAB00";
          ctx.beginPath();
          ctx.moveTo(x - 10, y + direction * 10);
          ctx.lineTo(x, y - direction * 10);
          ctx.lineTo(x + 10, y + direction * 10);
          ctx.lineTo(x, y);
          ctx.closePath();
          ctx.fill();

          // ctx.moveTo(x + direction * 10, y + direction * 10);
          // ctx.lineTo(x, y + direction * 10);
          // ctx.lineTo(x - direction * 10, y + direction * 10);
        });
      }
      return false;
    },
  });

  const open = activate.status !== false;

  useEffect(() => {
    (async () => {
      if (open) {
        let loading = false;

        var current;
        var finishNewKlineTimestamp;
        var finishOldKlineTimestamp;
        var interval = intervalRef.current;

        var chart = init("chart");

        chart.clearData();

        switch (exchange) {
          case 1:
            await Promise.all([
              axios.get(
                `https://fapi.binance.com/fapi/v1/klines?symbol=${symbol}&startTime=${
                  t - 6600000
                }&endTime=${t - 600001}&interval=${interval}&limit=1500`
              ),
              axios.get(
                `https://fapi.binance.com/fapi/v1/klines?symbol=${symbol}&startTime=${
                  t - 600000
                }&endTime=${t + 5400000}&interval=${interval}&limit=1500`
              ),
            ]).then((r) => {
              current = [].concat(...r.map((r) => r.data));

              finishNewKlineTimestamp = Date.now();
              finishOldKlineTimestamp = t - 2388900000;
              lastNewKlineTimestamp = t + 5400000;
              lastOldKlineTimestamp = t - 6600000;

              const key1 = keys.find((key) => key.exchange === 1);

              axios
                .get("https://fapi.binance.com/fapi/v1/time")
                .then(({ data }) => {
                  axios
                    .get(`https://fapi.binance.com/fapi/v1/userTrades`, {
                      headers: {
                        "X-MBX-APIKEY": key1.api_key,
                      },
                      params: {
                        timestamp: data.serverTime,
                        recvWindow: 60000,
                        startTime: start,
                        endTime: end,
                        symbol,
                        signature: crypto
                          .createHmac("sha256", key1.secret_key)
                          .update(
                            `timestamp=${data.serverTime}&recvWindow=60000&startTime=${start}&endTime=${end}&symbol=${symbol}`
                          )
                          .digest("hex"),
                      },
                    })
                    .then(({ data }) => {
                      data.forEach((deal) => {
                        const key = `${deal.side}_${deal.time}`;

                        const updatedAggDeals = {
                          ...updatedAggDealsRef,
                        };

                        if (updatedAggDeals[key]) {
                          updatedAggDeals[key].totalPrice +=
                            parseFloat(deal.price) * parseFloat(deal.qty);
                          updatedAggDeals[key].totalQty += parseFloat(deal.qty);
                          updatedAggDeals[key].avgPrice =
                            updatedAggDeals[key].totalPrice /
                            updatedAggDeals[key].totalQty;
                        } else {
                          updatedAggDeals[key] = {
                            symbol: deal.symbol,
                            side: deal.side,
                            time: deal.time,
                            realizedPnl: deal.realizedPnl,
                            totalPrice:
                              parseFloat(deal.price) * parseFloat(deal.qty),
                            totalQty: parseFloat(deal.qty),
                            avgPrice: parseFloat(deal.price),
                          };
                        }
                        updatedAggDealsRef = updatedAggDeals;
                      });

                      aggDealsRef = Object.values(updatedAggDealsRef).map(
                        (deal) => ({
                          time: roundTimeToInterval(deal.time, interval),
                          side: deal.side,
                          price: deal.avgPrice,
                          realizedPnl: deal.realizedPnl,
                        })
                      );
                    });
                });
            });
            break;

          case 2:
            await Promise.all([
              axios
                .get(
                  `https://api.bybit.com/v5/market/kline?category=linear&symbol=${symbol}&start=${
                    t - 6600000
                  }&end=${t - 600001}&interval=${
                    convertIntervalsForBibyt[interval]
                  }&limit=1000`
                )
                .then((res) => res.data.result.list.reverse()),
              axios
                .get(
                  `https://api.bybit.com/v5/market/kline?category=linear&symbol=${symbol}&start=${
                    t - 600000
                  }&end=${t + 5400000}&interval=${
                    convertIntervalsForBibyt[interval]
                  }&limit=1000`
                )
                .then((res) => res.data.result.list.reverse()),
            ]).then((r) => {
              current = r.flat();

              lastNewKlineTimestamp = t + 5400000;
              lastOldKlineTimestamp = t - 6600000;
              finishNewKlineTimestamp = Date.now();
              finishOldKlineTimestamp = t - 2388900000;

              const key2 = keys.find((key) => key.exchange === 2);

              var bybit = [];

              axios
                .get("https://api.bybit.com/v5/market/time")
                .then(async ({ data: { time } }) => {
                  let cursor = "";

                  do {
                    await axios
                      .get(
                        `https://api.bybit.com/v5/execution/list?category=linear&symbol=${symbol}&limit=100&startTime=${start}&endTime=${end}&cursor=${cursor}`,
                        {
                          headers: {
                            "X-BAPI-SIGN": crypto
                              .createHmac("sha256", key2.secret_key)
                              .update(
                                time +
                                  key2.api_key +
                                  60000 +
                                  `category=linear&symbol=${symbol}&limit=100&startTime=${start}&endTime=${end}&cursor=${cursor}`
                              )
                              .digest("hex"),
                            "X-BAPI-API-KEY": key2.api_key,
                            "X-BAPI-TIMESTAMP": time,
                            "X-BAPI-RECV-WINDOW": 60000,
                          },
                        }
                      )
                      .then(({ data }) => {
                        cursor = data.result.nextPageCursor;
                        bybit.push(data.result.list);
                      });
                  } while (cursor !== "");

                  bybit.flat().forEach((deal) => {
                    const key = `${deal.side === "Buy" ? "BUY" : "SELL"}_${
                      deal.execTime
                    }`;

                    const updatedAggDeals = {
                      ...updatedAggDealsRef,
                    };

                    if (updatedAggDeals[key]) {
                      updatedAggDeals[key].totalPrice +=
                        parseFloat(deal.execPrice) * parseFloat(deal.execQty);
                      updatedAggDeals[key].totalQty += parseFloat(deal.execQty);
                      updatedAggDeals[key].avgPrice =
                        updatedAggDeals[key].totalPrice /
                        updatedAggDeals[key].totalQty;
                    } else {
                      updatedAggDeals[key] = {
                        side: deal.side === "Buy" ? "BUY" : "SELL",
                        time: parseInt(deal.execTime),
                        realizedPnl: parseFloat(deal.closedSize),
                        totalPrice:
                          parseFloat(deal.execPrice) * parseFloat(deal.execQty),
                        totalQty: parseFloat(deal.execQty),
                        avgPrice: parseFloat(deal.execPrice),
                      };
                    }
                    updatedAggDealsRef = updatedAggDeals;
                  });

                  aggDealsRef = Object.values(updatedAggDealsRef).map(
                    (deal) => ({
                      time: roundTimeToInterval(deal.time, interval),
                      side: deal.side,
                      price: deal.avgPrice,
                      realizedPnl: deal.realizedPnl,
                    })
                  );
                });
            });
            break;

          default:
            break;
        }

        chart.applyNewData(
          current.map((kline) => ({
            timestamp: parseFloat(kline[0]),
            open: parseFloat(kline[1]),
            high: parseFloat(kline[2]),
            low: parseFloat(kline[3]),
            close: parseFloat(kline[4]),
            volume: parseFloat(kline[5]),
            turnover: parseFloat(kline[7]),
          }))
        );

        chart.scrollToTimestamp(start);

        chart.setOffsetRightDistance(200);

        chart.subscribeAction("onVisibleRangeChange", (data) => {
          if (
            data.from < 1 &&
            loading === false &&
            lastOldKlineTimestamp > finishOldKlineTimestamp
          ) {
            (async () => {
              loading = true;
              switch (exchange) {
                case 1:
                  await axios
                    .get(
                      `https://fapi.binance.com/fapi/v1/klines?symbol=${symbol}&startTime=${
                        lastOldKlineTimestamp - 33000000
                      }&endTime=${
                        lastOldKlineTimestamp - 1
                      }&interval=${interval}&limit=1500`
                    )
                    .then((r) => {
                      chart.applyMoreData(
                        r.data.map((kline) => ({
                          timestamp: parseFloat(kline[0]),
                          open: parseFloat(kline[1]),
                          high: parseFloat(kline[2]),
                          low: parseFloat(kline[3]),
                          close: parseFloat(kline[4]),
                          volume: parseFloat(kline[5]),
                          turnover: parseFloat(kline[7]),
                        }))
                      );
                      lastOldKlineTimestamp -= 33000000;
                    });
                  break;

                case 2:
                  await axios
                    .get(
                      `https://api.bybit.com/v5/market/kline?category=linear&symbol=${symbol}&start=${
                        lastOldKlineTimestamp - 33000000
                      }&end=${lastOldKlineTimestamp - 1}&interval=${
                        convertIntervalsForBibyt[interval]
                      }&limit=1000`
                    )
                    .then((r) => {
                      chart.applyMoreData(
                        r.data.result.list.reverse().map((kline) => ({
                          timestamp: parseFloat(kline[0]),
                          open: parseFloat(kline[1]),
                          high: parseFloat(kline[2]),
                          low: parseFloat(kline[3]),
                          close: parseFloat(kline[4]),
                          volume: parseFloat(kline[5]),
                          turnover: parseFloat(kline[7]),
                        }))
                      );
                      lastOldKlineTimestamp -= 33000000;
                    });
                  break;

                default:
                  break;
              }
              loading = false;
            })();
          } else if (
            data.realFrom > data.from &&
            loading === false &&
            lastNewKlineTimestamp < finishNewKlineTimestamp
          ) {
            (async () => {
              loading = true;
              switch (exchange) {
                case 1:
                  await axios
                    .get(
                      `https://fapi.binance.com/fapi/v1/klines?symbol=${symbol}&startTime=${
                        lastNewKlineTimestamp + 1
                      }&endTime=${
                        lastNewKlineTimestamp + 27000000
                      }&interval=${interval}&limit=1000`
                    )
                    .then((r) => {
                      r.data.forEach((kline) => {
                        chart.updateData({
                          timestamp: kline[0],
                          open: kline[1],
                          high: kline[2],
                          low: kline[3],
                          close: kline[4],
                          volume: kline[5],
                          turnover: kline[7],
                        });
                      });
                      lastNewKlineTimestamp += 27000000;
                    });
                  break;

                case 2:
                  await axios
                    .get(
                      `https://api.bybit.com/v5/market/kline?category=linear&symbol=${symbol}&start=${
                        lastNewKlineTimestamp + 1
                      }&end=${lastNewKlineTimestamp + 27000000}&interval=${
                        convertIntervalsForBibyt[interval]
                      }&limit=1000`
                    )
                    .then((r) => {
                      r.data.result.list.reverse().forEach((kline) => {
                        chart.updateData({
                          timestamp: parseFloat(kline[0]),
                          open: parseFloat(kline[1]),
                          high: parseFloat(kline[2]),
                          low: parseFloat(kline[3]),
                          close: parseFloat(kline[4]),
                          volume: parseFloat(kline[5]),
                          turnover: parseFloat(kline[7]),
                        });
                      });
                      lastNewKlineTimestamp += 27000000;
                    });
                  break;

                default:
                  break;
              }
              loading = false;
            })();
          }
        });

        chart.createIndicator("Buy/Sell", true, { id: "candle_pane" });

        chart.setPriceVolumePrecision(5, 3);

        chart.setLocale("ru");

        chart.setStyles({
          grid: {
            show: JSON.parse(localStorage.getItem("statusGrid")) ?? false,
            horizontal: {
              color: "rgba(145, 158, 171, 0.2)",
            },
            vertical: {
              color: "rgba(145, 158, 171, 0.2)",
            },
          },
          overlay: {
            polygon: {
              // 'fill' | 'stroke' | 'stroke_fill'
              style: "fill",
              color: "rgba(145, 158, 171, 0.2)",
              borderColor: "#1677FF",
              borderSize: 1,
              // 'solid' | 'dashed'
              borderStyle: "solid",
              borderDashedValue: [2, 2],
            },
          },
          candle: {
            type: localStorage.getItem("candleType") ?? "candle_solid",
            priceMark: {
              high: {
                textFamily: "inherit",
              },
              low: {
                textFamily: "inherit",
              },
              last: {
                text: {
                  family: "inherit",
                },
              },
            },
            tooltip: {
              text: {
                family: "inherit",
              },
            },
          },
          indicator: {
            lastValueMark: {
              text: {
                family: "inherit",
              },
            },
            tooltip: {
              text: {
                family: "inherit",
              },
            },
          },
          xAxis: {
            tickText: {
              family: "inherit",
            },
          },
          yAxis: {
            tickText: {
              family: "inherit",
            },
          },
          crosshair: {
            horizontal: {
              text: {
                family: "inherit",
              },
            },
            vertical: {
              text: {
                family: "inherit",
              },
            },
          },
          overlay: {
            text: {
              family: "inherit",
            },
            rectText: {
              family: "inherit",
            },
          },
        });

        addOverlayRef.current = (params) => {
          chart.createOverlay(params);
        };

        showGridRef.current = (params) => {
          if (params === true) {
            chart.setStyles({
              grid: {
                show: true,
              },
            });
          } else {
            chart.setStyles({
              grid: {
                show: false,
              },
            });
          }
        };

        changeCandleTypeRef.current = (params) => {
          chart.setStyles({
            candle: {
              type: params,
            },
          });
        };

        unsubscribeActionRef.current = () => {
          chart.unsubscribeAction("onVisibleRangeChange");
        };

        subscribeActionRef.current = (params) => {
          chart.subscribeAction("onVisibleRangeChange", (data) => {
            if (
              data.from < 1 &&
              loading === false &&
              lastOldKlineTimestamp > finishOldKlineTimestamp
            ) {
              (async () => {
                loading = true;
                switch (exchange) {
                  case 1:
                    await axios
                      .get(
                        `https://fapi.binance.com/fapi/v1/klines?symbol=${symbol}&startTime=${
                          lastOldKlineTimestamp - subDataStartTimestaps[params]
                        }&endTime=${
                          lastOldKlineTimestamp - 1
                        }&interval=${params}&limit=1000`
                      )
                      .then((r) => {
                        chart.applyMoreData(
                          r.data.map((kline) => ({
                            timestamp: parseFloat(kline[0]),
                            open: parseFloat(kline[1]),
                            high: parseFloat(kline[2]),
                            low: parseFloat(kline[3]),
                            close: parseFloat(kline[4]),
                            volume: parseFloat(kline[5]),
                            turnover: parseFloat(kline[7]),
                          }))
                        );
                        lastOldKlineTimestamp -= subDataStartTimestaps[params];
                      });
                    break;

                  case 2:
                    await axios
                      .get(
                        `https://api.bybit.com/v5/market/kline?category=linear&symbol=${symbol}&start=${
                          lastOldKlineTimestamp - subDataStartTimestaps[params]
                        }&end=${lastOldKlineTimestamp - 1}&interval=${
                          convertIntervalsForBibyt[params]
                        }&limit=1000`
                      )
                      .then((r) => {
                        chart.applyMoreData(
                          r.data.result.list.reverse().map((kline) => ({
                            timestamp: parseFloat(kline[0]),
                            open: parseFloat(kline[1]),
                            high: parseFloat(kline[2]),
                            low: parseFloat(kline[3]),
                            close: parseFloat(kline[4]),
                            volume: parseFloat(kline[5]),
                            turnover: parseFloat(kline[7]),
                          }))
                        );
                        lastOldKlineTimestamp -= subDataStartTimestaps[params];
                      });
                    break;

                  default:
                    break;
                }
                loading = false;
              })();
            } else if (
              data.realFrom > data.from &&
              loading === false &&
              lastNewKlineTimestamp < finishNewKlineTimestamp
            ) {
              (async () => {
                loading = true;
                switch (exchange) {
                  case 1:
                    await axios
                      .get(
                        `https://fapi.binance.com/fapi/v1/klines?symbol=${symbol}&startTime=${
                          lastNewKlineTimestamp + 1
                        }&endTime=${
                          lastNewKlineTimestamp + mainDataEndTimestaps[params]
                        }&interval=${params}&limit=1500`
                      )
                      .then((r) => {
                        r.data.forEach((kline) => {
                          chart.updateData({
                            timestamp: parseFloat(kline[0]),
                            open: parseFloat(kline[1]),
                            high: parseFloat(kline[2]),
                            low: parseFloat(kline[3]),
                            close: parseFloat(kline[4]),
                            volume: parseFloat(kline[5]),
                            turnover: parseFloat(kline[7]),
                          });
                        });
                        lastNewKlineTimestamp += mainDataEndTimestaps[params];
                      });
                    break;

                  case 2:
                    await axios
                      .get(
                        `https://api.bybit.com/v5/market/kline?category=linear&symbol=${symbol}&start=${
                          lastNewKlineTimestamp + 1
                        }&end=${
                          lastNewKlineTimestamp + mainDataEndTimestaps[params]
                        }&interval=${
                          convertIntervalsForBibyt[params]
                        }&limit=1000`
                      )
                      .then((r) => {
                        r.data.result.list.reverse().forEach((kline) => {
                          chart.updateData({
                            timestamp: parseFloat(kline[0]),
                            open: parseFloat(kline[1]),
                            high: parseFloat(kline[2]),
                            low: parseFloat(kline[3]),
                            close: parseFloat(kline[4]),
                            volume: parseFloat(kline[5]),
                            turnover: parseFloat(kline[7]),
                          });
                        });
                        lastNewKlineTimestamp += mainDataEndTimestaps[params];
                      });
                    break;

                  default:
                    break;
                }
                loading = false;
              })();
            }
          });
        };

        installMainIndicatorRef.current = (params) => {
          chart.createIndicator(params, true, { id: "candle_pane" });
        };

        removeMainIndicatorRef.current = (params) => {
          chart.removeIndicator("candle_pane", params);
        };

        installSubIndicatorRef.current = (params) => {
          chart.createIndicator(params[0], false, { id: params[1] });
        };

        removeSubIndicatorRef.current = (params) => {
          chart.removeIndicator(params[1], params[0]);
        };

        changeKlinesDataRef.current = (params) => {
          chart.applyNewData(
            params.map((kline) => ({
              timestamp: parseFloat(kline[0]),
              open: parseFloat(kline[1]),
              high: parseFloat(kline[2]),
              low: parseFloat(kline[3]),
              close: parseFloat(kline[4]),
              volume: parseFloat(kline[5]),
              turnover: parseFloat(kline[7]),
            }))
          );
        };
      }
    })();
    return () => {
      dispose("chart");
    };
  }, [activate]);

  return (
    <Collapse
      in={open}
      timeout="auto"
      sx={{
        mb: open ? 5 : 0,
      }}
    >
      <Card
        sx={{
          backgroundColor:
            mode === "dark" ? "rgb(16, 21, 27)" : "rgb(249, 250, 251)",
        }}
      >
        <Stack
          sx={{
            pl: "6px",
            pr: "6px",
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <CardHeader title={procent + "% " + symbol} />
          {isSmallScreen ? (
            <NativeSelect
              defaultValue={intervalRef.current}
              onChange={(e) => {
                const interval = e.target.value;
                intervalRef.current = interval;
                (async () => {
                  unsubscribeActionRef.current();
                  switch (exchange) {
                    case 1:
                      await Promise.all([
                        axios.get(
                          `https://fapi.binance.com/fapi/v1/klines?symbol=${symbol}&startTime=${
                            t - subDataStartTimestaps[interval]
                          }&endTime=${
                            t - subDataEndTimestaps[interval]
                          }&interval=${interval}&limit=1500`
                        ),
                        axios.get(
                          `https://fapi.binance.com/fapi/v1/klines?symbol=${symbol}&startTime=${
                            t - mainDataStartTimestaps[interval]
                          }&endTime=${
                            t + mainDataEndTimestaps[interval]
                          }&interval=${interval}&limit=1500`
                        ),
                      ]).then((r) => {
                        changeKlinesDataRef.current(
                          [].concat(...r.map((r) => r.data))
                        );
                        lastNewKlineTimestamp =
                          t + mainDataEndTimestaps[interval];
                        lastOldKlineTimestamp =
                          t - subDataStartTimestaps[interval];
                        aggDealsRef = Object.values(updatedAggDealsRef).map(
                          (deal) => ({
                            time: roundTimeToInterval(deal.time, interval),
                            side: deal.side,
                            price: deal.avgPrice,
                            realizedPnl: deal.realizedPnl,
                          })
                        );
                      });
                      break;

                    case 2:
                      await Promise.all([
                        axios
                          .get(
                            `https://api.bybit.com/v5/market/kline?category=linear&symbol=${symbol}&start=${
                              t - subDataStartTimestaps[interval]
                            }&end=${
                              t - subDataEndTimestaps[interval]
                            }&interval=${
                              convertIntervalsForBibyt[interval]
                            }&limit=1000`
                          )
                          .then((r) => r.data.result.list.reverse()),
                        axios
                          .get(
                            `https://api.bybit.com/v5/market/kline?category=linear&symbol=${symbol}&start=${
                              t - mainDataStartTimestaps[interval]
                            }&end=${
                              t + mainDataEndTimestaps[interval]
                            }&interval=${
                              convertIntervalsForBibyt[interval]
                            }&limit=1000`
                          )
                          .then((r) => r.data.result.list.reverse()),
                      ]).then((r) => {
                        changeKlinesDataRef.current(r.flat());
                        lastNewKlineTimestamp =
                          t + mainDataEndTimestaps[interval];
                        lastOldKlineTimestamp =
                          t - subDataStartTimestaps[interval];
                        aggDealsRef = Object.values(updatedAggDealsRef).map(
                          (deal) => ({
                            time: roundTimeToInterval(deal.time, interval),
                            side: deal.side,
                            price: deal.avgPrice,
                            realizedPnl: deal.realizedPnl,
                          })
                        );
                      });
                      break;

                    default:
                      break;
                  }
                  subscribeActionRef.current(interval);
                })();
              }}
            >
              <option value="1m" label="1м" />
              <option value="3m" label="3м" />
              <option value="5m" label="5м" />
              <option value="30m" label="30м" />
              <option value="1h" label="1ч" />
              <option value="2h" label="2ч" />
              <option value="6h" label="6ч" />
              <option value="1d" label="1д" />
              <option value="3d" label="3д" />
              <option value="1w" label="1н" />
            </NativeSelect>
          ) : (
            <FormControl>
              <RadioGroup
                row
                defaultValue={intervalRef.current}
                onChange={(e) => {
                  const interval = e.target.value;
                  intervalRef.current = interval;
                  (async () => {
                    unsubscribeActionRef.current();
                    switch (exchange) {
                      case 1:
                        await Promise.all([
                          axios.get(
                            `https://fapi.binance.com/fapi/v1/klines?symbol=${symbol}&startTime=${
                              t - subDataStartTimestaps[interval]
                            }&endTime=${
                              t - subDataEndTimestaps[interval]
                            }&interval=${interval}&limit=1500`
                          ),
                          axios.get(
                            `https://fapi.binance.com/fapi/v1/klines?symbol=${symbol}&startTime=${
                              t - mainDataStartTimestaps[interval]
                            }&endTime=${
                              t + mainDataEndTimestaps[interval]
                            }&interval=${interval}&limit=1500`
                          ),
                        ]).then((r) => {
                          changeKlinesDataRef.current(
                            [].concat(...r.map((r) => r.data))
                          );
                          lastNewKlineTimestamp =
                            t + mainDataEndTimestaps[interval];
                          lastOldKlineTimestamp =
                            t - subDataStartTimestaps[interval];
                          aggDealsRef = Object.values(updatedAggDealsRef).map(
                            (deal) => ({
                              time: roundTimeToInterval(deal.time, interval),
                              side: deal.side,
                              price: deal.avgPrice,
                              realizedPnl: deal.realizedPnl,
                            })
                          );
                        });
                        break;

                      case 2:
                        await Promise.all([
                          axios
                            .get(
                              `https://api.bybit.com/v5/market/kline?category=linear&symbol=${symbol}&start=${
                                t - subDataStartTimestaps[interval]
                              }&end=${
                                t - subDataEndTimestaps[interval]
                              }&interval=${
                                convertIntervalsForBibyt[interval]
                              }&limit=1000`
                            )
                            .then((res) => res.data.result.list.reverse()),
                          axios
                            .get(
                              `https://api.bybit.com/v5/market/kline?category=linear&symbol=${symbol}&start=${
                                t - mainDataStartTimestaps[interval]
                              }&end=${
                                t + mainDataEndTimestaps[interval]
                              }&interval=${
                                convertIntervalsForBibyt[interval]
                              }&limit=1000`
                            )
                            .then((res) => res.data.result.list.reverse()),
                        ]).then((r) => {
                          changeKlinesDataRef.current(r.flat());
                          lastNewKlineTimestamp =
                            t + mainDataEndTimestaps[interval];
                          lastOldKlineTimestamp =
                            t - subDataStartTimestaps[interval];
                          aggDealsRef = Object.values(updatedAggDealsRef).map(
                            (deal) => ({
                              time: roundTimeToInterval(deal.time, interval),
                              side: deal.side,
                              price: deal.avgPrice,
                              realizedPnl: deal.realizedPnl,
                            })
                          );
                        });
                        break;

                      default:
                        break;
                    }
                    subscribeActionRef.current(interval);
                  })();
                }}
              >
                <FormControlLabel value="1m" control={<Radio />} label="1м" />
                <FormControlLabel value="3m" control={<Radio />} label="3м" />
                <FormControlLabel value="5m" control={<Radio />} label="5м" />
                <FormControlLabel value="30m" control={<Radio />} label="30м" />
                <FormControlLabel value="1h" control={<Radio />} label="1ч" />
                <FormControlLabel value="2h" control={<Radio />} label="2ч" />
                <FormControlLabel value="6h" control={<Radio />} label="6ч" />
                <FormControlLabel value="1d" control={<Radio />} label="1д" />
                <FormControlLabel value="3d" control={<Radio />} label="3д" />
                <FormControlLabel value="1w" control={<Radio />} label="1н" />
              </RadioGroup>
            </FormControl>
          )}
          <HeaderIndicators
            installMainIndicatorRef={installMainIndicatorRef}
            removeMainIndicatorRef={removeMainIndicatorRef}
            installSubIndicatorRef={installSubIndicatorRef}
            removeSubIndicatorRef={removeSubIndicatorRef}
            activate={activate}
          />
          <OptionsMenu
            changeCandleTypeRef={changeCandleTypeRef}
            showGridRef={showGridRef}
            setActivate={setActivate}
            dataRef={dataRef}
          />
        </Stack>
        <Box sx={{ display: "flex" }}>
          <Stack
            sx={{
              gap: "4px",
              pt: "4px",
              pb: "4px",
              borderRadius: "16px",
            }}
          >
            <Lines addOverlay={addOverlayRef} />
            <Divider />
            <Figures addOverlay={addOverlayRef} />
            <Divider />
            <Annotations addOverlay={addOverlayRef} />
            <Divider />
            <Cuts addOverlay={addOverlayRef} />
            <Divider />
            <Lineup addOverlay={addOverlayRef} />
          </Stack>
          <Box
            id="chart"
            sx={{
              height: "75vh",
              width: "100%",
            }}
          />
        </Box>
      </Card>
    </Collapse>
  );
}
