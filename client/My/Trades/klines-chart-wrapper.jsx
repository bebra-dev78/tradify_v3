"use client";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import FormControlLabel from "@mui/material/FormControlLabel";
import DialogContent from "@mui/material/DialogContent";
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
import Figures from "#/client/My/Trades/tools/figures";
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

const KlinesChartCardOptionsMenu = memo(function KlinesChartCardOptionsMenu({
  changeCandleTypeRef,
  showGridRef,
  setData,
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
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" sx={{ mb: 5, mt: 2 }}>
                Тип графика
              </Typography>
              <Typography variant="subtitle1">Показать сетку</Typography>
            </Grid>
            <Grid item xs={0} md={6}>
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
            setData(null);
          }}
        >
          <CloseRoundedIcon />
        </IconButton>
      </Tooltip>
    </>
  );
});

const KlinesChartHeaderIndicators = memo(function KlinesChartHeaderIndicators({
  installMainIndicatorRef,
  removeMainIndicatorRef,
  installSubIndicatorRef,
  removeSubIndicatorRef,
  data,
}) {
  const [indicators, setIndicators] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    setIndicators(["Buy/Sell"]);
  }, [data]);

  return (
    <>
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

export default function KlinesChartWrapper({ data, setData }) {
  const { keys } = useKeys();

  const [interval, setInterval] = useState("5m");

  const finishOldKlineTimestampRef = useRef(null);
  const finishNewKlineTimestampRef = useRef(null);
  const lastNewKlineTimestampRef = useRef(null);
  const lastOldKlineTimestampRef = useRef(null);
  const installMainIndicatorRef = useRef(null);
  const removeMainIndicatorRef = useRef(null);
  const installSubIndicatorRef = useRef(null);
  const uploadOldKlinesDataRef = useRef(null);
  const uploadNewKlinesDataRef = useRef(null);
  const removeSubIndicatorRef = useRef(null);
  const unsubscribeActionRef = useRef(null);
  const changeKlinesDataRef = useRef(null);
  const changeCandleTypeRef = useRef(null);
  const subscribeActionRef = useRef(null);
  const updatedAggDealsRef = useRef({});
  const addOverlayRef = useRef(null);
  const showGridRef = useRef(null);
  const loadingRef = useRef(false);
  const aggDealsRef = useRef([]);

  const exchange = data?.exchange;
  const symbol = data?.symbol;
  const start = data?.start;
  const end = data?.end;

  const t = Math.floor(start / 10000) * 10000;

  registerIndicator({
    name: "Buy/Sell",
    calc: (kLineDataList) =>
      kLineDataList.map((kLineData) => kLineData.timestamp),
    draw: ({ ctx, visibleRange, indicator, xAxis, yAxis }) => {
      const result = indicator.result;

      for (let i = visibleRange.from; i < visibleRange.to; i++) {
        const deals = aggDealsRef.current.filter(
          (deal) => deal.time === result[i]
        );

        deals.forEach((deal) => {
          const x = xAxis.convertToPixel(i);
          const y = yAxis.convertToPixel(deal.price);

          if (
            deal === aggDealsRef.current[0] ||
            deal === aggDealsRef.current[aggDealsRef.current.length - 1]
          ) {
            new LineFigure({
              attrs: {
                coordinates: [
                  { x, y },
                  { x: x + 100000000, y },
                ],
              },
              styles: {
                style: "dashed",
                color: deal.side === "BUY" ? "#00B8D9" : "#FFAB00",
              },
            }).draw(ctx);

            new TextFigure({
              attrs: {
                x: x + 100,
                y: y - 10,
                text: parseFloat(deal.realizedPnl).toFixed(3),
                align: ctx.textAlign,
                baseline: ctx.textBaseline,
              },
              styles: {
                style: "stroke_fill",
                color: deal.side === "BUY" ? "#00B8D9" : "#FFAB00",
                family: "inherit",
              },
            }).draw(ctx);
          }

          const direction = deal.side === "BUY" ? 1 : -1;

          ctx.fillStyle = deal.side === "BUY" ? "#00B8D9" : "#FFAB00";
          ctx.beginPath();
          ctx.moveTo(x - 10, y + direction * 10);
          ctx.lineTo(x, y - direction * 10);
          ctx.lineTo(x + 10, y + direction * 10);
          ctx.lineTo(x, y);
          ctx.closePath();
          ctx.fill();
        });
      }
      return false;
    },
  });

  useEffect(() => {
    (async () => {
      if (data !== null) {
        let current;
        updatedAggDealsRef.current = {};
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

              lastNewKlineTimestampRef.current = t + 5400000;
              lastOldKlineTimestampRef.current = t - 6600000;
              finishNewKlineTimestampRef.current = Date.now();
              finishOldKlineTimestampRef.current = t - 2388900000;

              const key1 = keys.find((key) => key.exchange === 1);

              axios
                .get("https://fapi.binance.com/fapi/v1/time")
                .then(({ data: { serverTime } }) => {
                  axios
                    .get(`https://fapi.binance.com/fapi/v1/userTrades`, {
                      headers: {
                        "X-MBX-APIKEY": key1.api_key,
                      },
                      params: {
                        timestamp: serverTime,
                        recvWindow: 60000,
                        startTime: start,
                        endTime: end,
                        signature: crypto
                          .createHmac("sha256", key1.secret_key)
                          .update(
                            `timestamp=${serverTime}&recvWindow=60000&startTime=${start}&endTime=${end}`
                          )
                          .digest("hex"),
                      },
                    })
                    .then(({ data }) => {
                      data.forEach((deal) => {
                        const key = `${deal.side}_${deal.time}`;

                        const updatedAggDeals = {
                          ...updatedAggDealsRef.current,
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
                        updatedAggDealsRef.current = updatedAggDeals;
                      });
                      console.log(
                        "updatedAggDealsRef.current: ",
                        updatedAggDealsRef.current
                      );
                      aggDealsRef.current = Object.values(
                        updatedAggDealsRef.current
                      ).map((deal) => ({
                        time: roundTimeToInterval(deal.time, interval),
                        side: deal.side,
                        price: deal.avgPrice,
                        realizedPnl: deal.realizedPnl,
                      }));
                    });
                });
            });

          default:
            break;
        }

        const chart = init("chart");

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

        chart.subscribeAction("onVisibleRangeChange", (data) => {
          if (
            data.from < 1 &&
            loadingRef.current === false &&
            lastOldKlineTimestampRef.current >
              finishOldKlineTimestampRef.current
          ) {
            (async () => {
              loadingRef.current = true;
              switch (exchange) {
                case 1:
                  await axios
                    .get(
                      `https://fapi.binance.com/fapi/v1/klines?symbol=${symbol}&startTime=${
                        lastOldKlineTimestampRef.current - 33000000
                      }&endTime=${
                        lastOldKlineTimestampRef.current - 1
                      }&interval=5m&limit=1500`
                    )
                    .then(({ data }) => {
                      uploadOldKlinesDataRef.current(data);
                      lastOldKlineTimestampRef.current =
                        lastOldKlineTimestampRef.current - 33000000;
                    });
                  break;

                default:
                  break;
              }
              loadingRef.current = false;
            })();
          } else if (
            data.realFrom > data.from &&
            loadingRef.current === false &&
            lastNewKlineTimestampRef.current <
              finishNewKlineTimestampRef.current
          ) {
            (async () => {
              loadingRef.current = true;
              switch (exchange) {
                case 1:
                  await axios
                    .get(
                      `https://fapi.binance.com/fapi/v1/klines?symbol=${symbol}&startTime=${
                        lastNewKlineTimestampRef.current + 1
                      }&endTime=${
                        lastNewKlineTimestampRef.current + 27000000
                      }&interval=5m&limit=1500`
                    )
                    .then(({ data }) => {
                      uploadNewKlinesDataRef.current(data);
                      lastNewKlineTimestampRef.current =
                        lastNewKlineTimestampRef.current + 27000000;
                    });
                  break;

                default:
                  break;
              }
              loadingRef.current = false;
            })();
          }
        });

        chart.createIndicator("Buy/Sell", true, { id: "candle_pane" });

        chart.setPriceVolumePrecision(5, 3);

        chart.setLocale("ru");

        chart.setStyles({
          grid: {
            show: JSON.parse(localStorage.getItem("statusGrid")) ?? true,
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
              loadingRef.current === false &&
              lastOldKlineTimestampRef.current >
                finishOldKlineTimestampRef.current
            ) {
              (async () => {
                loadingRef.current = true;
                switch (exchange) {
                  case 1:
                    await axios
                      .get(
                        `https://fapi.binance.com/fapi/v1/klines?symbol=${symbol}&startTime=${
                          lastOldKlineTimestampRef.current -
                          subDataStartTimestaps[params]
                        }&endTime=${
                          lastOldKlineTimestampRef.current - 1
                        }&interval=${params}&limit=1500`
                      )
                      .then(({ data }) => {
                        uploadOldKlinesDataRef.current(data);
                        lastOldKlineTimestampRef.current =
                          lastOldKlineTimestampRef.current -
                          subDataStartTimestaps[params];
                      });
                    break;

                  default:
                    break;
                }
                loadingRef.current = false;
              })();
            } else if (
              data.realFrom > data.from &&
              loadingRef.current === false &&
              lastNewKlineTimestampRef.current <
                finishNewKlineTimestampRef.current
            ) {
              (async () => {
                loadingRef.current = true;
                switch (exchange) {
                  case 1:
                    await axios
                      .get(
                        `https://fapi.binance.com/fapi/v1/klines?symbol=${symbol}&startTime=${
                          lastNewKlineTimestampRef.current + 1
                        }&endTime=${
                          lastNewKlineTimestampRef.current +
                          mainDataEndTimestaps[params]
                        }&interval=${params}&limit=1500`
                      )
                      .then(({ data }) => {
                        uploadNewKlinesDataRef.current(data);
                        lastNewKlineTimestampRef.current =
                          lastNewKlineTimestampRef.current +
                          mainDataEndTimestaps[params];
                      });
                    break;

                  default:
                    break;
                }
                loadingRef.current = false;
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

        uploadOldKlinesDataRef.current = (params) => {
          chart.applyMoreData(
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

        uploadNewKlinesDataRef.current = (params) => {
          const oldData = chart.getDataList();
          const newData = params.map((kline) => ({
            timestamp: parseFloat(kline[0]),
            open: parseFloat(kline[1]),
            high: parseFloat(kline[2]),
            low: parseFloat(kline[3]),
            close: parseFloat(kline[4]),
            volume: parseFloat(kline[5]),
            turnover: parseFloat(kline[7]),
          }));
          const sumData = [...oldData, ...newData];
          chart.applyNewData(
            sumData.map((kline) => ({
              timestamp: kline.timestamp,
              open: kline.open,
              high: kline.high,
              low: kline.low,
              close: kline.close,
              volume: kline.volume,
              turnover: kline.turnover,
            }))
          );
        };
      }
    })();
    return () => {
      dispose("chart");
    };
  }, [data]);

  return (
    <Collapse
      in={data !== null}
      timeout="auto"
      unmountOnExit
      sx={{
        mb: 5,
      }}
    >
      <Card>
        <Stack
          sx={{
            pl: "6px",
            pr: "6px",
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <CardHeader title={symbol} />
          <FormControl>
            <RadioGroup
              row
              value={interval}
              onChange={(e) => {
                const interval = e.target.value;
                setInterval(interval);
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
                        lastNewKlineTimestampRef.current =
                          t + mainDataEndTimestaps[interval];
                        lastOldKlineTimestampRef.current =
                          t - subDataStartTimestaps[interval];
                        aggDealsRef.current = Object.values(
                          updatedAggDealsRef.current
                        ).map((deal) => ({
                          time: roundTimeToInterval(deal.time, interval),
                          side: deal.side,
                          price: deal.avgPrice,
                          realizedPnl: deal.realizedPnl,
                        }));
                      });
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
              <FormControlLabel value="1M" control={<Radio />} label="1М" />
            </RadioGroup>
          </FormControl>
          <KlinesChartHeaderIndicators
            installMainIndicatorRef={installMainIndicatorRef}
            removeMainIndicatorRef={removeMainIndicatorRef}
            installSubIndicatorRef={installSubIndicatorRef}
            removeSubIndicatorRef={removeSubIndicatorRef}
            data={data}
          />
          <KlinesChartCardOptionsMenu
            changeCandleTypeRef={changeCandleTypeRef}
            showGridRef={showGridRef}
            setData={setData}
          />
        </Stack>
        <Box sx={{ display: "flex" }}>
          <Stack
            sx={{ gap: "4px", pt: "4px", pb: "4px", borderRadius: "16px" }}
          >
            <Lines addOverlay={addOverlayRef} />
            <Divider />
            <Figures addOverlay={addOverlayRef} />
            <Divider />
            <Annotations addOverlay={addOverlayRef} />
            <Divider />
            <Cuts addOverlay={addOverlayRef} />
          </Stack>
          <Box id="chart" sx={{ height: "75vh", width: "100%" }} />
        </Box>
      </Card>
    </Collapse>
  );
}