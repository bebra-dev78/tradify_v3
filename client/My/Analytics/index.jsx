"use client";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Menu from "@mui/material/Menu";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";

import { useState, useEffect, useRef } from "react";

import WidgetsLayout from "#/client/My/Analytics/widgets-layout";
import WidgetsDialog from "#/client/My/Analytics/widgets-dialog";
import BoardsLayout from "#/client/My/Analytics/boards-layout";
import Iconify from "#/utils/iconify";

export default function Index() {
  const [titleError, setTitleError] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [widgets, setWidgets] = useState([]);
  const [boards, setBoards] = useState([]);

  const titleRef = useRef(null);

  useEffect(() => {
    setBoards(JSON.parse(localStorage.getItem("boards")) ?? []);
    setWidgets(JSON.parse(localStorage.getItem("widgets")) ?? []);
  }, []);

  function handleSubmit() {
    let titleErrorMessage = "";

    const title = titleRef.current.value;

    switch (true) {
      case !title:
        titleErrorMessage = "Название не указано";
        break;
      case title.length > 16:
        titleErrorMessage = "Слишком длинное название";
        break;
      default:
        break;
    }

    if (titleErrorMessage) {
      setTitleError(titleErrorMessage);
      return;
    }

    setAnchorEl(null);
    setBoards((prev) => {
      const n = [...prev, { title, board_id: boards.length + 1 }];
      localStorage.setItem("boards", JSON.stringify(n));
      return n;
    });
    titleRef.current.value = "";
  }

  return boards.length > 0 ? (
    <>
      <Stack
        sx={{
          "& > :not(style)": { m: 1 },
          width: "100%",
          mb: "50px",
          "@media (min-width: 600px)": {
            flexDirection: "row",
          },
        }}
      >
        <BoardsLayout boards={boards} setBoards={setBoards} />
        <WidgetsDialog widgets={widgets} setWidgets={setWidgets} />
      </Stack>
      <WidgetsLayout widgets={widgets} setWidgets={setWidgets} />
    </>
  ) : (
    <>
      <Box
        sx={{
          "& > :not(style)": { m: 1 },
          "@media (max-width: 600px)": {
            "& > :not(style)": { m: 0 },
          },
        }}
      >
        <Fab
          variant="extended"
          sx={{ width: "100%" }}
          onClick={(event) => {
            setAnchorEl(event.currentTarget);
          }}
        >
          <Iconify icon="ic:round-plus" sx={{ mr: 1 }} />
          Добавить доску
        </Fab>
      </Box>
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
          setTitleError("");
          titleRef.current.value = "";
        }}
        sx={{ mt: "30px" }}
      >
        <Stack sx={{ m: 2 }}>
          <TextField
            label="Название"
            name="firstName"
            type="text"
            variant="outlined"
            color="info"
            inputRef={titleRef}
            onChange={() => {
              setTitleError("");
            }}
            error={Boolean(titleError)}
            helperText={titleError}
          />
          <Stack
            sx={{
              mt: 2,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Button
              variant="outlined"
              color="inherit"
              size="medium"
              onClick={() => {
                setAnchorEl(null);
                setTitleError("");
                titleRef.current.value = "";
              }}
            >
              Отмена
            </Button>
            <Button
              variant="contained"
              color="inherit"
              size="medium"
              onClick={handleSubmit}
            >
              Добавить
            </Button>
          </Stack>
        </Stack>
      </Menu>
    </>
  );
}
