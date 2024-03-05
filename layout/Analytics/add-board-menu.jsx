"use client";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

import { useState, useRef } from "react";

export default function AddBoardMenu({ boards, setBoards, setAnchorEl }) {
  const [titleError, setTitleError] = useState("");

  const titleRef = useRef(null);

  function handleSubmit() {
    let titleErrorMessage = "";

    const title = titleRef.current.value;

    switch (true) {
      case !/[a-zA-Zа-яА-Я]/.test(title):
        titleErrorMessage = "Название не указано";
        break;
      case title.length > 26:
        titleErrorMessage = "Слишком длинное название";
        break;
      case boards.some((b) => b === title):
        titleErrorMessage = "Доска с таким названием уже существует";
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
      const n = [...prev, title];
      localStorage.setItem("boards", JSON.stringify(n));
      return n;
    });
    titleRef.current.value = "";
  }

  return (
    <Stack sx={{ m: 2 }}>
      <TextField
        label="Название"
        autoFocus
        autoComplete="off"
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
  );
}
