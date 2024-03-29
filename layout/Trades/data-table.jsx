"use client";

import Autocomplete, { autocompleteClasses } from "@mui/material/Autocomplete";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import CircularProgress from "@mui/material/CircularProgress";
import AccordionSummary from "@mui/material/AccordionSummary";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import LinearProgress from "@mui/material/LinearProgress";
import useMediaQuery from "@mui/material/useMediaQuery";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import MuiPagination from "@mui/material/Pagination";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import SpeedDial from "@mui/material/SpeedDial";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Collapse from "@mui/material/Collapse";
import Backdrop from "@mui/material/Backdrop";
import Popover from "@mui/material/Popover";
import Divider from "@mui/material/Divider";
import Slider from "@mui/material/Slider";
import Popper from "@mui/material/Popper";
import Rating from "@mui/material/Rating";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
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

import { useState, useEffect, useRef, useMemo, useCallback, memo } from "react";
import useSWRImmutable from "swr/immutable";
import { useSWRConfig } from "swr";
import { DateTime } from "luxon";
import Image from "next/image";
import crypto from "crypto";
import axios from "axios";

import { useMode } from "#/components/global/theme-registry";
import FailSnackbar from "#/components/snackbar-fail";
import { useKeys, useUser } from "#/app/my/layout";
import useFormat from "#/utils/format-thousands";
import Iconify from "#/utils/iconify";

import {
  updateTags,
  deleteTrades,
  updateRating,
  updateDefaultTrade,
  createDefaultTrades,
} from "#/server/trades";

import overlay from "#/public/svg/illustration_empty_content.svg";

const LoadingOverlay = memo(function LoadingOverlay({ loading }) {
  return loading === false ? (
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
  ) : (
    <LinearProgress color="secondary" />
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

const CustomToolbar = memo(function CustomToolbar({
  height,
  setHeight,
  autoHeight,
  setAutoHeight,
}) {
  const isSmallScreen = useMediaQuery("(max-width:900px)");
  const { mode } = useMode();

  const dark = mode === "dark";

  return isSmallScreen ? (
    <Accordion
      sx={{
        backdropFilter: "none",
        padding: 0,
        borderTop: dark
          ? "1px dashed rgba(145, 158, 171, 0.24)"
          : "1px dashed rgba(145, 158, 171, 0.5)",
        "&.MuiAccordion-root.Mui-expanded": {
          backgroundColor: dark
            ? "1px dashed rgba(145, 158, 171, 0.24)"
            : "1px dashed rgba(145, 158, 171, 0.5)",
          boxShadow: "none",
          borderRadius: "0px !important",
        },
        "&:first-of-type": {
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
        },
      }}
    >
      <AccordionSummary
        expandIcon={
          <Iconify
            icon="solar:alt-arrow-down-bold-duotone"
            color="text.secondary"
            sx={{ m: 1 }}
          />
        }
        sx={{
          "&:first-of-type": {
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
          },
        }}
      >
        <Typography variant="body1" sx={{ color: "text.secondary", m: 1 }}>
          Настройки
        </Typography>
      </AccordionSummary>
      <GridToolbarContainer
        sx={{
          padding: "14px",
          borderColor: dark ? "rgb(46, 50, 54)" : "rgb(241, 243, 244)",
          backgroundColor: dark
            ? "rgba(145, 158, 171, 0.12)"
            : "rgb(244, 246, 248)",
        }}
      >
        <GridToolbarColumnsButton color="info" />
        <GridToolbarFilterButton color="info" />
        <GridToolbarDensitySelector color="info" />
        <GridToolbarExport color="info" />
        <GridToolbarAddTag />
        <GridToolbarTableHeight
          height={height}
          setHeight={setHeight}
          autoHeight={autoHeight}
          setAutoHeight={setAutoHeight}
        />
      </GridToolbarContainer>
    </Accordion>
  ) : (
    <GridToolbarContainer
      sx={{
        padding: "14px",
        borderColor: dark ? "rgb(46, 50, 54)" : "rgb(241, 243, 244)",
        backgroundColor: dark
          ? "rgba(145, 158, 171, 0.12)"
          : "rgb(244, 246, 248)",
        borderBottom: dark
          ? "1px dashed rgba(145, 158, 171, 0.24)"
          : "1px dashed rgba(145, 158, 171, 0.5)",
      }}
    >
      <GridToolbarColumnsButton color="info" />
      <GridToolbarFilterButton color="info" />
      <GridToolbarDensitySelector color="info" />
      <GridToolbarExport color="info" />
      <GridToolbarAddTag />
      <GridToolbarTableHeight
        height={height}
        setHeight={setHeight}
        autoHeight={autoHeight}
        setAutoHeight={setAutoHeight}
      />
    </GridToolbarContainer>
  );
});

function CustomColumnMenu({ hideMenu, colDef }) {
  return (
    <GridColumnMenuContainer hideMenu={hideMenu} colDef={colDef}>
      <GridColumnMenuSortItem onClick={hideMenu} colDef={colDef} />
      <Divider
        sx={{
          borderStyle: "solid",
        }}
      />
      <GridColumnMenuFilterItem onClick={hideMenu} colDef={colDef} />
      <Divider
        sx={{
          borderStyle: "solid",
        }}
      />
      <GridColumnMenuHideItem onClick={hideMenu} colDef={colDef} />
      <GridColumnMenuManageItem onClick={hideMenu} colDef={colDef} />
    </GridColumnMenuContainer>
  );
}

const CustomPagination = memo(function CustomPagination(props) {
  return <GridPagination ActionsComponent={Pagination} {...props} />;
});

function Pagination({ page, onPageChange, className }) {
  const apiRef = useGridApiContext();
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);

  return (
    <MuiPagination
      color="error"
      className={className}
      count={pageCount}
      page={page + 1}
      onChange={(event, newPage) => {
        onPageChange(event, newPage - 1);
      }}
    />
  );
}

const AutoHeightPopover = memo(function AutoHeightPopover() {
  const [anchorEl, setAnchorEl] = useState(null);

  return (
    <>
      <IconButton
        onMouseEnter={(e) => {
          setAnchorEl(e.currentTarget);
        }}
        onMouseLeave={() => {
          setAnchorEl(null);
        }}
      >
        <Iconify
          icon="solar:question-circle-linear"
          color="text.secondary"
          width={20}
        />
      </IconButton>
      <Popover
        sx={{
          pointerEvents: "none",
        }}
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        onClose={() => {
          setAnchorEl(null);
        }}
        disableRestoreFocus
      >
        <Box sx={{ p: 2, width: 300 }}>
          <Typography variant="subtitle1" paragraph>
            Режим автоматической высоты
          </Typography>
          <Typography sx={{ color: "text.secondary" }}>
            При включении этого режима высота таблицы будет автоматически{" "}
            <b>подстраиваться</b> под общее количество сделок на странице. Этот
            параметр почти полностью отключает <b>виртуализацию</b>, в
            результате чего незначительно снижается оптимизация таблицы.
          </Typography>
        </Box>
      </Popover>
    </>
  );
});

const HeightPopover = memo(function HeightPopover() {
  const [anchorEl, setAnchorEl] = useState(null);

  return (
    <>
      <IconButton
        onMouseEnter={(e) => {
          setAnchorEl(e.currentTarget);
        }}
        onMouseLeave={() => {
          setAnchorEl(null);
        }}
      >
        <Iconify
          icon="solar:question-circle-linear"
          color="text.secondary"
          width={20}
        />
      </IconButton>
      <Popover
        sx={{
          pointerEvents: "none",
        }}
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        onClose={() => {
          setAnchorEl(null);
        }}
        disableRestoreFocus
      >
        <Box sx={{ p: 2, width: 300 }}>
          <Typography variant="subtitle1" paragraph>
            Режим фиксированной высоты
          </Typography>
          <Typography sx={{ color: "text.secondary" }}>
            При включении этого режима высота таблицы всегда будет равна
            выбранному <b>количеству пикселей</b>, вне зависимости от общего
            количества сделок на странице.
          </Typography>
        </Box>
      </Popover>
    </>
  );
});

const GridToolbarAddTag = memo(function GridToolbarAddTag() {
  const [anchorEl, setAnchorEl] = useState(null);

  const popperRef = useRef(null);

  const open = Boolean(anchorEl);

  return (
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
            setAnchorEl(open ? null : event.currentTarget);
          }}
        >
          <Iconify icon="solar:add-square-outline" width={20} sx={{ mr: 1 }} />
          Добавить причину
        </Button>
        <Popper
          open={open}
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
          sx={{ zIndex: 1051, position: "absolute" }}
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
                <GridToolbarAddTagPaper setAnchorEl={setAnchorEl} />
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    </ClickAwayListener>
  );
});

