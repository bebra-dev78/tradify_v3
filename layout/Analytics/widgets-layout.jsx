"use client";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import DialogContentText from "@mui/material/DialogContentText";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import FormControl from "@mui/material/FormControl";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Popover from "@mui/material/Popover";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import { useState, useCallback, useRef, useMemo } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import useSWRImmutable from "swr/immutable";
import dynamic from "next/dynamic";
import { DateTime } from "luxon";
import moment from "moment";

import AddBoardMenu from "#/layout/Analytics/add-board-menu";
import CounterBox from "#/components/counter-box";
import Iconify from "#/utils/iconify";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const CoinVolume = dynamic(() =>
  import("#/layout/Analytics/widgets/coin-volume")
);
const CounterOfTrades = dynamic(() =>
  import("#/layout/Analytics/widgets/counter-of-trades")
);
const CumulativeProfit = dynamic(() =>
  import("#/layout/Analytics/widgets/cumulative-profit")
);
const DistributionByCoin = dynamic(() =>
  import("#/layout/Analytics/widgets/distribution-by-coin")
);
const DistributionBySide = dynamic(() =>
  import("#/layout/Analytics/widgets/distribution-by-side")
);
const CumulativeCommission = dynamic(() =>
  import("#/layout/Analytics/widgets/cumulative-commission")
);
const Profit = dynamic(() => import("#/layout/Analytics/widgets/profit"));

const colors = [
  "#009E69",
  "#FF5630",
  "#FFAB00",
  "#006C9C",
  "#00bfa5",
  "#00b8d4",
  "#637381",
  "#795548",
  // "rgb(0, 184, 217)",
  // "rgb(255, 86, 48)",
  // "rgb(255, 171, 0)",
  // "rgb(142, 51, 255)",
  // "rgb(34, 197, 94)",
];

const ResponsiveGridLayout = WidthProvider(Responsive);

