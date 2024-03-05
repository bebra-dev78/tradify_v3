"use client";

import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import CardContent from "@mui/material/CardContent";
import DialogTitle from "@mui/material/DialogTitle";
import LoadingButton from "@mui/lab/LoadingButton";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import Radio from "@mui/material/Radio";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

import { useState, useRef, useEffect } from "react";
import useSWRImmutable from "swr/immutable";
import { useSWRConfig } from "swr";
import NProgress from "nprogress";
import Script from "next/script";
import Image from "next/image";
import Link from "next/link";
import crypto from "crypto";
import axios from "axios";

import { createBynanceTrades, createBybitTrades } from "#/server/trades";
import { updateTitle, deleteKey, createKey } from "#/server/keys";
import SuccessSnackbar from "#/components/snackbar-success";
import { useKeys, useUser } from "#/app/my/layout";
import Iconify from "#/utils/iconify";

const EXCHANGES = {
  1: "Binance Futures",
  2: "Bybit Linear",
};

const exchanges_cards = [
  {
    id: 1,
    title: "Binance Futures",
  },
  { id: 2, title: "Bybit Linear" },
];

function AddKeyPanel({ setLoadingTrades }) {
  const { keys, setKeys } = useKeys();
  const { mutate } = useSWRConfig();
  const { user } = useUser();

  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);
  const [secretkeyError, setSecretkeyError] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [apikeyError, setApikeyError] = useState("");
  const [titleError, setTitleError] = useState("");
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState("");

  const secretkeyRef = useRef("");
  const apikeyRef = useRef("");
  const titleRef = useRef("");

  useEffect(() => {
    setTitleError("");
    setApikeyError("");
    setSecretkeyError("");
    titleRef.current = "";
    apikeyRef.current = "";
    secretkeyRef.current = "";
  }, [value]);

  function handleSubmit() {
    let secretkeyMessage = "";
    let apikeyMessage = "";
    let titleMessage = "";

    const secretkey = secretkeyRef.current;
    const apikey = apikeyRef.current;
    const title = titleRef.current;

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
      case !/^[A-Za-zА-Яа-яЁё\d\s.,!?()-]+$/.test(title):
        titleMessage = "Некорректное название";
        break;
      default:
        break;
    }

    if (apikeyMessage || secretkeyMessage || titleMessage) {
      setSecretkeyError(secretkeyMessage);
      setApikeyError(apikeyMessage);
      setTitleError(titleMessage);
      return;
    }

    setLoading(true);

    const now = Date.now();

    switch (value) {
      case "Binance Futures":
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

                createKey(user.id, apikey, secretkey, title, 1).then((k) => {
                  setLoading(false);

                  if (k === null) {
                    setApikeyError("Такой ключ уже существует");
                    return;
                  }

                  setOpenDialog(false);
                  setShowSuccessSnackbar(true);
                  setKeys((prev) => [...prev, k]);
                  setLoadingTrades({ id: k.id, status: true });
                  setSecretkeyError("");
                  setApikeyError("");
                  setTitleError("");
                  secretkeyRef.current = "";
                  apikeyRef.current = "";
                  titleRef.current = "";

                  createBynanceTrades(
                    user.id,
                    k.id,
                    apikey,
                    Array.from(symbols),
                    secretkey,
                    now - 2592000000
                  ).then((b) => {
                    console.log("createBynanceTrades: ", b);
                    setLoadingTrades({ id: null, status: false });
                    mutate("null");
                  });
                });
              })
              .catch((e) => {
                setLoading(false);
                setApikeyError("Неверный ключ");
                setSecretkeyError("Неверный ключ");
                console.log("хуйня от binance: ", e);
              });
          });
        break;

      case "Bybit Linear":
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
                createKey(user.id, apikey, secretkey, title, 2).then((k) => {
                  setLoading(false);

                  if (k === null) {
                    setApikeyError("Такой ключ уже существует");
                    return;
                  }

                  setOpenDialog(false);
                  setShowSuccessSnackbar(true);
                  setKeys((prev) => [...prev, k]);
                  setLoadingTrades({ id: k.id, status: true });
                  setSecretkeyError("");
                  setApikeyError("");
                  setTitleError("");
                  secretkeyRef.current = "";
                  apikeyRef.current = "";
                  titleRef.current = "";

                  createBybitTrades(user.id, k.id, apikey, secretkey, now).then(
                    (b) => {
                      console.log("createBybitTrades: ", b);
                      setLoadingTrades({ id: null, status: false });
                      mutate("null");
                    }
                  );
                });
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
      <Button
        variant="contained"
        color="inherit"
        size="medium"
        disabled={keys.length > 1}
        startIcon={<Iconify icon="line-md:plus" width={20} />}
        onClick={() => {
          setOpenDialog(true);
        }}
        sx={{ position: "absolute", top: "24px", right: "24px" }}
      >
        Новый ключ
      </Button>
      <Dialog
        open={openDialog}
        fullWidth
        scroll="paper"
        PaperProps={{
          sx: {
            padding: 0,
          },
        }}
      >
        <DialogTitle sx={{ p: "24px 24px 16px" }}>
          Добавить API-ключ
        </DialogTitle>
        <DialogContent sx={{ pr: 3, pl: 3, mt: 1 }}>
          <Grid container spacing={2} direction="column">
            {exchanges_cards.map((card) => (
              <ExchangeCard
                id={card.id}
                key={card.id}
                value={value}
                title={card.title}
                setValue={setValue}
                titleRef={titleRef}
                apikeyRef={apikeyRef}
                titleError={titleError}
                apikeyError={apikeyError}
                secretkeyRef={secretkeyRef}
                setTitleError={setTitleError}
                secretkeyError={secretkeyError}
                setApikeyError={setApikeyError}
                setSecretkeyError={setSecretkeyError}
              />
            ))}
          </Grid>
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
              setSecretkeyError("");
              titleRef.current = "";
              apikeyRef.current = "";
              secretkeyRef.current = "";
              setValue("");
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
            disabled={value === ""}
          >
            Добавить
          </LoadingButton>
        </DialogActions>
      </Dialog>
      <SuccessSnackbar
        showSuccessSnackbar={showSuccessSnackbar}
        setShowSuccessSnackbar={setShowSuccessSnackbar}
      />
    </>
  );
}

