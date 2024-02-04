"use client";

import LinearProgress from "@mui/material/LinearProgress";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";

import { useEffect, useState, useRef } from "react";
import crypto from "crypto";
import axios from "axios";
import {
  init,
  dispose,
  registerLocale,
  registerOverlay,
  registerIndicator,
} from "klinecharts";

import { useKeys } from "#/app/my/layout";

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
      const radius = Math.sqrt(xDis * xDis + yDis * yDis);
      return {
        key: "sampleCircle",
        type: "circle",
        attrs: {
          ...coordinates[0],
          r: radius,
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
  const roundedTime =
    Math.floor(dealTime / (intervalSeconds * 1000)) * intervalSeconds * 1000;

  return roundedTime;
}

export default function KlinesChart({
  setInstallMainIndicator,
  setRemoveMainIndicator,
  setInstallSubIndicator,
  setRemoveSubIndicator,
  setIndicators,
  setAddOverlay,
  setShowGrid,
  gridStatus,
  interval,
  data,
}) {
  const { keys } = useKeys();

  const timestamp = data.timestamp;
  const exchange = data.exchange;
  const symbol = data.symbol;
  const end = data.end;

  const t = Math.floor(timestamp / 10000) * 10000;

  const [loadingNewKlines, setLoadingNewKlines] = useState(false);
  const [loadingOldKlines, setLoadingOldKlines] = useState(false);
  const [klines, setKlines] = useState([]);

  const finishOldKlineTimestampRef = useRef(null);
  const finishNewKlineTimestampRef = useRef(null);
  const lastNewKlineTimestampRef = useRef(null);
  const lastOldKlineTimestampRef = useRef(null);
  const uploadOldKlinesDataRef = useRef(null);
  const uploadNewKlinesDataRef = useRef(null);
  const changeKlinesDataRef = useRef(null);
  const updatedAggDealsRef = useRef({});
  const loadingRef = useRef(false);
  const aggDealsRef = useRef([]);

  registerIndicator({
    name: "Custom",
    figures: [{ key: "emoji" }],
    calc: (kLineDataList) =>
      kLineDataList.map((kLineData) => ({
        close: kLineData.close,
        time: kLineData.timestamp,
      })),
    draw: ({ ctx, visibleRange, indicator, xAxis, yAxis }) => {
      ctx.font = "40px Helvetica Neue";
      ctx.textAlign = "center";
      const result = indicator.result;

      for (let i = visibleRange.from; i < visibleRange.to; i++) {
        const data = result[i];

        const deals = aggDealsRef.current.filter(
          (deal) => deal.time === data.time
        );

        if (deals.length > 0) {
          const yOffset = 40; // Adjust the yOffset to space out the emojis vertically

          deals.forEach((deal, index) => {
            ctx.fillText(
              deal.side === "BUY" ? "🍏" : "🔻",
              xAxis.convertToPixel(i),
              yAxis.convertToPixel(data.close) - index * yOffset
            );
          });
        }
      }
      return false;
    },
  });

  useEffect(() => {
    if (data !== null) {
      setIndicators(() => []);
      updatedAggDealsRef.current = {};
      switch (exchange) {
        case 1:
          Promise.all([
            axios.get(
              `https://fapi.binance.com/fapi/v1/klines?symbol=${symbol}&startTime=${
                t - 6600000
              }&endTime=${t - 600001}&interval=5m&limit=1500`
            ),
            axios.get(
              `https://fapi.binance.com/fapi/v1/klines?symbol=${symbol}&startTime=${
                t - 600000
              }&endTime=${t + 5400000}&interval=5m&limit=1500`
            ),
          ]).then((r) => {
            setKlines([].concat(...r.map((r) => r.data)));
            lastNewKlineTimestampRef.current = t + 5400000;
            lastOldKlineTimestampRef.current = t - 6600000;
            finishOldKlineTimestampRef.current = t - 2388900000;
            finishNewKlineTimestampRef.current = Date.now();
            const key1 = keys.filter((key) => key.exchange === 1)[0];
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
                      startTime: timestamp,
                      endTime: end,
                      signature: crypto
                        .createHmac("sha256", key1.secret_key)
                        .update(
                          `timestamp=${serverTime}&recvWindow=60000&startTime=${timestamp}&endTime=${end}`
                        )
                        .digest("hex"),
                    },
                  })
                  .then(({ data }) => {
                    data.forEach((deal) => {
                      const key = `${deal.side}_${deal.time}`;

                      const updatedAggDeals = { ...updatedAggDealsRef.current };
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
                          totalPrice:
                            parseFloat(deal.price) * parseFloat(deal.qty),
                          totalQty: parseFloat(deal.qty),
                          avgPrice: parseFloat(deal.price),
                        };
                      }
                      updatedAggDealsRef.current = updatedAggDeals;
                    });
                    aggDealsRef.current = Object.values(
                      updatedAggDealsRef.current
                    ).map((deal) => ({
                      time: roundTimeToInterval(deal.time, "5m"),
                      side: deal.side,
                    }));
                  });
              });
          });
          break;
        case 2:
          Promise.all([
            axios.get(
              `https://api.bybit.com/v5/market/kline?category=linear&symbol=${symbol}&start=${
                t - 600000
              }&end=${t + 5400000}&interval=5&limit=1000`
            ),
            axios.get(
              `https://api.bybit.com/v5/market/kline?category=linear&symbol=${symbol}&start=${
                t - 6600000
              }&end=${t - 600001}&interval=5&limit=1000`
            ),
          ]).then((r) => {
            setKlines([].concat(...r.map((r) => r.data.result.list)).reverse());
            lastNewKlineTimestampRef.current = t + 5400000;
            lastOldKlineTimestampRef.current = t - 6600000;
            finishOldKlineTimestampRef.current = t - 2388900000;
            finishNewKlineTimestampRef.current = new Date().getTime();
          });
          break;
        default:
          break;
      }
    }
  }, [data]);

  useEffect(() => {
    if (data !== null && klines.length > 0) {
      switch (exchange) {
        case 1:
          Promise.all([
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
            changeKlinesDataRef.current([].concat(...r.map((r) => r.data)));
            lastNewKlineTimestampRef.current =
              t + mainDataEndTimestaps[interval];
            lastOldKlineTimestampRef.current =
              t - subDataStartTimestaps[interval];
            aggDealsRef.current = Object.values(updatedAggDealsRef.current).map(
              (deal) => ({
                time: roundTimeToInterval(deal.time, interval),
                side: deal.side,
              })
            );
          });
          break;
        case 2:
          Promise.all([
            axios.get(
              `https://api.bybit.com/v5/market/kline?category=linear&symbol=${symbol}&start=${
                t - mainDataStartTimestaps[interval]
              }&end=${t + mainDataEndTimestaps[interval]}&interval=${
                convertIntervalsForBibyt[interval]
              }&limit=1000`
            ),
            axios.get(
              `https://api.bybit.com/v5/market/kline?category=linear&symbol=${symbol}&start=${
                t - subDataStartTimestaps[interval]
              }&end=${t - subDataEndTimestaps[interval]}&interval=${
                convertIntervalsForBibyt[interval]
              }&limit=1000`
            ),
          ]).then((r) => {
            changeKlinesDataRef.current(
              [].concat(...r.map((r) => r.data.result.list)).reverse()
            );
            lastNewKlineTimestampRef.current =
              t + mainDataEndTimestaps[interval];
            lastOldKlineTimestampRef.current =
              t - subDataStartTimestaps[interval];
          });
          break;
        default:
          break;
      }
    }
  }, [interval]);

  useEffect(() => {
    if (
      lastOldKlineTimestampRef.current > finishOldKlineTimestampRef.current &&
      loadingOldKlines === true &&
      loadingRef.current === false
    ) {
      loadingRef.current = true;
      switch (exchange) {
        case 1:
          axios
            .get(
              `https://fapi.binance.com/fapi/v1/klines?symbol=${symbol}&startTime=${
                lastOldKlineTimestampRef.current -
                subDataStartTimestaps[interval]
              }&endTime=${
                lastOldKlineTimestampRef.current - 1
              }&interval=${interval}&limit=1500`
            )
            .then(({ data }) => {
              uploadOldKlinesDataRef.current(data);
              lastOldKlineTimestampRef.current =
                lastOldKlineTimestampRef.current -
                subDataStartTimestaps[interval];
              loadingRef.current = false;
              setLoadingOldKlines(false);
            });
          break;
        case 2:
          axios
            .get(
              `https://api.bybit.com/v5/market/kline?category=linear&symbol=${symbol}&start=${
                lastOldKlineTimestampRef.current -
                subDataStartTimestaps[interval]
              }&end=${lastOldKlineTimestampRef.current - 1}&interval=${
                convertIntervalsForBibyt[interval]
              }&limit=1000`
            )
            .then(
              ({
                data: {
                  result: { list },
                },
              }) => {
                uploadOldKlinesDataRef.current(list.reverse());
                lastOldKlineTimestampRef.current =
                  lastOldKlineTimestampRef.current -
                  subDataStartTimestaps[interval];
                loadingRef.current = false;
                setLoadingOldKlines(false);
              }
            );
          break;
        default:
          break;
      }
    }
  }, [loadingOldKlines]);

  useEffect(() => {
    if (
      lastNewKlineTimestampRef.current < finishNewKlineTimestampRef.current &&
      loadingNewKlines === true &&
      loadingRef.current === false
    ) {
      loadingRef.current = true;
      switch (exchange) {
        case 1:
          axios
            .get(
              `https://fapi.binance.com/fapi/v1/klines?symbol=${symbol}&startTime=${
                lastNewKlineTimestampRef.current + 1
              }&endTime=${
                lastNewKlineTimestampRef.current +
                mainDataEndTimestaps[interval]
              }&interval=${interval}&limit=1500`
            )
            .then(({ data }) => {
              uploadNewKlinesDataRef.current(data);
              lastNewKlineTimestampRef.current =
                lastNewKlineTimestampRef.current +
                mainDataEndTimestaps[interval];
              loadingRef.current = false;
              setLoadingNewKlines(false);
            });
          break;
        case 2:
          axios
            .get(
              `https://api.bybit.com/v5/market/kline?category=linear&symbol=${symbol}&start=${
                lastNewKlineTimestampRef.current + 1
              }&end=${
                lastNewKlineTimestampRef.current +
                mainDataEndTimestaps[interval]
              }&interval=${convertIntervalsForBibyt[interval]}&limit=1000`
            )
            .then(
              ({
                data: {
                  result: { list },
                },
              }) => {
                uploadNewKlinesDataRef.current(list.reverse());
                lastNewKlineTimestampRef.current =
                  lastNewKlineTimestampRef.current +
                  mainDataEndTimestaps[interval];
                loadingRef.current = false;
                setLoadingNewKlines(false);
              }
            );
          break;
        default:
          break;
      }
    }
  }, [loadingNewKlines]);

  useEffect(() => {
    if (klines.length > 0) {
      const chart = init("chart");
      chart.applyNewData(
        klines.map((kline) => ({
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
        if (data.from < 1 && loadingRef.current === false) {
          setLoadingOldKlines((prev) => !prev);
        } else if (data.realFrom > data.from && loadingRef.current === false) {
          setLoadingNewKlines((prev) => !prev);
        }
      });
      chart.setPriceVolumePrecision(5, 3);
      chart.setLocale("ru");
      chart.setStyles({
        grid: {
          show: gridStatus,
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

      setAddOverlay(() => {
        return (params) => {
          chart.createOverlay(params);
        };
      });

      setShowGrid(() => {
        return (params) => {
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
      });

      setInstallMainIndicator(() => {
        return (params) => {
          chart.createIndicator(params, true, { id: "candle_pane" });
        };
      });

      setInstallSubIndicator(() => {
        return (params) => {
          chart.createIndicator(params[0], false, { id: params[1] });
        };
      });

      setRemoveMainIndicator(() => {
        return (params) => {
          chart.removeIndicator("candle_pane", params);
        };
      });

      setRemoveSubIndicator(() => {
        return (params) => {
          chart.removeIndicator(params[1], params[0]);
        };
      });

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

      return () => {
        dispose("chart");
      };
    }
  }, [klines]);

  return klines.length > 0 ? (
    <Box id="chart" sx={{ height: "75vh", width: "100%" }} />
  ) : (
    <Container
      sx={{
        height: "75vh",
        display: "flex",
        alignItems: "center",
      }}
    >
      <LinearProgress color="secondary" sx={{ width: "100%" }} />
    </Container>
  );
}