function DeleteBoardButton({
  value,
  boards,
  setValue,
  setBoards,
  setWidgets,
  currentBoardRef,
  widgetsParamsRef,
}) {
  const [confirmation, setConfirmation] = useState(false);

  return (
    <>
      <Button
        variant="text"
        color="error"
        startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
        onClick={() => {
          setConfirmation(true);
        }}
        sx={{ height: "36px" }}
      >
        Удалить доску
      </Button>
      <Dialog
        open={confirmation}
        onClose={() => {
          setConfirmation(false);
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, p: 3, color: "text.primary" }}
        >
          Подтвердите действие
        </Typography>
        <DialogContent sx={{ p: "0px 24px" }}>
          <DialogContentText>
            Вы уверены, что хотите удалить доску «
            {boards.find((_, i) => i === value)}»?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            variant="contained"
            color="error"
            size="medium"
            autoFocus
            onClick={() => {
              setConfirmation(false);
              setWidgets((prev) => {
                const t = prev.filter((w) => w.owner_board !== boards[value]);
                localStorage.setItem("widgets", JSON.stringify(t));
                return t;
              });
              setBoards((prev) => {
                const n = prev.filter((_, i) => i !== value);
                localStorage.setItem("boards", JSON.stringify(n));
                return n;
              });
              setValue((prev) => {
                const n = prev < 1 ? 0 : prev - 1;
                currentBoardRef.current = n;
                return n;
              });
              widgetsParamsRef.current = Object.keys(
                widgetsParamsRef.current
              ).reduce((acc, key) => {
                if (!key.includes(`-${boards[value]}`)) {
                  acc[key] = widgetsParamsRef.current[key];
                }
                return acc;
              }, {});
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
            onClick={() => {
              setConfirmation(false);
            }}
          >
            Отмена
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

function AddBoardButton({ boards, setBoards }) {
  const [anchorEl, setAnchorEl] = useState(null);

  return (
    <>
      <Button
        color="inherit"
        variant="text"
        startIcon={<Iconify icon="ic:round-plus" />}
        onClick={(e) => {
          setAnchorEl(e.currentTarget);
        }}
        sx={{ height: "36px" }}
      >
        Добавить доску
      </Button>
      <Popover
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
        <AddBoardMenu
          boards={boards}
          setBoards={setBoards}
          setAnchorEl={setAnchorEl}
        />
      </Popover>
    </>
  );
}

function TimeRangeSelect({
  setTimeRangeStatus,
  timeRangeStatus,
  setTimeRange,
}) {
  const [customItem, setCustomItem] = useState("Указать вручную");
  const [confirmation, setConfirmation] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const initDateRef = useRef(null);
  const endDateRef = useRef(null);

  return (
    <>
      <FormControl>
        <InputLabel>Временной диапазон</InputLabel>
        <Select
          label="Временной диапазон"
          value={timeRangeStatus}
          onChange={(e) => {
            setTimeRangeStatus(e.target.value);
            localStorage.setItem("timeRange", e.target.value);
          }}
        >
          <MenuItem value="current-day">Сегодня</MenuItem>
          <MenuItem value="current-week">Текущая неделя</MenuItem>
          <MenuItem value="current-month">Текущий месяц</MenuItem>
          <MenuItem value="last-7">Последние 7 дней</MenuItem>
          <MenuItem value="last-30">Последние 30 дней</MenuItem>
          <MenuItem
            value="custom"
            onClick={() => {
              setConfirmation(true);
            }}
          >
            {customItem}
          </MenuItem>
        </Select>
      </FormControl>
      <Dialog
        open={confirmation}
        onClose={() => {
          setConfirmation(false);
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, p: 3, color: "text.primary" }}
        >
          Выберите диапазон дат
        </Typography>
        <DialogContent sx={{ p: "0px 24px" }}>
          <Stack sx={{ gap: "16px", pt: "8px", justifyContent: "center" }}>
            <LocalizationProvider dateAdapter={AdapterLuxon} adapterLocale="ru">
              <DemoContainer components={["DatePicker"]}>
                <DatePicker
                  label="Начало"
                  slots={{
                    openPickerIcon: () => (
                      <Iconify
                        icon="solar:calendar-mark-bold-duotone"
                        color="text.secondary"
                      />
                    ),
                  }}
                  slotProps={{
                    textField: { fullWidth: true, error: disabled },
                  }}
                  defaultValue={DateTime.now()}
                  inputRef={initDateRef}
                  onChange={() => {
                    setDisabled(false);
                  }}
                />
              </DemoContainer>
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterLuxon} adapterLocale="ru">
              <DemoContainer components={["DatePicker"]}>
                <DatePicker
                  label="Конец"
                  slots={{
                    openPickerIcon: () => (
                      <Iconify
                        icon="solar:calendar-mark-bold-duotone"
                        color="text.secondary"
                      />
                    ),
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      helperText: disabled
                        ? "Начало не может быть больше конца."
                        : "",
                      error: disabled,
                    },
                  }}
                  defaultValue={DateTime.now()}
                  inputRef={endDateRef}
                  onChange={() => {
                    setDisabled(false);
                  }}
                />
              </DemoContainer>
            </LocalizationProvider>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            variant="outlined"
            color="inherit"
            size="medium"
            onClick={() => {
              setConfirmation(false);
            }}
          >
            Отмена
          </Button>
          <Button
            variant="contained"
            color="inherit"
            size="medium"
            autoFocus
            disabled={disabled}
            onClick={() => {
              const start = DateTime.fromFormat(
                initDateRef.current?.value,
                "dd.MM.yyyy"
              ).toMillis();
              const end = DateTime.fromFormat(
                endDateRef.current?.value,
                "dd.MM.yyyy"
              ).toMillis();
              if (start > end) {
                setDisabled(true);
              } else {
                setConfirmation(false);
                setTimeRange([start, end]);
                setCustomItem(
                  `${DateTime.fromMillis(start).toLocaleString({
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })} - ${DateTime.fromMillis(end).toLocaleString({
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}`
                );
              }
            }}
          >
            Применить
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default function WidgetsLayout({
  boards,
  widgets,
  setBoards,
  setWidgets,
  currentBoardRef,
  widgetsParamsRef,
}) {
  const { data, isLoading } = useSWRImmutable("null");

  const [value, setValue] = useState(0);
  const [timeRange, setTimeRange] = useState([]);
  const [timeRangeStatus, setTimeRangeStatus] = useState(() => {
    const n = localStorage.getItem("timeRange");
    return n === "custom" || n === null ? "current-week" : n;
  });

  const current = useMemo(() => {
    if (data) {
      switch (timeRangeStatus) {
        case "current-day":
          return data.filter((trade) =>
            moment(parseInt(trade.entry_time)).isBetween(
              DateTime.now().startOf("day").toMillis(),
              DateTime.now().endOf("day").toMillis()
            )
          );

        case "current-week":
          return data.filter((trade) =>
            moment(parseInt(trade.entry_time)).isBetween(
              DateTime.now().startOf("week").toMillis(),
              DateTime.now().endOf("week").toMillis()
            )
          );

        case "current-month":
          return data.filter((trade) =>
            moment(parseInt(trade.entry_time)).isBetween(
              DateTime.now().startOf("month").toMillis(),
              DateTime.now().endOf("month").toMillis()
            )
          );

        case "last-7":
          return data.filter((trade) =>
            moment(parseInt(trade.entry_time)).isBetween(
              DateTime.now().minus({ days: 7 }).toMillis(),
              DateTime.now().toMillis()
            )
          );

        case "last-30":
          return data.filter((trade) =>
            moment(parseInt(trade.entry_time)).isBetween(
              DateTime.now().minus({ days: 30 }).toMillis(),
              DateTime.now().toMillis()
            )
          );

        case "custom":
          try {
            return data.filter((trade) =>
              moment(parseInt(trade.entry_time)).isBetween(
                DateTime.fromMillis(timeRange[0]).startOf("day").toMillis(),
                DateTime.fromMillis(timeRange[1]).endOf("day").toMillis()
              )
            );
          } catch (e) {
            return [];
          }

        default:
          return [];
      }
    } else {
      return [];
    }
  }, [data, timeRangeStatus, timeRange]);

  console.log(`${timeRangeStatus}: `, current);

  const handleDeleteWidget = useCallback(
    (ID) => {
      setWidgets((prev) => {
        delete widgetsParamsRef.current[`${ID}-${boards[value]}`];
        const v = prev.filter(
          (w) => !(w.owner_board === boards[value] && w.id === ID)
        );
        localStorage.setItem("widgets", JSON.stringify(v));
        localStorage.setItem(
          "widgetsParams",
          JSON.stringify(widgetsParamsRef.current)
        );
        return v;
      });
    },
    [value]
  );

  const chartTypes = JSON.parse(localStorage.getItem("chartTypes"));

  return (
    <>
      <Stack
        sx={{ justifyContent: "space-between", flexDirection: "row", mt: 3 }}
      >
        <Stack sx={{ gap: 1, flexDirection: "row", mt: 1 }}>
          <DeleteBoardButton
            value={value}
            boards={boards}
            setValue={setValue}
            setBoards={setBoards}
            setWidgets={setWidgets}
            currentBoardRef={currentBoardRef}
            widgetsParamsRef={widgetsParamsRef}
          />
          <AddBoardButton boards={boards} setBoards={setBoards} />
        </Stack>
        <TimeRangeSelect
          setTimeRange={setTimeRange}
          timeRangeStatus={timeRangeStatus}
          setTimeRangeStatus={setTimeRangeStatus}
        />
      </Stack>
      <Tabs
        scrollButtons
        variant="scrollable"
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
            icon={<CounterBox widgets={widgets} board={board} />}
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
          .filter((w) => w.owner_board === boards[value])
          .map((widget) => {
            var params = widgetsParamsRef.current[
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
                      data={current}
                      colors={colors}
                      isLoading={isLoading}
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
                      data={current}
                      isLoading={isLoading}
                      handleDeleteWidget={handleDeleteWidget}
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
                      data={current}
                      colors={colors}
                      isLoading={isLoading}
                      chartTypes={chartTypes}
                      timeRangeStatus={timeRangeStatus}
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
                      data={current}
                      timeRange={timeRange}
                      isLoading={isLoading}
                      chartTypes={chartTypes}
                      timeRangeStatus={timeRangeStatus}
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
                      data={current}
                      isLoading={isLoading}
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
                      data={current}
                      isLoading={isLoading}
                      chartTypes={chartTypes}
                      timeRangeStatus={timeRangeStatus}
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
                      data={current}
                      isLoading={isLoading}
                      chartTypes={chartTypes}
                      timeRangeStatus={timeRangeStatus}
                      handleDeleteWidget={handleDeleteWidget}
                    />
                  </div>
                );
              default:
                break;
            }
          })}
      </ResponsiveGridLayout>
    </>
  );
}
