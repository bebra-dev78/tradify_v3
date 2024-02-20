"use client";

import FormHelperText from "@mui/material/FormHelperText";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import FormControl from "@mui/material/FormControl";
import DialogTitle from "@mui/material/DialogTitle";
import LoadingButton from "@mui/lab/LoadingButton";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";

import { useState, useRef } from "react";
import crypto from "crypto";
import axios from "axios";

import { createBynanceTrades, createBybitTrades } from "#/server/trades";
import SuccessSnackbar from "#/client/Shared/snackbar-success";
import { useKeys, useUser } from "#/app/my/layout";
import { createKey } from "#/server/keys";
import Iconify from "#/utils/iconify";

const EXCHANGES = {
  1: "Binance Futures",
  2: "Bybit Linear",
};

export default function TabKeysAddKeyPanel({ setLoadingTrades }) {
  const { keys, setKeys } = useKeys();
  const { user } = useUser();

  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);
  const [secretkeyError, setSecretkeyError] = useState("");
  const [exchangeError, setExchangeError] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [apikeyError, setApikeyError] = useState("");
  const [titleError, setTitleError] = useState("");
  const [loading, setLoading] = useState(false);

  const secretkeyRef = useRef(null);
  const exchangeRef = useRef(null);
  const apikeyRef = useRef(null);
  const titleRef = useRef(null);

  function handleSubmit() {
    let secretkeyMessage = "";
    let exchangeMessage = "";
    let apikeyMessage = "";
    let titleMessage = "";

    const secretkey = secretkeyRef.current.value;
    const exchange = exchangeRef.current.value;
    const apikey = apikeyRef.current.value;
    const title = titleRef.current.value;

    switch (true) {
      case apikey.length < 10:
        apikeyMessage = "Слишком короткий ключ";
        break;
      case apikey.length > 256:
        apikeyMessage = "Слишком длинный ключ";
        break;
      case /\s/.test(apikey):
        apikeyMessage = "Ключ не должен содержать пробелы";
        break;
      default:
        break;
    }

    switch (true) {
      case secretkey.length < 10:
        secretkeyMessage = "Слишком короткий ключ";
        break;
      case secretkey.length > 256:
        secretkeyMessage = "Слишком длинный ключ";
        break;
      case /\s/.test(secretkey):
        secretkeyMessage = "Ключ не должен содержать пробелы";
        break;
      default:
        break;
    }

    switch (true) {
      case title.length < 3:
        titleMessage = "Не менее 3 символов";
        break;
      case title.length > 18:
        titleMessage = "Не более 18 символов";
        break;
      case /\s/.test(title):
        titleMessage = "Название не должно содержать пробелы";
        break;
      case !/^[A-Za-zА-Яа-яЁё\d\s.,!?()-]+$/.test(title):
        titleMessage = "Некорректное название";
        break;
      default:
        break;
    }

    switch (true) {
      case !exchange:
        exchangeMessage = "Выберите биржу";
        break;
      default:
        break;
    }

    if (apikeyMessage || secretkeyMessage || titleMessage || exchangeMessage) {
      setApikeyError(apikeyMessage);
      setSecretkeyError(secretkeyMessage);
      setTitleError(titleMessage);
      setExchangeError(exchangeMessage);
      return;
    }

    setLoading(true);

    const now = Date.now();

    switch (exchange) {
      case 1:
        axios
          .get("https://fapi.binance.com/fapi/v1/time")
          .then(({ data: { serverTime } }) => {
            const requests = [];

            for (
              let start = now - 2592000000;
              start < now;
              start += 604800000
            ) {
              const end = Math.min(start + 604800000, now);
              requests.push(
                axios.get("https://fapi.binance.com/fapi/v1/allOrders", {
                  headers: {
                    "X-MBX-APIKEY": apikey,
                  },
                  params: {
                    timestamp: serverTime,
                    recvWindow: 60000,
                    limit: 1000,
                    startTime: start,
                    endTime: end,
                    signature: crypto
                      .createHmac("sha256", secretkey)
                      .update(
                        `timestamp=${serverTime}&recvWindow=60000&limit=1000&startTime=${start}&endTime=${end}`
                      )
                      .digest("hex"),
                  },
                })
              );
            }
            Promise.all(requests)
              .then((responses) => {
                const symbols = new Set();

                responses
                  .reduce((acc, response) => acc.concat(response.data), [])
                  .forEach((e) => {
                    symbols.add(e.symbol);
                  });

                createKey(user.id, apikey, secretkey, title, exchange).then(
                  (k) => {
                    setLoading(false);

                    if (k === null) {
                      setApikeyError("Такой ключ уже существует");
                      return;
                    }

                    setOpenDialog(false);
                    setShowSuccessSnackbar(true);
                    setKeys((prev) => [...prev, k]);
                    setLoadingTrades({ id: k.id, status: true });
                    secretkeyRef.current.value = "";
                    exchangeRef.current.value = "";
                    apikeyRef.current.value = "";
                    titleRef.current.value = "";
                    setSecretkeyError("");
                    setApikeyError("");

                    createBynanceTrades(
                      user.id,
                      k.id,
                      apikey,
                      Array.from(symbols),
                      secretkey,
                      now - 2592000000
                    ).then((b) => {
                      setLoadingTrades({ id: null, status: false });
                      console.log("createBynanceTrades: ", b);
                    });
                  }
                );
              })
              .catch((e) => {
                setLoading(false);
                setApikeyError("Неверный ключ");
                setSecretkeyError("Неверный ключ");
                console.log("хуйня от binance: ", e);
              });
          });
        break;

      case 2:
        axios.get("https://api.bybit.com/v5/market/time").then(({ data }) => {
          axios
            .get(
              "https://api.bybit.com/v5/account/wallet-balance?accountType=UNIFIED",
              {
                headers: {
                  "X-BAPI-SIGN": crypto
                    .createHmac("sha256", secretkey)
                    .update(data.time + apikey + 60000 + "accountType=UNIFIED")
                    .digest("hex"),
                  "X-BAPI-API-KEY": apikey,
                  "X-BAPI-TIMESTAMP": data.time,
                  "X-BAPI-RECV-WINDOW": 60000,
                },
              }
            )
            .then(({ data }) => {
              if (data.retMsg === "OK") {
                createKey(user.id, apikey, secretkey, title, exchange).then(
                  (k) => {
                    setLoading(false);

                    if (k === null) {
                      setApikeyError("Такой ключ уже существует");
                      return;
                    }

                    setOpenDialog(false);
                    setShowSuccessSnackbar(true);
                    setKeys((prev) => [...prev, k]);
                    setLoadingTrades({ id: k.id, status: true });
                    secretkeyRef.current.value = "";
                    exchangeRef.current.value = "";
                    apikeyRef.current.value = "";
                    titleRef.current.value = "";
                    setSecretkeyError("");
                    setApikeyError("");

                    createBybitTrades(
                      user.id,
                      k.id,
                      apikey,
                      secretkey,
                      now
                    ).then((b) => {
                      setLoadingTrades({ id: null, status: false });
                      console.log("createBybitTrades: ", b);
                    });
                  }
                );
              } else {
                setLoading(false);
                setApikeyError("Неверный ключ");
                setSecretkeyError("Неверный ключ");
                console.log("хуйня от bybit (data): ", data);
              }
            })
            .catch((e) => {
              setLoading(false);
              setApikeyError("Неверный ключ");
              setSecretkeyError("Неверный ключ");
              console.log("хуйня от bybit: ", e);
            });
        });
        break;

      default:
        setLoading(false);
        break;
    }
  }

  return (
    <>
      <Typography
        variant="h5"
        sx={{
          color: "text.primary",
          mt: 3,
        }}
      >
        доступно ключей: {2 - keys.length}
      </Typography>
      <Box sx={{ position: "absolute", top: "24px", right: "24px" }}>
        <Button
          variant="contained"
          color="inherit"
          size="medium"
          disabled={keys.length > 1}
          startIcon={<Iconify icon="line-md:plus" width={20} />}
          onClick={() => {
            setOpenDialog(true);
          }}
        >
          Новый ключ
        </Button>
        <Dialog
          open={openDialog}
          fullWidth
          maxWidth="sm"
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
          <DialogTitle sx={{ p: "24px 24px 16px" }}>
            Добавить API-ключ
          </DialogTitle>
          <DialogContent sx={{ pr: 3, pl: 3 }}>
            <Stack sx={{ gap: 2, pt: 2 }}>
              <TextField
                label="API-ключ"
                name="api"
                type="text"
                variant="outlined"
                color="warning"
                fullWidth
                inputRef={apikeyRef}
                onChange={() => {
                  setApikeyError("");
                }}
                FormHelperTextProps={{ sx: { m: "8px 14px 0px" } }}
                error={Boolean(apikeyError)}
                helperText={
                  apikeyError || "Ключ должен быть доступен с любого IP-адреса."
                }
              />
              <TextField
                label="Cекретный ключ"
                name="secret"
                type="text"
                variant="outlined"
                color="info"
                fullWidth
                inputRef={secretkeyRef}
                onChange={() => {
                  setSecretkeyError("");
                }}
                error={Boolean(secretkeyError)}
                helperText={secretkeyError}
              />
              <TextField
                label="Название ключа"
                name="title"
                type="text"
                variant="outlined"
                color="secondary"
                fullWidth
                inputRef={titleRef}
                onChange={() => {
                  setTitleError("");
                }}
                error={Boolean(titleError)}
                helperText={titleError}
              />
              <FormControl fullWidth error={Boolean(exchangeError)}>
                <InputLabel>Биржа</InputLabel>
                <Select
                  label="Биржа"
                  inputRef={exchangeRef}
                  renderValue={(value) => (
                    <Chip
                      label={EXCHANGES[value]}
                      color="warning"
                      variant="soft"
                      size="medium"
                    />
                  )}
                  onChange={() => {
                    setExchangeError("");
                  }}
                >
                  {keys.every((key) => key.exchange !== 1) && (
                    <MenuItem value={1}>Binance Futures</MenuItem>
                  )}
                  {keys.every((key) => key.exchange !== 2) && (
                    <MenuItem value={2}>Bybit Linear</MenuItem>
                  )}
                </Select>
                <FormHelperText>{exchangeError}</FormHelperText>
              </FormControl>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button
              variant="outlined"
              color="inherit"
              size="medium"
              onClick={() => {
                setOpenDialog(false);
                setTitleError("");
                setApikeyError("");
                setExchangeError("");
                setSecretkeyError("");
                titleRef.current.value = "";
                apikeyRef.current.value = "";
                exchangeRef.current.value = "";
                secretkeyRef.current.value = "";
              }}
            >
              Отмена
            </Button>
            <LoadingButton
              variant="contained"
              color="inherit"
              size="medium"
              loading={loading}
              onClick={handleSubmit}
            >
              Добавить
            </LoadingButton>
          </DialogActions>
        </Dialog>
        <SuccessSnackbar
          showSuccessSnackbar={showSuccessSnackbar}
          setShowSuccessSnackbar={setShowSuccessSnackbar}
        />
      </Box>
    </>
  );
}
