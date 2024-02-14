"use client";

import InputAdornment from "@mui/material/InputAdornment";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Collapse from "@mui/material/Collapse";
import Toolbar from "@mui/material/Toolbar";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import AppBar from "@mui/material/AppBar";
import Dialog from "@mui/material/Dialog";
import Slide from "@mui/material/Slide";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";

import { forwardRef, useState, memo } from "react";

import { useMode } from "#/client/Global/theme-registry";
import Iconify from "#/utils/iconify";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const widgets_cards = [
  {
    id: 1,
    title: "Распределение по монетам",
    body: "Распределение количества сделок по монетам. Сам по себе виджет не несет большой пользы. Но если добавить в настройках, например, “только прибыльные” и сравнить с “только убыточные”, то можно найти полезные закономерности.",
  },
  {
    id: 2,
    title: "Распределение по LONG/SHORT",
    body: "Распределение сделок между лонг и шорт в процентном соотношении. Сам по себе виджет не несет большой пользы. Но если добавить в настройках например “только прибыльные” и сравнить с “только убыточные” можно найти полезные закономерности.",
  },
  {
    id: 3,
    title: "Счетчик сделок",
    body: "Сумма сделок за отрезок времени. Виджет доступен в виде линейного графика или столбчатого.",
  },
  {
    id: 4,
    title: "Кумулятивная комиссия",
    body: "Сумма комиссий за весь предыдущий период включая текущую дату. Виджет доступен в виде линейного графика или столбчатого.",
  },
  {
    id: 5,
    title: "Объём по монете",
    body: "Примерный денежный объем в сделке. Считается как произведение суммы контрактов на среднюю цену входа.",
  },
  {
    id: 6,
    title: "Прибыль",
    body: "Виджет показывает вашу чистую прибыль за минусом всех комиссий биржи. Данные сгруппированы по дням открытия сделки по умолчанию. Виджет доступен в виде линейного графика или столбчатого.",
  },
  {
    id: 7,
    title: "Кумулятивная прибыль",
    body: " Сумма прибыли за весь предыдущий период включая текущую дату. Этот виджет показывает рост или потерю депозита даже не зная ваш баланс. Отрицательные значения говорят об убыточности торговли. Виджет доступен в виде линейного графика или столбчатого.",
  },
];