const GridToolbarAddTagPaper = memo(function GridToolbarAddTagPaper({
  setAnchorEl,
}) {
  const tagRef = useRef(null);

  useEffect(() => {
    function handleKeyPress(event) {
      if (event.key === "Enter") {
        handleSubmit();
      }
    }

    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  function handleSubmit() {
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
  }

  return (
    <>
      <TextField
        label="Причина"
        variant="outlined"
        color="secondary"
        size="medium"
        fullWidth
        autoFocus
        inputRef={tagRef}
        sx={{ mb: 2 }}
      />
      <Button
        variant="contained"
        color="inherit"
        size="medium"
        fullWidth
        autoSave=""
        onClick={handleSubmit}
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
    </>
  );
});

const GridToolbarTableHeight = memo(function GridToolbarTableHeight({
  height,
  setHeight,
  autoHeight,
  setAutoHeight,
}) {
  const [openHeightTable, setOpenHeightTable] = useState(false);
  const [activate, setActivate] = useState(autoHeight);
  const [onChange, setOnChange] = useState(height);

  return (
    <>
      <Button
        variant="text"
        color="info"
        size="small"
        onClick={() => {
          setOpenHeightTable((prev) => !prev);
        }}
      >
        <Iconify icon="solar:ruler-bold-duotone" sx={{ mr: 1 }} />
        Высота таблицы
      </Button>
      <Collapse
        in={openHeightTable}
        timeout="auto"
        unmountOnExit
        sx={{ width: "100%" }}
      >
        <Box>
          <Box sx={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <Typography
              variant="body2"
              sx={{
                alignItems: "center",
                display: "inline-flex",
              }}
            >
              <AutoHeightPopover />
              Автоматическая высота:
            </Typography>
            <Switch
              checked={activate}
              onChange={(e) => {
                setActivate(e.target.checked);
                localStorage.setItem("autoHeight", e.target.checked);
              }}
            />
          </Box>
          <Box sx={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <Typography
              variant="body2"
              sx={{
                alignItems: "center",
                display: "inline-flex",
              }}
            >
              <HeightPopover />
              Фиксированная высота:
            </Typography>
            <Slider
              valueLabelDisplay="auto"
              defaultValue={height}
              disabled={activate}
              color="secondary"
              step={100}
              max={2000}
              min={300}
              sx={{ width: "20%", mr: 3 }}
              onChange={(e, v) => {
                setOnChange(v);
                localStorage.setItem("height", v);
              }}
              marks={[
                {
                  value: height,
                  label: height,
                },
                {
                  value: 2000,
                  label: 2000,
                },
              ]}
            />
          </Box>
          <Collapse
            in={activate !== autoHeight || onChange !== height}
            timeout="auto"
            unmountOnExit
            sx={{ width: "100%" }}
          >
            <Button
              variant="text"
              color="warning"
              size="small"
              onClick={() => {
                setHeight(onChange);
                setAutoHeight(activate);
              }}
            >
              <Iconify icon="line-md:backup-restore" sx={{ mr: 1 }} />
              Обновить таблицу
            </Button>
          </Collapse>
        </Box>
      </Collapse>
    </>
  );
});

const DealActions = memo(function DealActions({ apiRef, hidden }) {
  const [showFailSnackbar, setShowFailSnackbar] = useState(false);
  const [open, setOpen] = useState(false);

  return (
    <>
      <Backdrop open={open} />
      <SpeedDial
        open={open}
        hidden={hidden}
        ariaLabel="SpeedDial"
        icon={
          <SpeedDialIcon
            openIcon={<Iconify icon="solar:widget-6-bold-duotone" />}
          />
        }
        onClose={() => {
          setOpen(false);
        }}
        onOpen={() => {
          setOpen(true);
        }}
        FabProps={{
          sx: {
            backgroundColor: "rgb(81, 25, 183)",
            boxShadow: "rgba(142, 51, 255, 0.24) 0px 8px 16px 0px",
            "&:hover": {
              backgroundColor: "rgb(81, 25, 183)",
              boxShadow: "none",
            },
          },
        }}
        sx={{ position: "fixed", bottom: 40, right: 40 }}
      >
        <SpeedDialAction
          icon={
            <Iconify
              icon="solar:trash-bin-trash-bold"
              sx={{ color: "error.main" }}
            />
          }
          tooltipTitle="Удалить"
          tooltipOpen
          onClick={() => {
            setOpen(false);
            const ids = [];
            apiRef.current.getSelectedRows().forEach(({ id }) => {
              ids.push(id);
              apiRef.current.updateRows([{ id, _action: "delete" }]);
            });
            deleteTrades(ids);
          }}
          sx={{
            "& .MuiSpeedDialAction-staticTooltipLabel": {
              color: "text.primary",
            },
          }}
        />
        <SpeedDialAction
          icon={
            <Iconify
              icon="solar:share-circle-bold-duotone"
              sx={{ color: "info.main" }}
            />
          }
          tooltipTitle="Объединить"
          tooltipOpen
          onClick={() => {
            setOpen(false);

            const trades = [];

            apiRef.current.getSelectedRows().forEach((trade) => {
              trades.push(trade);
            });

            trades.sort((a, b) => a.entryTime - b.entryTime);

            const lastTrade = trades[0];
            const firstTrade = trades[trades.length - 1];

            if (
              trades.length < 2 ||
              !trades.every(
                (trade) =>
                  trade.symbol === firstTrade.symbol &&
                  trade.exchange === firstTrade.exchange
              )
            ) {
              setShowFailSnackbar(true);
              return;
            }
            const ids = trades
              .map((trade) => trade.id)
              .filter((t) => t !== firstTrade.id);

            ids.forEach((id) => {
              apiRef.current.updateRows([{ id, _action: "delete" }]);
            });
            apiRef.current.updateRows([
              {
                id: firstTrade.id,
                tags: trades.flatMap((trade) => trade.tags ?? []),
                entryTime: lastTrade.entryTime,
                procent: trades
                  .reduce(
                    (sum, trade) => sum + parseFloat(trade.procent || 0),
                    0
                  )
                  .toFixed(2),
                income: trades
                  .reduce(
                    (sum, trade) => sum + parseFloat(trade.income || 0),
                    0
                  )
                  .toFixed(3),
                turnover: trades
                  .reduce(
                    (sum, trade) => sum + parseFloat(trade.turnover || 0),
                    0
                  )
                  .toFixed(1),
                maxVolume: trades
                  .reduce(
                    (max, trade) =>
                      Math.max(max, parseFloat(trade.maxVolume || 0)),
                    0
                  )
                  .toFixed(1),
                volume: trades
                  .reduce(
                    (sum, trade) => sum + parseFloat(trade.volume || 0),
                    0
                  )
                  .toFixed(2),
                comission: trades
                  .reduce(
                    (sum, trade) => sum + parseFloat(trade.comission || 0),
                    0
                  )
                  .toFixed(3),
                averageEntryPrice: (
                  parseFloat(firstTrade.averageEntryPrice) +
                  parseFloat(lastTrade.averageEntryPrice)
                ).toFixed(4),
                averageExitPrice: (
                  parseFloat(firstTrade.averageExitPrice) +
                  parseFloat(lastTrade.averageExitPrice)
                ).toFixed(4),
                duration: trades.reduce(
                  (sum, trade) => sum + parseFloat(trade.duration || 0),
                  0
                ),
                deals: trades.flatMap((trade) => trade.deals ?? []),
              },
            ]);
            deleteTrades(ids);
            updateDefaultTrade(firstTrade.id, {
              tags: trades.flatMap((trade) => trade.tags ?? []),
              entry_time: String(lastTrade.entryTime),
              exit_time: String(firstTrade.exitTime),
              procent: trades
                .reduce((sum, trade) => sum + parseFloat(trade.procent || 0), 0)
                .toFixed(2),
              income: trades
                .reduce((sum, trade) => sum + parseFloat(trade.income || 0), 0)
                .toFixed(3),
              turnover: trades
                .reduce(
                  (sum, trade) => sum + parseFloat(trade.turnover || 0),
                  0
                )
                .toFixed(1),
              max_volume: trades
                .reduce(
                  (max, trade) =>
                    Math.max(max, parseFloat(trade.maxVolume || 0)),
                  0
                )
                .toFixed(1),
              volume: trades
                .reduce((sum, trade) => sum + parseFloat(trade.volume || 0), 0)
                .toFixed(2),
              comission: trades
                .reduce(
                  (sum, trade) => sum + parseFloat(trade.comission || 0),
                  0
                )
                .toFixed(3),
              avg_entry_price: (
                parseFloat(firstTrade.averageEntryPrice) +
                parseFloat(lastTrade.averageEntryPrice)
              ).toFixed(4),
              avg_exit_price: (
                parseFloat(firstTrade.averageExitPrice) +
                parseFloat(lastTrade.averageExitPrice)
              ).toFixed(4),
              duration: String(
                trades.reduce(
                  (sum, trade) => sum + parseFloat(trade.duration || 0),
                  0
                )
              ),
              deals: trades.flatMap((trade) => trade.deals ?? []),
            });
          }}
          sx={{
            "& .MuiSpeedDialAction-staticTooltipLabel": {
              color: "text.primary",
            },
          }}
        />
        <SpeedDialAction
          icon={
            <Iconify
              icon="solar:star-bold-duotone"
              sx={{ color: "warning.main" }}
            />
          }
          tooltipTitle="Архивировать"
          tooltipOpen
          onClick={() => {
            setOpen(false);
            apiRef.current.getSelectedRows().forEach(({ id }) => {
              apiRef.current.updateRows([{ id, _action: "delete" }]);
            });
          }}
          sx={{
            "& .MuiSpeedDialAction-staticTooltipLabel": {
              color: "text.primary",
            },
          }}
        />
      </SpeedDial>
      <FailSnackbar
        showFailSnackbar={showFailSnackbar}
        setShowFailSnackbar={setShowFailSnackbar}
        text={
          <>
            Невозможно объединить
            <br />
            выбранные сделки.
          </>
        }
      />
    </>
  );
});

export default function DataTable({ dataRef, activate, setActivate }) {
  const { mutate } = useSWRConfig();
  const apiRef = useGridApiRef();
  const { keys } = useKeys();
  const { mode } = useMode();
  const { user } = useUser();

  const { data, isLoading } = useSWRImmutable("null");

  const [autoHeight, setAutoHeight] = useState(
    JSON.parse(localStorage.getItem("autoHeight")) ?? false
  );
  const [height, setHeight] = useState(
    JSON.parse(localStorage.getItem("height")) ?? 800
  );
  const [pageSize, setPageSize] = useState(
    JSON.parse(localStorage.getItem("pageSize")) ?? 25
  );
  const [loading, setLoading] = useState(false);
  const [onLoad, setOnLoad] = useState(false);
  const [hidden, setHidden] = useState(true);

  const rowId = useRef(null);

  useEffect(() => {
    if (data?.length > 0) {
      setOnLoad(true);
    }
  }, [data]);

  useEffect(() => {
    if (onLoad && keys.length > 0) {
      const key1 = keys.find((key) => key.exchange === 1);
      const key2 = keys.find((key) => key.exchange === 2);

      var requests = [];

      const startTime =
        Number(
          data.sort(
            (a, b) => parseInt(b.entry_time) - parseInt(a.entry_time)
          )[0].exit_time
        ) + 500;

      const now = Date.now();

      setLoading(true);

      if (key1 !== undefined && data.some((trade) => trade.exchange === 1)) {
        requests.push(
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
                    startTime,
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

                  console.log("ордера (binance): ", data);

                  data.forEach((e) => {
                    if (e.status !== "CANCELED") {
                      symbols.add(e.symbol);
                    }
                  });

                  const s = Array.from(symbols);

                  if (s.length > 0) {
                    Promise.all(
                      s.map(
                        async (symbol) =>
                          await axios
                            .get(
                              `https://fapi.binance.com/fapi/v1/userTrades?symbol=${symbol}&timestamp=${serverTime}&signature=${crypto
                                .createHmac("sha256", key1.secret_key)
                                .update(
                                  `symbol=${symbol}&timestamp=${serverTime}&recvWindow=60000&limit=1000&startTime=${startTime}`
                                )
                                .digest(
                                  "hex"
                                )}&recvWindow=60000&limit=1000&startTime=${startTime}`,
                              {
                                headers: {
                                  "X-MBX-APIKEY": key1.api_key,
                                },
                              }
                            )
                            .then((r) => r.data)
                      )
                    ).then((deals) => {
                      console.log("сделки (binance): ", deals);

                      var trades = [];

                      deals
                        .filter((t) => t.length)
                        .forEach((deal) => {
                          let currentTrade = [];

                          for (let i = 0; i < deal.length; i++) {
                            const currentTradeEmpty = currentTrade.length === 0;
                            const isClosingTrade =
                              i === deal.length - 1 ||
                              (i < deal.length - 1 &&
                                parseFloat(deal[i].realizedPnl) !== 0 &&
                                parseFloat(deal[i + 1].realizedPnl) === 0);
                            const isOpeningTrade =
                              i === 0 ||
                              (i > 0 &&
                                parseFloat(deal[i].realizedPnl) === 0 &&
                                parseFloat(deal[i - 1].realizedPnl) !== 0);

                            if (currentTradeEmpty || isOpeningTrade) {
                              currentTrade.push(deal[i]);
                            } else if (isClosingTrade) {
                              currentTrade.push(deal[i]);
                              trades.push([...currentTrade]);
                              currentTrade = [];
                            } else {
                              currentTrade.push(deal[i]);
                            }
                          }
                        });

                      console.log("trades (binance):", trades);

                      if (trades.length > 0) {
                        createDefaultTrades(
                          trades.map((trade) => {
                            var deals = [];
                            var ut = new Set();
                            var b = trade.filter((t) => t.side === "BUY");
                            var s = trade.filter((t) => t.side === "SELL");
                            var bt = b.reduce(
                              (a, c) => a + parseFloat(c.qty),
                              0
                            );
                            var st = s.reduce(
                              (a, c) => a + parseFloat(c.qty),
                              0
                            );
                            var bv = b.reduce(
                              (a, c) => a + parseFloat(c.quoteQty),
                              0
                            );
                            var sv = s.reduce(
                              (a, c) => a + parseFloat(c.quoteQty),
                              0
                            );

                            trade.forEach((t) => {
                              if (!ut.has(t.time)) {
                                ut.add(t.time);
                                deals.push({
                                  time: t.time,
                                  side: t.side,
                                  price: t.price,
                                });
                              }
                            });

                            return {
                              uid: user.id,
                              kid: key1.id,
                              exchange: 1,
                              symbol: trade[0].symbol,
                              entry_time: String(trade[0].time),
                              exit_time: String(trade[trade.length - 1].time),
                              side: trade[0].side,
                              procent: (
                                ((sv / st - bv / bt) / (bv / bt)) *
                                100
                              ).toFixed(2),
                              income: trade
                                .reduce(
                                  (a, c) => a + parseFloat(c.realizedPnl),
                                  0
                                )
                                .toFixed(3),
                              turnover: ((bt + st) / 2).toFixed(1),
                              max_volume: (
                                Math.max(
                                  bt + st,
                                  Math.max(
                                    ...b.map((b) => parseFloat(b.qty)),
                                    ...s.map((s) => parseFloat(s.qty))
                                  )
                                ) / 2
                              ).toFixed(1),
                              volume: (
                                trade.reduce(
                                  (a, d) =>
                                    a + parseFloat(d.price) * parseFloat(d.qty),
                                  0
                                ) / 2
                              ).toFixed(2),
                              comission: trade
                                .reduce(
                                  (a, d) => a + parseFloat(d.commission),
                                  0
                                )
                                .toFixed(3),
                              avg_entry_price: (
                                b.reduce(
                                  (a, c) =>
                                    a + parseFloat(c.price) * parseFloat(c.qty),
                                  0
                                ) / bt
                              ).toFixed(4),
                              avg_exit_price: (
                                s.reduce(
                                  (a, c) =>
                                    a + parseFloat(c.price) * parseFloat(c.qty),
                                  0
                                ) / st
                              ).toFixed(4),
                              duration: String(
                                trade[trade.length - 1].time - trade[0].time
                              ),
                              deals,
                            };
                          })
                        ).then((b) => {
                          console.log("createDefaultTrades (binance): ", b);

                          b.forEach((trade) => {
                            apiRef.current.updateRows([
                              {
                                id: trade.id,
                                kid: trade.kid,
                                exchange: trade.exchange,
                                symbol: trade.symbol,
                                tags: trade.tags,
                                rating: trade.rating,
                                entryTime: parseInt(trade.entry_time),
                                exitTime: parseInt(trade.exit_time),
                                side: trade.side,
                                procent: parseFloat(trade.procent),
                                income: trade.income,
                                turnover: parseFloat(trade.turnover),
                                maxVolume: parseFloat(trade.max_volume),
                                volume: trade.volume,
                                comission: trade.comission,
                                averageEntryPrice: trade.avg_entry_price,
                                averageExitPrice: trade.avg_exit_price,
                                duration: parseInt(trade.duration),
                                deals: trade.deals,
                                apikey: keys.find((key) => key.id === trade.kid)
                                  .title,
                              },
                            ]);
                          });
                        });
                      }
                    });
                  }
                })
                .catch((e) => {
                  console.log("хуйня от binance: ", e);
                });
            })
        );
      }

      var bybit = [];

      if (key2 !== undefined && data.some((trade) => trade.exchange === 2)) {
        requests.push(
          axios
            .get("https://api.bybit.com/v5/market/time")
            .then(async ({ data: { time } }) => {
              let cursor = "";

              do {
                await axios
                  .get(
                    `https://api.bybit.com/v5/execution/list?category=linear&limit=100&startTime=${startTime}&endTime=${now}&cursor=${cursor}`,
                    {
                      headers: {
                        "X-BAPI-SIGN": crypto
                          .createHmac("sha256", key2.secret_key)
                          .update(
                            time +
                              key2.api_key +
                              60000 +
                              `category=linear&limit=100&startTime=${startTime}&endTime=${now}&cursor=${cursor}`
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
            })
            .catch((e) => {
              console.log("хуйня от bybit: ", e);
            })
        );
      }

      Promise.all(requests).then(() => {
        console.log("сделки (bybit): ", bybit);

        if (bybit[0]?.length > 1) {
          var g = bybit.flat().reduce((groups, deal) => {
            if (!groups[deal.symbol]) {
              groups[deal.symbol] = [];
            }
            groups[deal.symbol].push(deal);
            return groups;
          }, {});

          for (var symbol in g) {
            g[symbol].sort((a, b) =>
              a.execTime > b.execTime ? 1 : a.execTime < b.execTime ? -1 : 0
            );
          }

          var s = Object.values(g).reduce(
            (sorted, deals) => sorted.concat(deals),
            []
          );

          var trades = [];
          let currentTrade = [];

          for (var deal of s) {
            if (
              (deal.closedSize === "0" &&
                (currentTrade.length === 0 ||
                  currentTrade[currentTrade.length - 1].closedSize !== "0")) ||
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

          trades.push(currentTrade);

          console.log("trades (bybit): ", trades);

          if (trades.length > 0) {
            createDefaultTrades(
              trades.map((trade) => {
                var deals = [];
                var ut = new Set();
                var b = trade.filter((t) => t.side === "Buy");
                var s = trade.filter((t) => t.side === "Sell");
                var bt = b.reduce((a, c) => a + parseFloat(c.execQty), 0);
                var st = s.reduce((a, c) => a + parseFloat(c.execQty), 0);
                var bv = b.reduce((a, c) => a + parseFloat(c.execValue), 0);
                var sv = s.reduce((a, c) => a + parseFloat(c.execValue), 0);

                trade.forEach((t) => {
                  if (!ut.has(t.execTime)) {
                    ut.add(t.execTime);
                    deals.push({
                      time: t.execTime,
                      side: t.side.toUpperCase(),
                      price: t.execPrice,
                    });
                  }
                });

                return {
                  uid: user.id,
                  kid: key2.id,
                  exchange: 2,
                  symbol: trade[0].symbol,
                  entry_time: String(trade[0].execTime),
                  exit_time: String(trade[trade.length - 1].execTime),
                  side: trade[0].side.toUpperCase(),
                  procent: (((sv / st - bv / bt) / (bv / bt)) * 100).toFixed(2),
                  income: (parseFloat(sv) - parseFloat(bv)).toFixed(3),
                  turnover: ((bt + st) / 2).toFixed(1),
                  max_volume: (
                    Math.max(
                      bt + st,
                      Math.max(
                        ...b.map((b) => parseFloat(b.execQty)),
                        ...s.map((s) => parseFloat(s.execQty))
                      )
                    ) / 2
                  ).toFixed(1),
                  volume: (
                    trade.reduce((a, d) => a + parseFloat(d.execValue), 0) / 2
                  ).toFixed(2),
                  comission: trade
                    .reduce((a, d) => a + parseFloat(d.execFee), 0)
                    .toFixed(3),
                  avg_entry_price: (
                    b.reduce(
                      (a, c) =>
                        a + parseFloat(c.execPrice) * parseFloat(c.execQty),
                      0
                    ) / bt
                  ).toFixed(4),
                  avg_exit_price: (
                    s.reduce(
                      (a, c) =>
                        a + parseFloat(c.execPrice) * parseFloat(c.execQty),
                      0
                    ) / st
                  ).toFixed(4),
                  duration: String(
                    trade[trade.length - 1].execTime - trade[0].execTime
                  ),
                  deals,
                };
              })
            ).then((b) => {
              console.log("createDefaultTrades (bybit): ", b);

              b.forEach((trade) => {
                apiRef.current.updateRows([
                  {
                    id: trade.id,
                    kid: trade.kid,
                    exchange: trade.exchange,
                    symbol: trade.symbol,
                    tags: trade.tags,
                    rating: trade.rating,
                    entryTime: parseInt(trade.entry_time),
                    exitTime: parseInt(trade.exit_time),
                    side: trade.side,
                    procent: parseFloat(trade.procent),
                    income: trade.income,
                    turnover: parseFloat(trade.turnover),
                    maxVolume: parseFloat(trade.max_volume),
                    volume: trade.volume,
                    comission: trade.comission,
                    averageEntryPrice: trade.avg_entry_price,
                    averageExitPrice: trade.avg_exit_price,
                    duration: parseInt(trade.duration),
                    deals: trade.deals,
                    apikey: keys.find((key) => key.id === trade.kid).title,
                  },
                ]);
              });
            });
          }
        }

        setLoading(false);
      });
    }
    return () => {
      mutate("null");
    };
  }, [onLoad]);

  const columns = useMemo(
    () => [
      {
        field: "symbol",
        headerName: "Тикер",
        width: 150,
        renderCell: ({ value, row }) => (
          <MenuItem
            noWrap
            onClick={() => {
              setActivate({ status: true });
              dataRef.current = {
                exchange: row.exchange,
                procent: row.procent,
                start: row.entryTime,
                deals: row.deals,
                symbol: value,
              };
              window.scrollTo(0, 0);
              rowId.current = row.id;
            }}
            sx={{
              mt: "auto",
              mb: "auto",
              backgroundColor:
                rowId.current === row.id
                  ? "rgba(0, 167, 111, 0.16)"
                  : "transparent",
              "&:hover": {
                backgroundColor:
                  rowId.current === row.id
                    ? "rgba(0, 167, 111, 0.32)"
                    : "rgba(255, 255, 255, 0.08)",
              },
            }}
          >
            {value}
          </MenuItem>
        ),
      },
      {
        field: "tags",
        headerName: "Причины входа",
        width: 350,
        renderCell: ({ value, row }) => (
          <Autocomplete
            multiple
            fullWidth
            noOptionsText="Нет данных"
            value={value ?? []}
            options={JSON.parse(localStorage.getItem("tags")) ?? []}
            onChange={(e, n) => {
              apiRef.current.updateRows([{ id: row.id, tags: n }]);
              updateTags(row.id, n);
            }}
            renderOption={(props, option, state, ownerState) => (
              <Box
                sx={{
                  borderRadius: "8px",
                  marginTop: "6px",
                  [`&.${autocompleteClasses.option}`]: {
                    padding: "8px",
                  },
                }}
                component="li"
                {...props}
              >
                {ownerState.getOptionLabel(option)}
              </Box>
            )}
            ChipProps={{ variant: "soft", color: "info", size: "medium" }}
            popupIcon={<Iconify icon="solar:alt-arrow-down-bold-duotone" />}
            renderInput={(params) => (
              <TextField {...params} variant="standard" color="secondary" />
            )}
          />
        ),
      },
      {
        field: "rating",
        headerName: "Оценка",
        width: 150,
        renderCell: ({ value, row }) => (
          <Rating
            value={value}
            icon={<StarRoundedIcon color="warning" />}
            emptyIcon={<StarRoundedIcon color="text.secondary" />}
            onChange={(e, n) => {
              apiRef.current.updateRows([{ id: row.id, rating: n }]);
              updateRating(row.id, n);
            }}
          />
        ),
      },
      {
        field: "entryTime",
        headerName: "Время входа",
        width: 140,
        renderCell: ({ value }) => (
          <Stack
            sx={{
              textAlign: "right",
            }}
          >
            {DateTime.fromMillis(value).toLocaleString({
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              {DateTime.fromMillis(value).toLocaleString({
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
        width: 140,
        renderCell: ({ value }) => (
          <Stack
            sx={{
              textAlign: "right",
            }}
          >
            {DateTime.fromMillis(value).toLocaleString({
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              {DateTime.fromMillis(value).toLocaleString({
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
        description: "Направление сделки",
        renderCell: ({ value }) =>
          value === "BUY" ? (
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
        headerName: "Цена входа",
        description: "Средняя цена входа",
        width: 120,
        renderCell: ({ value, row }) => (
          <Typography variant="subtitle2">
            ${row.side === "BUY" ? value : row.averageExitPrice}
          </Typography>
        ),
      },
      {
        field: "averageExitPrice",
        headerName: "Цена выхода",
        description: "Средняя цена выхода",
        width: 130,
        renderCell: ({ value, row }) => (
          <Typography variant="subtitle2">
            ${row.side === "BUY" ? value : row.averageEntryPrice}
          </Typography>
        ),
      },
      {
        field: "duration",
        headerName: "Длительность",
        width: 200,
        valueFormatter: ({ value }) => {
          const hours = Math.floor(value / 1000 / 3600);
          const minutes = Math.floor((value / 1000 / 60) % 60);
          const seconds = Math.floor((value / 1000) % 60);
          return `${hours > 0 ? `${hours} час. ` : ""}${
            minutes > 0 ? `${minutes} мин. ` : ""
          }${seconds > 0 ? `${seconds} сек. ` : `${value % 1000} мс. `}`.trim();
        },
      },
      {
        type: "number",
        field: "procent",
        headerName: "Процент",
        renderCell: ({ value }) =>
          value >= 0 ? (
            <Box
              component="span"
              sx={{
                p: "0px 6px",
                width: "54px",
                height: "24px",
                lineHeight: "0",
                cursor: "default",
                fontWeight: "700",
                borderRadius: "6px",
                fontSize: "0.75rem",
                alignItems: "center",
                whiteSpace: "nowrap",
                display: "inline-flex",
                justifyContent: "center",
                color: "rgb(119, 237, 139)",
                textTransform: "capitalize",
                backgroundColor: "rgba(34, 197, 94, 0.16)",
                transition: "all 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
              }}
            >
              {value}%
            </Box>
          ) : (
            <Box
              component="span"
              sx={{
                p: "0px 6px",
                width: "54px",
                height: "24px",
                lineHeight: "0",
                cursor: "default",
                fontWeight: "700",
                fontSize: "0.75rem",
                borderRadius: "6px",
                alignItems: "center",
                whiteSpace: "nowrap",
                display: "inline-flex",
                justifyContent: "center",
                color: "rgb(255, 172, 130)",
                textTransform: "capitalize",
                backgroundColor: "rgba(255, 86, 48, 0.16)",
                transition: "all 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
              }}
            >
              {value}%
            </Box>
          ),
      },
      {
        type: "number",
        field: "income",
        headerName: "Доход",
        width: 150,
        valueFormatter: ({ value }) => `${value}$`,
      },
      {
        type: "number",
        field: "profit",
        headerName: "Прибыль",
        width: 150,
        valueGetter: ({ row }) =>
          `${(parseFloat(row.income) - parseFloat(row.comission)).toFixed(2)}$`,
      },
      {
        type: "number",
        field: "turnover",
        headerName: "Оборот",
        width: 150,
        renderCell: ({ value }) => (
          <Typography variant="subtitle2">{useFormat(value)}</Typography>
        ),
      },
      {
        type: "number",
        field: "maxVolume",
        headerName: "Макс. объём",
        width: 150,
        renderCell: ({ value, row }) => (
          <Typography variant="subtitle2">
            {useFormat(Math.max(row.turnover, value))}
          </Typography>
        ),
      },
      {
        type: "number",
        field: "volume",
        headerName: "Объём ($)",
        width: 150,
        valueFormatter: ({ value }) => useFormat(value),
      },
      {
        type: "number",
        field: "comission",
        headerName: "Комиссия",
        width: 150,
        valueFormatter: ({ value }) => `$${value}`,
      },
      {
        type: "number",
        field: "apikey",
        headerName: "API-ключ",
        width: 150,
        renderCell: ({ value }) => (
          <Typography
            variant="subtitle2"
            noWrap
            sx={{ color: "text.disabled" }}
          >
            {value}
          </Typography>
        ),
      },
    ],
    [activate, height, autoHeight]
  );

  const rows = useMemo(() => {
    if (data) {
      return data.map((trade) => ({
        id: trade.id,
        kid: trade.kid,
        exchange: trade.exchange,
        symbol: trade.symbol,
        tags: trade.tags,
        rating: trade.rating,
        entryTime: parseInt(trade.entry_time),
        exitTime: parseInt(trade.exit_time),
        side: trade.side,
        procent: parseFloat(trade.procent),
        income: trade.income,
        turnover: parseFloat(trade.turnover),
        maxVolume: parseFloat(trade.max_volume),
        volume: parseFloat(trade.volume),
        comission: trade.comission,
        averageEntryPrice: trade.avg_entry_price,
        averageExitPrice: trade.avg_exit_price,
        duration: parseInt(trade.duration),
        deals: trade.deals,
        apikey: keys.find((key) => key.id === trade.kid).title,
      }));
    } else {
      return [];
    }
  }, [data]);

  const sx = useMemo(
    () => ({
      border: "none",
      "--DataGrid-overlayHeight": "600px",
      "&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell": {
        py: "5px",
      },
      "&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell": {
        py: "10px",
      },
      "&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell": {
        py: "15px",
      },
      "& .MuiDataGrid-columnHeaders": {
        color: "text.secondary",
        borderColor: mode === "dark" ? "rgb(46, 50, 54)" : "rgb(241, 243, 244)",
        backgroundColor:
          mode === "dark" ? "rgba(145, 158, 171, 0.12)" : "rgb(244, 246, 248)",
      },
      "& .MuiDataGrid-withBorderColor": {
        borderColor:
          mode === "dark" ? "rgba(145, 158, 171, 0.12)" : "rgb(244, 246, 248)",
      },
      "& .MuiDataGrid-columnsContainer, .MuiDataGrid-cell": {
        borderBottom:
          mode === "dark"
            ? "1px dashed rgba(145, 158, 171, 0.24)"
            : "1px dashed rgba(145, 158, 171, 0.5)",
      },
    }),
    [mode]
  );

  const slotProps = useMemo(
    () => ({
      loadingOverlay: { loading },
      toolbar: {
        height,
        setHeight,
        autoHeight,
        setAutoHeight,
      },
    }),
    [loading, height, autoHeight]
  );

  const initialState = useMemo(
    () => ({
      pagination: {
        paginationModel: {
          pageSize,
        },
      },
      sorting: {
        sortModel: [{ field: "entryTime", sort: "desc" }],
      },
    }),
    [pageSize]
  );

  const onRowSelectionModelChange = useCallback(
    (n) => setHidden(n.length > 0 ? false : true),
    []
  );

  const onPaginationModelChange = useCallback(({ pageSize }) => {
    setPageSize(pageSize);
    localStorage.setItem("pageSize", pageSize);
  }, []);

  return (
    <>
      {autoHeight ? (
        <DataGrid
          autoHeight
          checkboxSelection
          disableRowSelectionOnClick
          localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
          onRowSelectionModelChange={onRowSelectionModelChange}
          onPaginationModelChange={onPaginationModelChange}
          pageSizeOptions={pageSizeOptions}
          getRowHeight={getRowHeight}
          initialState={initialState}
          slotProps={slotProps}
          loading={isLoading || loading}
          columns={columns}
          apiRef={apiRef}
          slots={slots}
          rows={rows}
          sx={sx}
        />
      ) : (
        <Box sx={{ height }}>
          <DataGrid
            checkboxSelection
            disableRowSelectionOnClick
            localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
            onRowSelectionModelChange={onRowSelectionModelChange}
            onPaginationModelChange={onPaginationModelChange}
            pageSizeOptions={pageSizeOptions}
            getRowHeight={getRowHeight}
            initialState={initialState}
            slotProps={slotProps}
            loading={isLoading || loading}
            columns={columns}
            apiRef={apiRef}
            slots={slots}
            rows={rows}
            sx={sx}
          />
        </Box>
      )}
      <DealActions apiRef={apiRef} hidden={hidden} />
    </>
  );
}

const getRowHeight = () => "auto";

const slots = {
  loadingOverlay: LoadingOverlay,
  noRowsOverlay: NoRowsOverlay,
  columnMenu: CustomColumnMenu,
  pagination: CustomPagination,
  toolbar: CustomToolbar,
};

const pageSizeOptions = [10, 25, 50, 100];
