"use client";

import Autocomplete, { autocompleteClasses } from "@mui/material/Autocomplete";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import CircularProgress from "@mui/material/CircularProgress";
import useMediaQuery from "@mui/material/useMediaQuery";
import MuiPagination from "@mui/material/Pagination";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import Popper from "@mui/material/Popper";
import Rating from "@mui/material/Rating";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Grow from "@mui/material/Grow";
import Box from "@mui/material/Box";
import {
  ruRU,
  DataGrid,
  useGridApiRef,
  GridPagination,
  useGridSelector,
  useGridApiContext,
  GridToolbarExport,
  GridToolbarContainer,
  gridPageCountSelector,
  GridColumnMenuSortItem,
  GridColumnMenuHideItem,
  GridToolbarFilterButton,
  GridColumnMenuContainer,
  GridToolbarColumnsButton,
  GridColumnMenuManageItem,
  GridColumnMenuFilterItem,
  GridToolbarDensitySelector,
} from "@mui/x-data-grid";

import { useState, useEffect, useRef, useMemo, memo } from "react";
import { DateTime } from "luxon";
import Image from "next/image";
import crypto from "crypto";
import axios from "axios";

import { useMode } from "#/client/Global/theme-registry";
import { useKeys, useUser } from "#/app/my/layout";
import Iconify from "#/utils/iconify";
import {
  getTrades,
  updateRating,
  updateTags,
  createBybitTrades,
  createBynanceTrades,
} from "#/server/trades";

import overlay from "#/public/svg/illustration_empty_content.svg";

const LoadingOverlay = memo(function LoadingOverlay() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
      }}
    >
      <CircularProgress color="info" disableShrink />
    </Box>
  );
});

const NoRowsOverlay = memo(function NoRowsOverlay() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
      }}
    >
      <Image
        src={overlay}
        width={320}
        height={240}
        style={{ marginBottom: "25px" }}
      />
      <Typography variant="h4" gutterBottom>
        Нет сделок
      </Typography>
    </Box>
  );
});

const CustomToolbar = memo(function CustomToolbar() {
  const { mode } = useMode();

  const [anchorEl, setAnchorEl] = useState(null);

  const popperRef = useRef(null);
  const tagRef = useRef(null);

  return (
    <GridToolbarContainer
      sx={{
        padding: "14px",
        borderColor: mode === "dark" ? "rgb(46, 50, 54)" : "rgb(241, 243, 244)",
        backgroundColor:
          mode === "dark" ? "rgba(145, 158, 171, 0.12)" : "rgb(244, 246, 248)",
        borderBottom:
          mode === "dark"
            ? "1px dashed rgba(145, 158, 171, 0.24)"
            : "1px dashed rgba(145, 158, 171, 0.5)",
      }}
    >
      <GridToolbarColumnsButton color="info" />
      <GridToolbarFilterButton color="info" />
      <GridToolbarDensitySelector color="info" />
      <GridToolbarExport color="info" />
      <ClickAwayListener
        onClickAway={() => {
          setAnchorEl(null);
        }}
      >
        <div>
          <Button
            variant="text"
            color="info"
            size="small"
            onClick={(event) => {
              setAnchorEl(anchorEl ? null : event.currentTarget);
            }}
          >
            <Iconify
              icon="solar:add-square-outline"
              width={20}
              sx={{ mr: 1 }}
            />
            Добавить причину
          </Button>
          <Popper
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            ref={popperRef}
            transition
            placement="bottom-start"
            modifiers={[
              {
                name: "offset",
                options: {
                  offset: [0, 8],
                },
              },
            ]}
          >
            {({ TransitionProps }) => (
              <Grow
                {...TransitionProps}
                timeout={200}
                style={{
                  transformOrigin: "top left",
                }}
              >
                <Paper
                  sx={{
                    p: 2,
                    maxWidth: "250px",
                    boxShadow:
                      "rgba(0, 0, 0, 0.24) 0px 0px 2px 0px, rgba(0, 0, 0, 0.24) -20px 20px 40px -4px",
                  }}
                >
                  <TextField
                    label="Причина"
                    variant="outlined"
                    color="secondary"
                    size="medium"
                    fullWidth
                    inputRef={tagRef}
                    sx={{ mb: 2 }}
                  />
                  <Button
                    variant="contained"
                    color="inherit"
                    size="medium"
                    fullWidth
                    onClick={() => {
                      if (!/[a-zA-Zа-яА-Я]/.test(tagRef.current.value)) {
                        return;
                      }
                      setAnchorEl(null);
                      localStorage.setItem(
                        "tags",
                        JSON.stringify([
                          ...(JSON.parse(localStorage.getItem("tags")) ?? []),
                          tagRef.current.value,
                        ])
                      );
                    }}
                    sx={{ mb: 2 }}
                  >
                    Добавить
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    size="medium"
                    fullWidth
                    onClick={() => {
                      setAnchorEl(null);
                      localStorage.setItem("tags", JSON.stringify([]));
                    }}
                  >
                    Очистить всё
                  </Button>
                </Paper>
              </Grow>
            )}
          </Popper>
        </div>
      </ClickAwayListener>
    </GridToolbarContainer>
  );
});

