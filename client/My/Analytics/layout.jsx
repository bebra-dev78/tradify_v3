"use client";

import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

import { useState, useEffect, useCallback, memo } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import dynamic from "next/dynamic";

import AddBoardMenu from "#/client/My/Analytics/add-board-menu";
import { useMode } from "#/client/Global/theme-registry";
import { useKeys, useUser } from "#/app/my/layout";
import { getTrades } from "#/server/trades";
import Iconify from "#/utils/iconify";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const Profit = dynamic(() => import("#/client/My/Analytics/widgets/profit"));
const DistributionByCoin = dynamic(() =>
  import("#/client/My/Analytics/widgets/distribution-by-coin")
);
const DistributionBySide = dynamic(() =>
  import("#/client/My/Analytics/widgets/distribution-by-side")
);
const CounterOfTrades = dynamic(() =>
  import("#/client/My/Analytics/widgets/counter-of-trades")
);
const CumulativeCommission = dynamic(() =>
  import("#/client/My/Analytics/widgets/cumulative-commission")
);
const CoinVolume = dynamic(() =>
  import("#/client/My/Analytics/widgets/coin-volume")
);
const CumulativeProfit = dynamic(() =>
  import("#/client/My/Analytics/widgets/cumulative-profit")
);

const ResponsiveGridLayout = WidthProvider(Responsive);