function ExchangeCard({
  id,
  title,
  value,
  setValue,
  titleRef,
  apikeyRef,
  titleError,
  apikeyError,
  secretkeyRef,
  setTitleError,
  setApikeyError,
  secretkeyError,
  setSecretkeyError,
}) {
  const { keys } = useKeys();

  const checked = title === value;

  return (
    keys.every((key) => key.exchange !== id) && (
      <Grid item>
        <Card
          sx={{
            cursor: "pointer",
            border: "1px solid rgba(145, 158, 171, 0.16)",
          }}
          onClick={() => {
            setValue(title);
          }}
        >
          <CardContent sx={{ p: "24px" }}>
            <Grid container>
              <Grid item xs="auto">
                <Radio
                  size="small"
                  checked={checked}
                  value={title}
                  onChange={(e) => {
                    setValue(e.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={true}>
                <div
                  style={{
                    right: 0,
                    width: "64px",
                    height: "64px",
                    position: "absolute",
                  }}
                >
                  <Box component="span">
                    <Image
                      src="/images/tiktok.png"
                      width={48}
                      height={48}
                      style={{
                        borderRadius: "12px",
                      }}
                    />
                  </Box>
                </div>
                <Typography
                  component="div"
                  variant="overline"
                  sx={{ mt: "10px" }}
                >
                  {title}
                </Typography>
                {checked && (
                  <Stack sx={{ gap: 2, pt: 2, mt: 4, maxWidth: 360 }}>
                    <TextField
                      label="API-ключ"
                      name="api"
                      type="text"
                      size="small"
                      variant="outlined"
                      color="warning"
                      fullWidth
                      autoFocus
                      onChange={(e) => {
                        apikeyRef.current = e.target.value;
                        setApikeyError("");
                      }}
                      FormHelperTextProps={{ sx: { m: "8px 14px 0px" } }}
                      error={Boolean(apikeyError)}
                      helperText={
                        apikeyError ||
                        "Ключ должен быть доступен с любого IP-адреса."
                      }
                    />
                    <TextField
                      label="Cекретный ключ"
                      name="secret"
                      type="text"
                      size="small"
                      variant="outlined"
                      color="info"
                      fullWidth
                      onChange={(e) => {
                        secretkeyRef.current = e.target.value;
                        setSecretkeyError("");
                      }}
                      error={Boolean(secretkeyError)}
                      helperText={secretkeyError}
                    />
                    <TextField
                      label="Название ключа"
                      name="title"
                      type="text"
                      size="small"
                      variant="outlined"
                      color="secondary"
                      fullWidth
                      onChange={(e) => {
                        titleRef.current = e.target.value;
                        setTitleError("");
                      }}
                      error={Boolean(titleError)}
                      helperText={titleError}
                    />
                  </Stack>
                )}
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    )
  );
}

function KeysContainer({ loadingTrades }) {
  const { keys } = useKeys();

  return keys.length > 0 ? (
    <Box
      sx={{
        mt: 5,
        gap: 3,
        display: "grid",
        "@media (min-width: 0px)": {
          gridTemplateColumns: "repeat(1, 1fr)",
        },
        "@media (min-width: 600px)": {
          gridTemplateColumns: "repeat(2, 1fr)",
        },
        "@media (min-width: 900px)": {
          gridTemplateColumns: "repeat(3, 1fr)",
        },
      }}
    >
      {keys.map((apikey, i) => (
        <KeyCard
          i={i}
          key={apikey.id}
          apikey={apikey}
          loadingTrades={loadingTrades}
        />
      ))}
    </Box>
  ) : (
    <Box sx={{ display: "flex", justifyContent: "center", mt: "100px" }}>
      <Script src="https://unpkg.com/@lottiefiles/lottie-player@2.0.3/dist/tgs-player.js" />
      <tgs-player
        autoplay
        loop
        mode="normal"
        src="/video/duck_not_found.tgs"
        style={{ height: "250px", width: "250px" }}
      />
    </Box>
  );
}

function KeyCard({ apikey, i, loadingTrades }) {
  const { mutate } = useSWRConfig();
  const { setKeys } = useKeys();

  const { data } = useSWRImmutable("null");

  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [editedTitleError, setEditedTitleError] = useState("");
  const [editMode, setEditMode] = useState(false);

  const editedTitleRef = useRef("");
  const editIndexRef = useRef(i);

  function handleSaveTitle(newTitle) {
    let editedTitleMessage = "";

    switch (true) {
      case newTitle.length < 3:
        editedTitleMessage = "Не менее 3 символов";
        break;
      case newTitle.length > 18:
        editedTitleMessage = "Не более 18 символов";
        break;
      case !/^[A-Za-zА-Яа-яЁё\d\s.,!?()-]+$/.test(newTitle):
        editedTitleMessage = "Некорректное название";
        break;
      default:
        break;
    }

    if (editedTitleMessage) {
      setEditedTitleError(editedTitleMessage);
      return;
    }

    setShowSuccessSnackbar(true);
    setEditMode(false);
    editedTitleRef.current = "";
    setKeys((prev) =>
      prev.map((key) =>
        key.id === apikey.id ? { ...key, title: newTitle } : key
      )
    );
    editIndexRef.current = null;
    updateTitle(apikey.id, newTitle);
  }

  return (
    <>
      <Card
        sx={{
          p: 1,
          position: "relative",
          transition: "height 0.3s ease-in-out",
          height: editMode ? "auto" : "260px",
        }}
      >
        <Stack
          sx={{
            mt: 3,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              ml: 3,
            }}
          >
            <Image
              src="/images/tiktok.png"
              width={48}
              height={48}
              style={{ borderRadius: "12px" }}
            />
          </Box>
          <Box sx={{ mt: -3 }}>
            <IconButton
              onClick={() => {
                setEditMode((prev) => !prev);
                editedTitleRef.current = apikey.title;
              }}
              sx={{
                top: 1,
                right: 1,
                color: "text.secondary",
              }}
            >
              <Iconify icon="solar:pen-bold" width={20} />
            </IconButton>
            <IconButton
              onClick={() => {
                setDeleteConfirmation(true);
              }}
              sx={{
                top: 1,
                right: 1,
                color: "error.main",
              }}
            >
              <Iconify icon="solar:trash-bin-trash-bold" width={20} />
            </IconButton>
          </Box>
        </Stack>
        <Stack sx={{ p: "20px 24px 16px" }}>
          <Box sx={{ mb: 1 }}>
            {editMode === false ? (
              <Typography variant="body1" sx={{ color: "text.primary" }}>
                {apikey.title}
              </Typography>
            ) : (
              <>
                <TextField
                  variant="standard"
                  size="small"
                  defaultValue={apikey.title}
                  onChange={(e) => {
                    editedTitleRef.current = e.target.value;
                    setEditedTitleError("");
                  }}
                  error={Boolean(editedTitleError)}
                  helperText={editedTitleError}
                />
                <IconButton
                  onClick={() => {
                    handleSaveTitle(editedTitleRef.current);
                  }}
                >
                  <Iconify icon="solar:sd-card-bold-duotone" width={20} />
                </IconButton>
              </>
            )}
            <Typography
              variant="overline"
              component="div"
              sx={{ color: "text.disabled", mt: 1 }}
            >
              {EXCHANGES[apikey.exchange]}
            </Typography>
          </Box>
        </Stack>
        <Divider
          sx={{
            borderWidth: "0px 0px thin",
            borderStyle: "dashed",
            borderColor: "rgba(145, 158, 171, 0.2)",
          }}
        />
        <Box
          sx={{
            p: 3,
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
          }}
        >
          {loadingTrades.status === true && loadingTrades.id === apikey.id ? (
            <Stack
              sx={{
                gap: "4px",
                fontWeight: 400,
                lineHeight: 1.5,
                cursor: "default",
                fontSize: "0.75rem",
                flexDirection: "row",
                alignItems: "center",
                color: "warning.main",
              }}
            >
              <Iconify
                icon="line-md:downloading-loop"
                sx={{ mr: "3px", mt: "3px" }}
              />
              Загрузка сделок...
            </Stack>
          ) : (
            <Stack
              sx={{
                gap: "4px",
                fontWeight: 400,
                lineHeight: 1.5,
                cursor: "default",
                fontSize: "0.75rem",
                flexDirection: "row",
                alignItems: "center",
                color: "primary.main",
              }}
            >
              <Iconify
                icon="solar:playback-speed-bold-duotone"
                sx={{ mr: "3px", mt: "2px" }}
              />
              Подключено
            </Stack>
          )}
        </Box>
      </Card>
      <Dialog
        open={deleteConfirmation}
        onClose={() => {
          setDeleteConfirmation(false);
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
            Вы уверены, что хотите удалить этот ключ?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            variant="contained"
            color="error"
            size="medium"
            autoFocus
            onClick={() => {
              setDeleteConfirmation(false);
              setKeys((prev) => prev.filter((k) => k.id !== apikey.id));
              setShowSuccessSnackbar(true);
              deleteKey(apikey.id).then(() => {
                mutate(
                  "null",
                  data.filter((i) => i.kid !== apikey.id)
                );
              });
            }}
          >
            Удалить
          </Button>
          <Button
            variant="outlined"
            color="inherit"
            size="medium"
            onClick={() => {
              setDeleteConfirmation(false);
            }}
          >
            Отмена
          </Button>
        </DialogActions>
      </Dialog>
      <SuccessSnackbar
        showSuccessSnackbar={showSuccessSnackbar}
        setShowSuccessSnackbar={setShowSuccessSnackbar}
      />
    </>
  );
}

export default function TabKeys({ loadingTrades, setLoadingTrades }) {
  const { user } = useUser();

  if (user.activate) {
    return (
      <>
        <Grid container spacing={5} sx={{ flexFlow: "wrap" }}>
          <Grid item xs={12} md={8}>
            <Stack sx={{ gap: 3 }}>
              <Card
                sx={{
                  p: 3,
                }}
              >
                <Typography
                  variant="overline"
                  component="span"
                  sx={{
                    color: "text.secondary",
                    mb: 3,
                  }}
                >
                  Добавить API-ключ
                </Typography>
                <AddKeyPanel setLoadingTrades={setLoadingTrades} />
              </Card>
            </Stack>
          </Grid>
        </Grid>
        <KeysContainer loadingTrades={loadingTrades} />
      </>
    );
  } else {
    return (
      <>
        <Container sx={{ textAlign: "center" }}>
          <Typography variant="h3" color="text.primary" paragraph>
            Доступ запрещён
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Верифицируйте аккаунт, чтобы получить возможность добавлять
            API-ключи.{" "}
            <Link href="/my/faq" onClick={() => NProgress.start()}>
              <Typography
                variant="body1"
                component="span"
                sx={{
                  color: "info.main",
                  "&:hover ": {
                    textDecoration: "underline",
                  },
                }}
              >
                Как это сделать?
              </Typography>
            </Link>
          </Typography>
          <Box
            component="svg"
            viewBox="0 0 480 360"
            xmlns="http://www.w3.org/2000/svg"
            sx={{ width: "100%", height: "260px", mt: "50px" }}
          >
            <defs>
              <linearGradient
                id="BG"
                x1="19.496%"
                x2="77.479%"
                y1="71.822%"
                y2="16.69%"
              >
                <stop offset="0%" stop-color="#00A76F"></stop>
                <stop
                  offset="100%"
                  stop-color="#00A76F"
                  stop-opacity="0"
                ></stop>
              </linearGradient>
            </defs>
            <path
              fill="url(#BG)"
              fill-rule="nonzero"
              d="M0 198.78c0 41.458 14.945 79.236 39.539 107.786 28.214 32.765 69.128 53.365 114.734 53.434a148.44 148.44 0 0056.495-11.036c9.051-3.699 19.182-3.274 27.948 1.107a75.779 75.779 0 0033.957 8.01c5.023 0 9.942-.494 14.7-1.433 13.58-2.67 25.94-8.99 36.09-17.94 6.378-5.627 14.547-8.456 22.897-8.446h.142c27.589 0 53.215-8.732 74.492-23.696 19.021-13.36 34.554-31.696 44.904-53.224C474.92 234.58 480 213.388 480 190.958c0-76.93-59.774-139.305-133.498-139.305-7.516 0-14.88.663-22.063 1.899C305.418 21.42 271.355 0 232.499 0a103.651 103.651 0 00-45.88 10.661c-13.24 6.487-25.011 15.705-34.64 26.939-32.698.544-62.931 11.69-87.676 30.291C25.351 97.155 0 144.882 0 198.781z"
              opacity="0.2"
            ></path>
            <image
              href="/images/woman_4.png"
              height="300"
              x="220"
              y="30"
            ></image>
            <path
              fill="#00A76F"
              d="M425.545 119.2c0-5-4.6-9-9.6-8.2-2-3.7-6-6-10.2-5.9 4.3-21.4-30-21.4-25.7 0-8.7-.8-15.1 9.4-10.4 16.8 2.1 3.5 5.9 5.6 10 5.5h38.7v-.1c4.1-.4 7.2-3.9 7.2-8.1zm-321.3 81.8c.1-4.2-4.1-7.8-8.2-7-1.7-3.2-5.1-5.1-8.8-5 3.8-18.4-25.8-18.4-22 0-7.4-.7-12.9 8.1-8.9 14.4 1.8 3 5.1 4.8 8.6 4.7h33.2v-.1c3.4-.4 6.1-3.4 6.1-7z"
              opacity="0.08"
            ></path>
            <path
              fill="#FFAB00"
              d="M111.045 142.2c58.7-1 58.6-88.3 0-89.2-58.6 1-58.6 88.3 0 89.2z"
              opacity="0.12"
            ></path>
            <path
              fill="#FFD666"
              d="M111.045 121c30.8-.5 30.8-46.3 0-46.8-30.8.5-30.8 46.3 0 46.8z"
            ></path>
            <path
              fill="#FBCDBE"
              d="M278.045 250.1c-4.6-6.5-14 5.1-18.1 7.2-.6-2.1 1.5-41.3-1.4-41.8-2.8-3-8.1-.7-8 3.3.2-4 .5-11.3-5.6-10.2-4.8.6-3.8 6.9-3.8 10.2.1-6.1-9.5-6.1-9.4 0v5.6c.2-4.2-5.7-6.4-8.3-3-2.6-.2-.4 41.8-1.1 43.3-.2 10 8.7 19 18.8 18.7 6.1.4 12.6-1.2 16.8-5.9l19.7-21c1.7-1.6 1.8-4.5.4-6.4z"
            ></path>
            <path
              fill="#000"
              fill-opacity="0.24"
              fill-rule="evenodd"
              d="M248.745 212.3v32.8h1.9v-31.9c.1-2.9-2.8-5.2-5.6-4.6 2 0 3.7 1.7 3.7 3.7zm-9.4 5.6v27.2h1.9v-26.3c.1-2.8-2.8-5.2-5.5-4.6 1.9 0 3.6 1.8 3.6 3.7zm-9.4 27.2v-21.6c.1-2-1.7-3.7-3.7-3.8 2.8-.6 5.6 1.8 5.5 4.6V245h-1.8v.1z"
              clip-rule="evenodd"
            ></path>
            <path
              fill="#004B50"
              d="M244.945 189.8c-67.6 1.3-77 97-11 111.4 81 11.8 92.7-107.3 11-111.4zm-48.5 56.2c-1-40.4 49.8-63.8 79.9-36.9l-68.3 68.3c-7.5-8.7-11.6-19.9-11.6-31.4zm48.5 48.5c-11.5 0-22.7-4.1-31.4-11.6l68.3-68.3c27 30.1 3.5 80.9-36.9 79.9z"
            ></path>
            <path
              fill="url(#paint0_linear_1_129)"
              d="M169.245 261h-11.3v-66.6c0-4.5-1.5-5.6-5.6-5.6-5.3.3-13.8-1.4-17.1 4l-55 68.3c-2.7 3.3-1.8 8.8-2 12.8 0 4.1 1.5 5.6 5.6 5.6h54.7v21.7c-.9 7.9 9.1 5.2 13.7 5.6 4.1 0 5.6-1.5 5.6-5.6v-21.7h11.4c4.4 0 5.6-1.5 5.6-5.6-.3-4.8 2-13.8-5.6-12.9zm-30.8 0h-36l36-44.4V261zm263.9 12.1c1.9 44.8-78.7 46-78 1.2h19.3c-.8 15.3 18.3 21.4 30.1 15.5 12.7-6 12.3-29.1-1-34-5.6-2.8-16.6-2-23.1-2.1v-15.1c6.3-.2 17.6.9 22.7-2.3 11.6-5.5 11.9-25.4.9-31.4-10.8-5.9-29 .1-28.2 14.5h-19.4c-.5-28.1 35.4-38.5 57-28.2 23.4 9 24.1 45.5-.2 54.6 12.3 3.9 20.1 14.6 19.9 27.3z"
            ></path>
            <defs>
              <linearGradient
                id="paint0_linear_1_129"
                x1="78.245"
                x2="78.245"
                y1="187.309"
                y2="307.306"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#5BE49B"></stop>
                <stop offset="1" stop-color="#007867"></stop>
              </linearGradient>
            </defs>
          </Box>
        </Container>
      </>
    );
  }
}