export default memo(function WidgetsDialog({
  boards,
  widgets,
  setWidgets,
  currentBoardRef,
  widgetsParamsRef,
}) {
  const { mode } = useMode();

  const [openInfo, setOpenInfo] = useState(false);
  const [open, setOpen] = useState(false);

  const current = widgets.filter(
    (w) => w.owner_board === boards[currentBoardRef.current]
  );

  return (
    <>
      <Stack sx={{ justifyContent: "space-between", flexDirection: "row" }}>
        <Typography variant="h4">
          Аналитика
          <IconButton
            onClick={() => setOpenInfo((prev) => !prev)}
            sx={{ mb: "2px" }}
          >
            <Iconify
              icon="solar:info-circle-linear"
              color="text.disabled"
              width={20}
            />
          </IconButton>
        </Typography>
        <Button
          color="inherit"
          variant="contained"
          startIcon={<Iconify icon="solar:widget-add-bold" />}
          disabled={widgets.length >= 78}
          onClick={() => {
            setOpen(true);
          }}
          sx={{ maxHeight: "40px" }}
        >
          Добавить виджеты ({widgets.length}/999)
        </Button>
      </Stack>
      <Collapse in={openInfo} timeout="auto" unmountOnExit>
        <Typography sx={{ pt: "24px", maxWidth: 800, color: "text.secondary" }}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
          ipsam, dolores doloremque rem obcaecati voluptas vero officiis velit
          quae incidunt voluptatibus ea nisi quam architecto eius sint. Enim
          asperiores suscipit velit repudiandae consectetur tempore excepturi
          temporibus dolor possimus dolorem nulla sequi nisi molestiae adipisci
          vitae impedit voluptatum, quos, ut facere eos. Harum veniam minima,
          sint fugiat non cupiditate obcaecati sit.
        </Typography>
      </Collapse>
      <Dialog
        fullScreen
        open={open}
        TransitionComponent={Transition}
        onClose={() => {
          setOpen(false);
        }}
        PaperProps={{
          sx: {
            padding: 0,
            borderRadius: 0,
            boxShadow: "none",
            backdropFilter: "none",
            backgroundImage: "none",
            backgroundPosition: "unset",
            backgroundRepeat: "no-repeat",
          },
        }}
      >
        <Container sx={{ pb: 10 }}>
          <AppBar
            position="relative"
            color="transparent"
            sx={{
              padding: 0,
              m: "50px 0px",
              boxShadow: "none",
              borderRadius: "10px",
              backdropFilter: "none",
              backgroundImage: "none",
              backgroundPosition: "unset",
              paddingTop: "env(safe-area-inset-top)",
              transition: "height 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
            }}
          >
            <Toolbar sx={{ justifyContent: "space-between" }}>
              <TextField
                color="info"
                variant="outlined"
                autoComplete="off"
                placeholder="Поиск виджетов..."
                InputProps={{
                  startAdornment: (
                    <InputAdornment
                      position="start"
                      sx={{ color: "text.disabled" }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        role="img"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="currentColor"
                          d="m20.71 19.29l-3.4-3.39A7.92 7.92 0 0 0 19 11a8 8 0 1 0-8 8a7.92 7.92 0 0 0 4.9-1.69l3.39 3.4a1 1 0 0 0 1.42 0a1 1 0 0 0 0-1.42M5 11a6 6 0 1 1 6 6a6 6 0 0 1-6-6"
                        ></path>
                      </svg>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& input::placeholder": {
                    color: "text.secondary",
                  },
                }}
              />
              <IconButton
                onClick={() => {
                  setOpen(false);
                }}
              >
                <Iconify
                  icon="mingcute:close-fill"
                  sx={{ color: "text.primary" }}
                />
              </IconButton>
            </Toolbar>
          </AppBar>
          <Box
            sx={{
              gap: "24px",
              display: "grid",
              "@media (min-width: 600px)": {
                gridTemplateColumns: "repeat(1, 1fr)",
              },
              "@media (min-width: 900px)": {
                gridTemplateColumns: "repeat(2, 1fr)",
              },
              "@media (min-width: 1200px)": {
                gridTemplateColumns: "repeat(3, 1fr)",
              },
            }}
          >
            {widgets_cards.map((widget) => (
              <Card
                key={widget.id}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  backgroundColor:
                    mode === "dark" ? "rgb(22, 28, 36)" : "rgb(255, 255, 255)",
                }}
              >
                <CardContent>
                  <Typography paragraph variant="h5" component="div">
                    {widget.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {widget.body}
                  </Typography>
                </CardContent>
                <Box sx={{ flexGrow: 1 }} />
                <Divider />
                <CardActions sx={{ m: "6px" }}>
                  <Button
                    variant="contained"
                    color="inherit"
                    size="medium"
                    disabled={current.some((w) => w.id === widget.id)}
                    onClick={() => {
                      setOpen(false);
                      setWidgets((prev) => {
                        const n = [
                          ...prev,
                          {
                            id: widget.id,
                            owner_board: boards[currentBoardRef.current],
                          },
                        ];
                        const t = {
                          ...widgetsParamsRef.current,
                          [`${widget.id}-${boards[currentBoardRef.current]}`]: {
                            x: 0,
                            y: 0,
                            w: 10,
                            h: 12,
                          },
                        };
                        widgetsParamsRef.current = t;
                        localStorage.setItem("widgets", JSON.stringify(n));
                        localStorage.setItem(
                          "widgetsParams",
                          JSON.stringify(t)
                        );
                        return n;
                      });
                    }}
                  >
                    Добавить виджет
                  </Button>
                </CardActions>
              </Card>
            ))}
          </Box>
        </Container>
      </Dialog>
    </>
  );
});