const CustomColumnMenu = memo(function CustomColumnMenu({ hideMenu, colDef }) {
  return (
    <GridColumnMenuContainer hideMenu={hideMenu} colDef={colDef}>
      <GridColumnMenuSortItem onClick={hideMenu} colDef={colDef} />
      <Divider />
      <GridColumnMenuFilterItem onClick={hideMenu} colDef={colDef} />
      <Divider />
      <GridColumnMenuHideItem onClick={hideMenu} colDef={colDef} />
      <GridColumnMenuManageItem onClick={hideMenu} colDef={colDef} />
    </GridColumnMenuContainer>
  );
});

const CustomPagination = memo(function CustomPagination(props) {
  return <GridPagination ActionsComponent={Pagination} {...props} />;
});

function Pagination({ page, onPageChange, className }) {
  const apiRef = useGridApiContext();
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);

  return (
    <MuiPagination
      color="primary"
      className={className}
      count={pageCount}
      page={page + 1}
      onChange={(event, newPage) => {
        onPageChange(event, newPage - 1);
      }}
    />
  );
}

export default function DataTable({ setData }) {
  const isBigScreen = useMediaQuery("(min-width:1600px)");
  const apiRef = useGridApiRef();
  const { keys } = useKeys();
  const { mode } = useMode();
  const { user } = useUser();

  const [loading, setLoading] = useState(false);
  const [trades, setTrades] = useState([]);

  useEffect(() => {
    if (keys.length > 0) {
      setLoading(true);
      getTrades(user.id).then((t) => {
        t.sort((a, b) => parseInt(b.entry_time) - parseInt(a.entry_time));
        setTrades(t);
        setLoading(false);

        const key1 = keys.filter((key) => key.exchange === 1)[0];
        const key2 = keys.filter((key) => key.exchange === 2)[0];

        if (t.length > 0) {
          const startTime = Number(t[0].exit_time) + 1000;
          const now = Date.now();

          switch (true) {
            case keys.length === 1 && key1 !== undefined:
              console.log("Загрузка сделок от binance");

              axios
                .get("https://fapi.binance.com/fapi/v1/time")
                .then(({ data: { serverTime } }) => {
                  axios
                    .get("https://fapi.binance.com/fapi/v1/allOrders", {
                      headers: {
                        "X-MBX-APIKEY": key1.api_key,
                      },
                      params: {
                        timestamp: serverTime,
                        recvWindow: 60000,
                        limit: 1000,
                        startTime: startTime,
                        endTime: now,
                        signature: crypto
                          .createHmac("sha256", key1.secret_key)
                          .update(
                            `timestamp=${serverTime}&recvWindow=60000&limit=1000&startTime=${startTime}&endTime=${now}`
                          )
                          .digest("hex"),
                      },
                    })
                    .then((response) => {
                      const symbols = new Set();

                      response.data.forEach((e) => {
                        symbols.add(e.symbol);
                      });

                      const s = Array.from(symbols);
                      console.log("symbols: ", s);

                      if (s.length > 0) {
                        createBynanceTrades(
                          s,
                          key1.api_key,
                          key1.secret_key,
                          key1.id,
                          user.id,
                          startTime
                        ).then((b) => {
                          console.log("createBynanceTrades: ", b);
                          b.forEach((d) => {
                            apiRef.current.updateRows(d);
                          });
                        });
                      }
                    })
                    .catch((e) => {
                      console.log("хуйня от binance: ", e);
                    });
                });
              break;

            case keys.length === 1 && key2 !== undefined:
              console.log("Загрузка сделок от bybit");

              axios
                .get("https://api.bybit.com/v5/market/time")
                .then(({ data: { time } }) => {
                  axios
                    .get(
                      `https://api.bybit.com/v5/execution/list?category=linear&limit=100&startTime=${startTime}&endTime=${now}`,
                      {
                        headers: {
                          "X-BAPI-SIGN": crypto
                            .createHmac("sha256", key2.secret_key)
                            .update(
                              time +
                                key2.api_key +
                                60000 +
                                `category=linear&limit=100&startTime=${startTime}&endTime=${now}`
                            )
                            .digest("hex"),
                          "X-BAPI-API-KEY": key2.api_key,
                          "X-BAPI-TIMESTAMP": time,
                          "X-BAPI-RECV-WINDOW": 60000,
                        },
                      }
                    )
                    .then(({ data }) => {
                      const deals = data?.result?.list;

                      console.log("deals: ", deals);

                      if (deals.length > 1) {
                        const g = deals.reduce((groups, deal) => {
                          if (!groups[deal.symbol]) {
                            groups[deal.symbol] = [];
                          }
                          groups[deal.symbol].push(deal);
                          return groups;
                        }, {});

                        for (const symbol in g) {
                          g[symbol].sort((a, b) =>
                            a.execTime > b.execTime
                              ? 1
                              : a.execTime < b.execTime
                              ? -1
                              : 0
                          );
                        }

                        const s = Object.values(g).reduce(
                          (sorted, deals) => sorted.concat(deals),
                          []
                        );

                        const trades = [];
                        let currentTrade = [];

                        for (const deal of s) {
                          if (
                            (deal.closedSize === "0" &&
                              (currentTrade.length === 0 ||
                                currentTrade[currentTrade.length - 1]
                                  .closedSize !== "0")) ||
                            (currentTrade.length > 0 &&
                              deal.symbol !== currentTrade[0].symbol)
                          ) {
                            if (currentTrade.length > 0) {
                              trades.push(currentTrade);
                              currentTrade = [];
                            }
                          }

                          currentTrade.push(deal);
                        }

                        if (currentTrade.length > 1) {
                          trades.push(currentTrade);
                        }

                        const data = trades.map((trade) => {
                          const b = trade.filter((t) => t.side === "Buy");
                          const s = trade.filter((t) => t.side === "Sell");
                          const bt = b.reduce(
                            (a, c) => a + parseFloat(c.execQty),
                            0
                          );
                          const st = s.reduce(
                            (a, c) => a + parseFloat(c.execQty),
                            0
                          );
                          const bv = b.reduce(
                            (a, c) => a + parseFloat(c.execValue),
                            0
                          );
                          const sv = s.reduce(
                            (a, c) => a + parseFloat(c.execValue),
                            0
                          );
                          return {
                            uid: user.id,
                            kid: key2.id,
                            exchange,
                            symbol: trade[0].symbol,
                            entry_time: String(trade[0].execTime),
                            exit_time: String(trade[trade.length - 1].execTime),
                            average_entry_price:
                              b.reduce(
                                (a, c) =>
                                  a +
                                  parseFloat(c.execPrice) *
                                    parseFloat(c.execQty),
                                0
                              ) / bt || 0,
                            average_exit_price:
                              s.reduce(
                                (a, c) =>
                                  a +
                                  parseFloat(c.execPrice) *
                                    parseFloat(c.execQty),
                                0
                              ) / st,
                            side: trade[0].side === "Buy" ? "BUY" : "SELL",
                            procent: (sv / st - bv / bt) / (bv / bt) || 0,
                            income: trade.reduce(
                              (a, c) => a + parseFloat(c.execFee),
                              0
                            ),
                            turnover: bt + st,
                            max_volume: Math.max(
                              bt + st,
                              Math.max(
                                ...b.map((b) => parseFloat(b.execQty)),
                                ...s.map((s) => parseFloat(s.execQty))
                              )
                            ),
                            volume: trade.reduce(
                              (a, d) => a + parseFloat(d.execValue),
                              0
                            ),
                            comission: Number(
                              trade.reduce(
                                (a, d) => a + parseFloat(d.execFee),
                                0
                              )
                            ),
                          };
                        });

                        createBybitTrades(data).then((b) => {
                          console.log("createBybitTrades: ", b);
                        });
                        data.forEach((d) => {
                          apiRef.current.updateRows(d);
                        });
                      }
                    })
                    .catch((e) => {
                      console.log("хуйня от bybit: ", e);
                    });
                });
              break;

            case keys.length === 2:
              console.log("Загрузка сделок от binance и bibyt");

              Promise.all([
                axios
                  .get("https://fapi.binance.com/fapi/v1/time")
                  .then(({ data: { serverTime } }) => {
                    axios
                      .get("https://fapi.binance.com/fapi/v1/allOrders", {
                        headers: {
                          "X-MBX-APIKEY": key1.api_key,
                        },
                        params: {
                          timestamp: serverTime,
                          recvWindow: 60000,
                          limit: 1000,
                          startTime: startTime,
                          endTime: now,
                          signature: crypto
                            .createHmac("sha256", key1.secret_key)
                            .update(
                              `timestamp=${serverTime}&recvWindow=60000&limit=1000&startTime=${startTime}&endTime=${now}`
                            )
                            .digest("hex"),
                        },
                      })
                      .then(({ data }) => {
                        const symbols = new Set();

                        data.forEach((e) => {
                          symbols.add(e.symbol);
                        });

                        const s = Array.from(symbols);
                        console.log("symbols: ", s);

                        if (s.length > 0) {
                          createBynanceTrades(
                            s,
                            key1.api_key,
                            key1.secret_key,
                            key1.id,
                            user.id,
                            startTime
                          ).then((b) => {
                            console.log("createBynanceTrades: ", b);
                            b.forEach((d) => {
                              apiRef.current.updateRows(d);
                            });
                          });
                        }
                      })
                      .catch((e) => {
                        console.log("хуйня от binance: ", e);
                      });
                  }),
                axios
                  .get("https://api.bybit.com/v5/market/time")
                  .then(({ data: { time } }) => {
                    axios
                      .get(
                        `https://api.bybit.com/v5/execution/list?category=linear&limit=100&startTime=${startTime}&endTime=${now}`,
                        {
                          headers: {
                            "X-BAPI-SIGN": crypto
                              .createHmac("sha256", key2.secret_key)
                              .update(
                                time +
                                  key2.api_key +
                                  60000 +
                                  `category=linear&limit=100&startTime=${startTime}&endTime=${now}`
                              )
                              .digest("hex"),
                            "X-BAPI-API-KEY": key2.api_key,
                            "X-BAPI-TIMESTAMP": time,
                            "X-BAPI-RECV-WINDOW": 60000,
                          },
                        }
                      )
                      .then(({ data }) => {
                        const deals = data?.result?.list;

                        console.log("deals: ", deals);

                        if (deals.length > 0) {
                          const g = deals.reduce((groups, deal) => {
                            if (!groups[deal.symbol]) {
                              groups[deal.symbol] = [];
                            }
                            groups[deal.symbol].push(deal);
                            return groups;
                          }, {});

                          for (const symbol in g) {
                            g[symbol].sort((a, b) =>
                              a.execTime > b.execTime
                                ? 1
                                : a.execTime < b.execTime
                                ? -1
                                : 0
                            );
                          }

                          const s = Object.values(g).reduce(
                            (sorted, deals) => sorted.concat(deals),
                            []
                          );

                          const trades = [];
                          let currentTrade = [];

                          for (const deal of s) {
                            // Check conditions for grouping Bybit trades
                            if (
                              (deal.closedSize === "0" &&
                                (currentTrade.length === 0 ||
                                  currentTrade[currentTrade.length - 1]
                                    .closedSize !== "0")) ||
                              (currentTrade.length > 0 &&
                                deal.symbol !== currentTrade[0].symbol)
                            ) {
                              if (currentTrade.length > 0) {
                                trades.push(currentTrade);
                                currentTrade = [];
                              }
                            }

                            currentTrade.push(deal);
                          }

                          if (currentTrade.length > 1) {
                            trades.push(currentTrade);
                          }

                          const data = trades.map((trade) => {
                            const b = trade.filter((t) => t.side === "Buy");
                            const s = trade.filter((t) => t.side === "Sell");
                            const bt = b.reduce(
                              (a, c) => a + parseFloat(c.execQty),
                              0
                            );
                            const st = s.reduce(
                              (a, c) => a + parseFloat(c.execQty),
                              0
                            );
                            const bv = b.reduce(
                              (a, c) => a + parseFloat(c.execValue),
                              0
                            );
                            const sv = s.reduce(
                              (a, c) => a + parseFloat(c.execValue),
                              0
                            );
                            return {
                              uid: user.id,
                              kid: key2.id,
                              exchange: 2,
                              symbol: trade[0].symbol,
                              entry_time: String(trade[0].execTime),
                              exit_time: String(
                                trade[trade.length - 1].execTime
                              ),
                              average_entry_price:
                                b.reduce(
                                  (a, c) =>
                                    a +
                                    parseFloat(c.execPrice) *
                                      parseFloat(c.execQty),
                                  0
                                ) / bt,
                              average_exit_price:
                                s.reduce(
                                  (a, c) =>
                                    a +
                                    parseFloat(c.execPrice) *
                                      parseFloat(c.execQty),
                                  0
                                ) / st,
                              side: trade[0].side === "Buy" ? "BUY" : "SELL",
                              procent: (sv / st - bv / bt) / (bv / bt),
                              income: trade.reduce(
                                (a, c) => a + parseFloat(c.execFee),
                                0
                              ),
                              turnover: bt + st,
                              max_volume: Math.max(
                                bt + st,
                                Math.max(
                                  ...b.map((b) => parseFloat(b.execQty)),
                                  ...s.map((s) => parseFloat(s.execQty))
                                )
                              ),
                              volume: trade.reduce(
                                (a, d) => a + parseFloat(d.execValue),
                                0
                              ),
                              comission: Number(
                                trade.reduce(
                                  (a, d) => a + parseFloat(d.execFee),
                                  0
                                )
                              ),
                            };
                          });

                          createBybitTrades(data).then((b) => {
                            console.log("b: ", b);
                          });
                          data.forEach((d) => {
                            apiRef.current.updateRows(d);
                          });
                        }
                      })
                      .catch((e) => {
                        console.log("хуйня от bybit: ", e);
                      });
                  }),
              ]);
              break;

            default:
              break;
          }
        }
      });
    }
  }, [keys]);

  const columns = useMemo(
    () => [
      {
        field: "symbol",
        headerName: "Тикер",
        width: isBigScreen ? 200 : 150,
        renderCell: (params) => (
          <MenuItem
            noWrap
            onClick={() => {
              setData({
                symbol: params.value,
                timestamp: params.row.entryTime,
                exchange: params.row.exchange,
                end: params.row.exitTime,
              });
              window.scrollTo(0, 0);
            }}
            sx={{
              mt: "auto",
              mb: "auto",
              "&:hover": {
                backgroundColor: "rgba(0, 167, 111, 0.16)",
              },
            }}
          >
            {params.value}
          </MenuItem>
        ),
      },
      {
        field: "tags",
        headerName: "Причины входа",
        width: 400,
        renderCell: (params) => (
          <Autocomplete
            multiple
            fullWidth
            options={JSON.parse(localStorage.getItem("tags")) ?? []}
            onChange={(event, value) => {
              updateTags(params.row.id, value);
            }}
            defaultValue={params?.value ? [...params.value] : []}
            noOptionsText="Нет данных"
            renderOption={(props, option, state, ownerState) => (
              <>
                <Box
                  sx={{
                    borderRadius: "8px",
                    margin: "5px",
                    [`&.${autocompleteClasses.option}`]: {
                      padding: "8px",
                    },
                  }}
                  component="li"
                  {...props}
                >
                  {ownerState.getOptionLabel(option)}
                </Box>
                <Divider />
              </>
            )}
            renderInput={(params) => (
              <TextField {...params} variant="standard" color="secondary" />
            )}
            ChipProps={{ variant: "soft", color: "info", size: "medium" }}
            popupIcon={<Iconify icon="solar:alt-arrow-down-bold-duotone" />}
          />
        ),
      },
      {
        field: "rating",
        headerName: "Оценка",
        width: isBigScreen ? 200 : 150,
        renderCell: (params) => (
          <Rating
            defaultValue={params.value}
            onChange={(e, n) => {
              updateRating(params.row.id, n);
            }}
          />
        ),
      },
      {
        field: "entryTime",
        headerName: "Время входа",
        width: isBigScreen ? 200 : 150,
        renderCell: (params) => (
          <Stack
            sx={{
              textAlign: "right",
            }}
          >
            <Typography variant="body2" sx={{ color: "text.primary" }}>
              {DateTime.fromMillis(params.value).toLocaleString({
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              {DateTime.fromMillis(params.value).toLocaleString({
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
              })}
            </Typography>
          </Stack>
        ),
      },
      {
        field: "exitTime",
        headerName: "Время выхода",
        width: isBigScreen ? 200 : 150,
        renderCell: (params) => (
          <Stack
            sx={{
              textAlign: "right",
            }}
          >
            <Typography variant="body2" sx={{ color: "text.primary" }}>
              {DateTime.fromMillis(params.value).toLocaleString({
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              {DateTime.fromMillis(params.value).toLocaleString({
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
              })}
            </Typography>
          </Stack>
        ),
      },
      {
        field: "side",
        headerName: "Сторона",
        width: isBigScreen ? 160 : 110,
        renderCell: (params) =>
          params.value === "BUY" ? (
            <Typography
              variant="subtitle1"
              sx={{
                color: "info.main",
              }}
            >
              LONG
            </Typography>
          ) : (
            <Typography
              variant="subtitle1"
              sx={{
                color: "warning.main",
              }}
            >
              SHORT
            </Typography>
          ),
      },
      {
        field: "averageEntryPrice",
        headerName: "Средняя цена входа",
        width: isBigScreen ? 230 : 170,
        renderCell: (params) => (
          <Typography
            variant="subtitle2"
            sx={{
              color: "text.primary",
              ml: 3,
            }}
          >
            $
            {params.row.side === "BUY"
              ? params.value
              : params.row.averageExitPrice}
          </Typography>
        ),
      },
      {
        field: "averageExitPrice",
        headerName: "Средняя цена выхода",
        width: isBigScreen ? 230 : 170,
        renderCell: (params) => (
          <Typography
            variant="subtitle2"
            sx={{
              color: "text.primary",
              ml: 3,
            }}
          >
            $
            {params.row.side === "BUY"
              ? params.value
              : params.row.averageEntryPrice}
          </Typography>
        ),
      },
      {
        field: "duration",
        headerName: "Длительность",
        width: isBigScreen ? 250 : 200,
        renderCell: (params) => (
          <Typography
            variant="body2"
            sx={{
              color: "text.primary",
            }}
          >
            {`${Math.floor(params.value / 3600)} час. ${Math.floor(
              (params.value % 3600) / 60
            )} мин. ${params.value % 60} сек.`}
          </Typography>
        ),
      },
      {
        field: "procent",
        headerName: "Процент",
        width: isBigScreen ? 170 : 120,
        renderCell: (params) =>
          params.value >= 0 ? (
            <Box
              component="span"
              sx={{
                height: "24px",
                minWidth: "24px",
                lineHeight: "0",
                borderRadius: "6px",
                cursor: "default",
                alignItems: "center",
                whiteSpace: "nowrap",
                display: "inline-flex",
                justifyContent: "center",
                textTransform: "capitalize",
                p: "0px 6px",
                fontSize: "0.75rem",
                fontWeight: "700",
                transition: "all 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
                color: "rgb(119, 237, 139)",
                backgroundColor: "rgba(34, 197, 94, 0.16)",
                ml: "5px",
                mr: "auto",
              }}
            >
              {params.value.toFixed(2)}%
            </Box>
          ) : (
            <Box
              component="span"
              sx={{
                height: "24px",
                minWidth: "24px",
                lineHeight: "0",
                borderRadius: "6px",
                cursor: "default",
                alignItems: "center",
                whiteSpace: "nowrap",
                display: "inline-flex",
                justifyContent: "center",
                textTransform: "capitalize",
                p: "0px 6px",
                fontSize: "0.75rem",
                fontWeight: "700",
                transition: "all 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
                color: "rgb(255, 172, 130)",
                backgroundColor: "rgba(255, 86, 48, 0.16)",
                ml: "1px",
                mr: "auto",
              }}
            >
              {params.value.toFixed(2)}%
            </Box>
          ),
      },
      {
        field: "income",
        headerName: "Доход",
        width: isBigScreen ? 170 : 120,
        renderCell: (params) => (
          <Typography
            variant="subtitle2"
            sx={{
              color: "text.primary",
              ml: 3,
            }}
          >
            {params.value}$
          </Typography>
        ),
      },
      {
        field: "profit",
        headerName: "Прибыль",
        width: isBigScreen ? 170 : 120,
        renderCell: (params) => (
          <Typography
            variant="subtitle2"
            sx={{
              color: "text.primary",
              ml: 3,
            }}
          >
            {(params.row.income - params.row.comission).toFixed(2)}$
          </Typography>
        ),
      },
      {
        field: "turnover",
        headerName: "Оборот",
        width: isBigScreen ? 170 : 120,
        renderCell: (params) => (
          <Typography
            variant="subtitle2"
            sx={{
              color: "text.primary",
              ml: 3,
            }}
          >
            {params.value}
          </Typography>
        ),
      },
      {
        field: "maxVolume",
        headerName: "Макс. объём",
        width: isBigScreen ? 180 : 130,
        renderCell: (params) => (
          <Typography
            variant="subtitle2"
            sx={{
              color: "text.primary",
              ml: 3,
            }}
          >
            {params.value > params.row.turnover
              ? params.row.turnover
              : params.value}
          </Typography>
        ),
      },
      {
        field: "volume",
        headerName: "Объём ($)",
        width: isBigScreen ? 180 : 130,
        renderCell: (params) => (
          <Typography
            variant="subtitle2"
            sx={{
              color: "text.primary",
              ml: 3,
            }}
          >
            ${params.value}
          </Typography>
        ),
      },
      {
        field: "comission",
        headerName: "Комиссия",
        width: isBigScreen ? 200 : 150,
        renderCell: (params) => (
          <Typography
            variant="body2"
            sx={{
              color: "text.primary",
              ml: 2,
            }}
          >
            ${params.value}
          </Typography>
        ),
      },
      {
        field: "apikey",
        headerName: "API-ключ",
        width: isBigScreen ? 190 : 140,
        renderCell: (params) => (
          <Typography
            variant="subtitle2"
            noWrap
            sx={{ color: "text.disabled" }}
          >
            {params.value}
          </Typography>
        ),
      },
    ],
    []
  );

  const rows = useMemo(
    () =>
      trades.length > 0
        ? trades.map((trade) => ({
            id: trade.id,
            symbol: trade.symbol,
            tags: trade.tags,
            rating: trade.rating,
            entryTime: Number(trade.entry_time),
            averageEntryPrice: trade.average_entry_price?.toFixed(2),
            exitTime: Number(trade.exit_time),
            averageExitPrice: trade.average_exit_price?.toFixed(2),
            side: trade.side,
            duration: Math.floor(
              (Number(trade.exit_time) - Number(trade.entry_time)) / 1000
            ),
            procent: trade.procent * 100,
            income: trade.income.toFixed(2),
            turnover: trade.turnover.toFixed(1) / 2,
            maxVolume: trade.max_volume.toFixed(1) / 2,
            volume: trade.volume.toFixed(1) / 2,
            comission: trade.comission.toFixed(2),
            apikey: keys.filter((key) => key.id === trade.kid)[0].title,
            exchange: trade.exchange,
          }))
        : [],
    [trades]
  );

  const dark = mode === "dark";

  return (
    <DataGrid
      autoHeight
      checkboxSelection
      disableRowSelectionOnClick
      columns={columns}
      rows={rows}
      loading={loading}
      pageSizeOptions={[10, 25, 50, 100]}
      localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
      slots={{
        loadingOverlay: LoadingOverlay,
        noRowsOverlay: NoRowsOverlay,
        columnMenu: CustomColumnMenu,
        toolbar: CustomToolbar,
        pagination: CustomPagination,
      }}
      initialState={{
        pagination: {
          paginationModel: {
            pageSize: 25,
          },
        },
      }}
      getRowHeight={() => "auto"}
      sx={{
        border: "none",
        "--DataGrid-overlayHeight": "360px",
        "&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell": { py: "5px" },
        "&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell": { py: "10px" },
        "&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell": {
          py: "15px",
        },
        "& .MuiDataGrid-columnHeaders": {
          color: "text.secondary",
          borderColor: dark ? "rgb(46, 50, 54)" : "rgb(241, 243, 244)",
          backgroundColor: dark
            ? "rgba(145, 158, 171, 0.12)"
            : "rgb(244, 246, 248)",
        },
        "& .MuiDataGrid-withBorderColor": {
          borderColor: dark
            ? "rgba(145, 158, 171, 0.12)"
            : "rgb(244, 246, 248)",
        },
        "& .MuiDataGrid-columnsContainer, .MuiDataGrid-cell": {
          borderBottom: dark
            ? "1px dashed rgba(145, 158, 171, 0.24)"
            : "1px dashed rgba(145, 158, 171, 0.5)",
        },
      }}
    />
  );
}