export default memo(function Layout({
  boards,
  widgets,
  setBoards,
  setWidgets,
  currentBoardRef,
  widgetsParamsRef,
}) {
  const { keys } = useKeys();
  const { user } = useUser();
  const { mode } = useMode();

  const [confirmation, setConfirmation] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [trades, setTrades] = useState([]);
  const [value, setValue] = useState(0);

  useEffect(() => {
    widgetsParamsRef.current =
      JSON.parse(localStorage.getItem("widgetsParams")) ?? {};
    if (keys.length > 0) {
      getTrades(user.id).then((t) => {
        setTrades(t);
      });
    }
  }, [keys]);

  const handleDeleteWidget = useCallback(
    (ID) => {
      setWidgets((prev) => {
        const v = prev.filter(
          (w) => !(w.owner_board === boards[value] && w.id === ID)
        );
        localStorage.setItem("widgets", JSON.stringify(v));
        delete widgetsParamsRef.current[`${ID}-${boards[value]}`];
        localStorage.setItem(
          "widgetsParams",
          JSON.stringify(widgetsParamsRef.current)
        );
        return v;
      });
    },
    [value]
  );

  return (
    <>
      <Stack
        sx={{ justifyContent: "space-between", flexDirection: "row", mt: 3 }}
      >
        <Button
          variant="text"
          color="error"
          startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
          onClick={() => {
            setConfirmation(true);
          }}
        >
          Удалить доску
        </Button>
        <Dialog
          open={confirmation}
          onClose={() => {
            setConfirmation(false);
          }}
        >
          <DialogTitle sx={{ fontWeight: 700, p: 3, color: "text.primary" }}>
            Подтвердите действие
          </DialogTitle>
          <DialogContent sx={{ pl: 3, pr: 3 }}>
            <DialogContentText>
              Вы уверены, что хотите удалить доску{" "}
              {boards.find((b, i) => i === value)}?
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button
              variant="contained"
              color="error"
              size="medium"
              onClick={() => {
                setConfirmation(false);
                widgetsParamsRef.current = Object.keys(
                  widgetsParamsRef.current
                ).reduce((acc, key) => {
                  if (!key.includes(`-${boards[value]}`)) {
                    acc[key] = widgetsParamsRef.current[key];
                  }
                  return acc;
                }, {});
                setBoards((prev) => {
                  const n = prev.filter((b, i) => i !== value);
                  localStorage.setItem("boards", JSON.stringify(n));

                  return n;
                });
                setWidgets((prev) => {
                  const t = prev.filter(
                    (w) => w.owner_board !== boards[currentBoardRef.current]
                  );
                  localStorage.setItem("widgets", JSON.stringify(t));
                  return t;
                });
                setValue((prev) => {
                  const n = prev < 1 ? 0 : prev - 1;
                  currentBoardRef.current = n;
                  return n;
                });
                localStorage.setItem(
                  "widgetsParams",
                  JSON.stringify(widgetsParamsRef.current)
                );
              }}
            >
              Удалить
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              size="medium"
              autoFocus
              onClick={() => {
                setConfirmation(false);
              }}
            >
              Отмена
            </Button>
          </DialogActions>
        </Dialog>
        <Button
          color="inherit"
          variant="text"
          startIcon={<Iconify icon="ic:round-plus" />}
          onClick={(e) => {
            setAnchorEl(e.currentTarget);
          }}
        >
          Добавить доску
        </Button>
        <AddBoardMenu
          open={Boolean(anchorEl)}
          boards={boards}
          anchorEl={anchorEl}
          setBoards={setBoards}
          setAnchorEl={setAnchorEl}
        />
      </Stack>
      <Tabs
        scrollButtons
        variant="scrollable"
        selectionFollowsFocus
        allowScrollButtonsMobile
        value={value}
        onChange={(e, n) => {
          setValue(n);
          currentBoardRef.current = n;
        }}
        sx={{
          "& .MuiTab-root.Mui-selected": {
            color: "text.primary",
          },
          "& .MuiTabs-indicator": {
            backgroundColor: "text.primary",
          },
        }}
      >
        {boards.map((board) => (
          <Tab
            key={board}
            label={board}
            iconPosition="end"
            disableTouchRipple
            icon={
              widgets.filter((w) => w.owner_board === board).length > 0 && (
                <Box
                  component="span"
                  sx={{
                    lineHeight: 0,
                    height: "24px",
                    fontWeight: 700,
                    minWidth: "24px",
                    cursor: "default",
                    padding: "0px 6px",
                    fontSize: "0.75rem",
                    borderRadius: "6px",
                    alignItems: "center",
                    whiteSpace: "nowrap",
                    display: "inline-flex",
                    justifyContent: "center",
                    backgroundColor: "rgba(0, 184, 217, 0.16)",
                    transition: "all 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
                    color:
                      mode === "dark"
                        ? "rgb(97, 243, 243)"
                        : "rgb(0, 108, 156)",
                  }}
                >
                  {widgets.filter((w) => w.owner_board === board).length}
                </Box>
              )
            }
            sx={{ color: "text.disabled" }}
          />
        ))}
      </Tabs>
      <ResponsiveGridLayout
        draggableHandle=".drag-header"
        rowHeight={35}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 16, md: 14, sm: 10, xs: 8, xxs: 6 }}
        onResizeStop={(l, o, n) => {
          widgetsParamsRef.current = {
            ...widgetsParamsRef.current,
            [n.i]: {
              x: n.x,
              y: n.y,
              w: n.w,
              h: n.h,
            },
          };
          localStorage.setItem(
            "widgetsParams",
            JSON.stringify(widgetsParamsRef.current)
          );
        }}
        onDragStop={(l, o, n) => {
          widgetsParamsRef.current = {
            ...widgetsParamsRef.current,
            [n.i]: {
              x: n.x,
              y: n.y,
              w: n.w,
              h: n.h,
            },
          };
          localStorage.setItem(
            "widgetsParams",
            JSON.stringify(widgetsParamsRef.current)
          );
        }}
      >
        {widgets
          ?.filter((w) => w.owner_board === boards[value])
          .map((widget) => {
            const params = widgetsParamsRef.current[
              `${widget.id}-${boards[value]}`
            ] ?? {
              x: 0,
              y: 0,
              w: 10,
              h: 12,
            };
            switch (widget.id) {
              case 1:
                return (
                  <div
                    key={`1-${boards[value]}`}
                    data-grid={{
                      x: params.x,
                      y: params.y,
                      w: params.w,
                      h: params.h,
                    }}
                  >
                    <DistributionByCoin
                      trades={trades}
                      handleDeleteWidget={handleDeleteWidget}
                    />
                  </div>
                );
              case 2:
                return (
                  <div
                    key={`2-${boards[value]}`}
                    data-grid={{
                      x: params.x,
                      y: params.y,
                      w: params.w,
                      h: params.h,
                    }}
                  >
                    <DistributionBySide
                      trades={trades}
                      handleDeleteWidget={handleDeleteWidget}
                      widgetsParamsRef={widgetsParamsRef.current}
                    />
                  </div>
                );
              case 3:
                return (
                  <div
                    key={`3-${boards[value]}`}
                    data-grid={{
                      x: params.x,
                      y: params.y,
                      w: params.w,
                      h: params.h,
                    }}
                  >
                    <CounterOfTrades
                      trades={trades}
                      handleDeleteWidget={handleDeleteWidget}
                    />
                  </div>
                );
              case 4:
                return (
                  <div
                    key={`4-${boards[value]}`}
                    data-grid={{
                      x: params.x,
                      y: params.y,
                      w: params.w,
                      h: params.h,
                    }}
                  >
                    <CumulativeCommission
                      trades={trades}
                      handleDeleteWidget={handleDeleteWidget}
                    />
                  </div>
                );
              case 5:
                return (
                  <div
                    key={`5-${boards[value]}`}
                    data-grid={{
                      x: params.x,
                      y: params.y,
                      w: params.w,
                      h: params.h,
                    }}
                  >
                    <CoinVolume
                      trades={trades}
                      handleDeleteWidget={handleDeleteWidget}
                    />
                  </div>
                );
              case 6:
                return (
                  <div
                    key={`6-${boards[value]}`}
                    data-grid={{
                      x: params.x,
                      y: params.y,
                      w: params.w,
                      h: params.h,
                    }}
                  >
                    <Profit
                      trades={trades}
                      handleDeleteWidget={handleDeleteWidget}
                    />
                  </div>
                );
              case 7:
                return (
                  <div
                    key={`7-${boards[value]}`}
                    data-grid={{
                      x: params.x,
                      y: params.y,
                      w: params.w,
                      h: params.h,
                    }}
                  >
                    <CumulativeProfit
                      trades={trades}
                      handleDeleteWidget={handleDeleteWidget}
                    />
                  </div>
                );
              default:
                return null;
            }
          })}
      </ResponsiveGridLayout>
    </>
  );
});
