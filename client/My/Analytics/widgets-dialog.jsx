"use client";

import InputAdornment from "@mui/material/InputAdornment";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Toolbar from "@mui/material/Toolbar";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import AppBar from "@mui/material/AppBar";
import Dialog from "@mui/material/Dialog";
import Slide from "@mui/material/Slide";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";

import { forwardRef, useState } from "react";

import { useMode } from "#/client/Global/theme-registry";
import Iconify from "#/utils/iconify";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function WidgetsDialog({ widgets, setWidgets }) {
  const { mode } = useMode();

  const [openDialog, setOpenDialog] = useState(false);

  return (
    <>
      <Fab
        variant="extended"
        size="medium"
        disabled={widgets.length >= 999}
        sx={{
          width: "95%",
          "@media (min-width: 600px)": {
            width: "50%",
          },
        }}
        onClick={() => {
          setOpenDialog(true);
        }}
      >
        <Iconify icon="solar:widget-add-bold" sx={{ mr: "10px" }} />
        Добавить виджеты ({widgets.length}/999)
      </Fab>
      <Dialog
        open={openDialog}
        fullScreen
        TransitionComponent={Transition}
        onClose={() => {
          setOpenDialog(false);
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
        <Container>
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
                variant="outlined"
                color="info"
                placeholder="Поиск виджетов..."
                autoComplete="off"
                onChange={(event) => {
                  console.log(event.target.value);
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify
                        icon="line-md:search"
                        sx={{ transform: "scaleX(-1)", color: "text.disabled" }}
                      />
                    </InputAdornment>
                  ),
                }}
              />
              <IconButton
                onClick={() => {
                  setOpenDialog(false);
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
            <Card
              sx={{
                display: "flex",
                flexDirection: "column",
                backgroundColor:
                  mode === "dark" ? "rgb(22, 28, 36)" : "rgb(255, 255, 255)",
              }}
            >
              <CardContent>
                <Typography paragraph variant="h5" component="div">
                  Распределение по монетам
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Распределение количества сделок по монетам. Сам по себе виджет
                  не несет большой пользы. Но если добавить в настройках,
                  например, “только прибыльные” и сравнить с “только убыточные”,
                  то можно найти полезные закономерности.
                </Typography>
              </CardContent>
              <Box sx={{ flexGrow: 1 }} />
              <Divider />
              <CardActions sx={{ m: "6px" }}>
                <Button
                  variant="contained"
                  color="inherit"
                  size="medium"
                  disabled={widgets.some((widget) => widget.id === 1)}
                  onClick={() => {
                    setOpenDialog(false);
                    setWidgets((prev) => {
                      const n = [...prev, { id: 1, x: 0, y: 0, w: 10, h: 12 }];
                      localStorage.setItem("widgets", JSON.stringify(n));
                      return n;
                    });
                  }}
                >
                  Добавить виджет
                </Button>
              </CardActions>
            </Card>
            <Card
              sx={{
                display: "flex",
                flexDirection: "column",
                backgroundColor:
                  mode === "dark" ? "rgb(22, 28, 36)" : "rgb(255, 255, 255)",
              }}
            >
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Распределение по LONG/SHORT
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Распределение сделок между лонг и шорт в процентном
                  соотношении. Сам по себе виджет не несет большой пользы. Но
                  если добавить в настройках например “только прибыльные” и
                  сравнить с “только убыточные” можно найти полезные
                  закономерности.
                </Typography>
              </CardContent>
              <Box sx={{ flexGrow: 1 }} />
              <Divider />
              <CardActions sx={{ m: "6px" }}>
                <Button
                  variant="contained"
                  color="inherit"
                  size="medium"
                  disabled={widgets.some((widget) => widget.id === 2)}
                  onClick={() => {
                    setOpenDialog(false);
                    setWidgets((prev) => {
                      const n = [...prev, { id: 2, x: 0, y: 0, w: 6, h: 12 }];
                      localStorage.setItem("widgets", JSON.stringify(n));
                      return n;
                    });
                  }}
                >
                  Добавить виджет
                </Button>
              </CardActions>
            </Card>
            <Card
              sx={{
                display: "flex",
                flexDirection: "column",
                backgroundColor:
                  mode === "dark" ? "rgb(22, 28, 36)" : "rgb(255, 255, 255)",
              }}
            >
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Счетчик сделок
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Сумма сделок за отрезок времени. Виджет доступен в виде
                  линейного графика или столбчатого.
                </Typography>
              </CardContent>
              <Box sx={{ flexGrow: 1 }} />
              <Divider />
              <CardActions sx={{ m: "6px" }}>
                <Button
                  variant="contained"
                  color="inherit"
                  size="medium"
                  disabled={widgets.some((widget) => widget.id === 3)}
                  onClick={() => {
                    setOpenDialog(false);
                    setWidgets((prev) => {
                      const n = [...prev, { id: 3, x: 0, y: 0, w: 10, h: 12 }];
                      localStorage.setItem("widgets", JSON.stringify(n));
                      return n;
                    });
                  }}
                >
                  Добавить виджет
                </Button>
              </CardActions>
            </Card>
            <Card
              sx={{
                display: "flex",
                flexDirection: "column",
                backgroundColor:
                  mode === "dark" ? "rgb(22, 28, 36)" : "rgb(255, 255, 255)",
              }}
            >
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Кумулятивная Комиссия ($)
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Сумма комиссий за весь предыдущий период включая текущую дату.
                  Виджет доступен в виде линейного графика или столбчатого.
                </Typography>
              </CardContent>
              <Box sx={{ flexGrow: 1 }} />
              <Divider />
              <CardActions sx={{ m: "6px" }}>
                <Button
                  variant="contained"
                  color="inherit"
                  size="medium"
                  disabled={widgets.some((widget) => widget.id === 4)}
                  onClick={() => {
                    setOpenDialog(false);
                    setWidgets((prev) => {
                      const n = [...prev, { id: 4, x: 0, y: 0, w: 10, h: 12 }];
                      localStorage.setItem("widgets", JSON.stringify(n));
                      return n;
                    });
                  }}
                >
                  Добавить виджет
                </Button>
              </CardActions>
            </Card>
            <Card
              sx={{
                display: "flex",
                flexDirection: "column",
                backgroundColor:
                  mode === "dark" ? "rgb(22, 28, 36)" : "rgb(255, 255, 255)",
              }}
            >
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Объём по монете ($)
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Примерный денежный объем в сделке. Считается как произведение
                  суммы контрактов на среднюю цену входа.
                </Typography>
              </CardContent>
              <Box sx={{ flexGrow: 1 }} />
              <Divider />
              <CardActions sx={{ m: "6px" }}>
                <Button
                  variant="contained"
                  color="inherit"
                  size="medium"
                  disabled={widgets.some((widget) => widget.id === 5)}
                  onClick={() => {
                    setOpenDialog(false);
                    setWidgets((prev) => {
                      const n = [...prev, { id: 5, x: 0, y: 0, w: 10, h: 12 }];
                      localStorage.setItem("widgets", JSON.stringify(n));
                      return n;
                    });
                  }}
                >
                  Добавить виджет
                </Button>
              </CardActions>
            </Card>
          </Box>
        </Container>
      </Dialog>
    </>
  );
}
