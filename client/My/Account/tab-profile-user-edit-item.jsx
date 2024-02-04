"use client";

import LoadingButton from "@mui/lab/LoadingButton";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";

import { useState, useRef } from "react";

import SuccessSnackbar from "#/client/Shared/snackbar-success";
import { updateUser } from "#/server/users";
import { useUser } from "#/app/my/layout";

export default function TabProfileUserEditItem() {
  const { user, setUser } = useUser();

  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);
  const [surnameError, setSurnameError] = useState("");
  const [nameError, setNameError] = useState("");
  const [loading, setLoading] = useState(false);

  const surnameRef = useRef(user.surname);
  const nameRef = useRef(user.name);

  function handleSubmit() {
    let nameMessage = "";
    let surnameMessage = "";

    const surname = surnameRef.current.value;
    const name = nameRef.current.value;

    switch (true) {
      case name.length < 4:
        nameMessage = "Не менее 4 символов";
        break;
      case name.length > 16:
        nameMessage = "Не более 10 символов";
        break;
      case /\s/.test(name):
        nameMessage = "Имя не должно содержать пробелы";
        break;
      case !/^[A-Za-zА-Яа-яЁё\d\s.,!?()-]+$/.test(name):
        nameMessage = "Некорректное имя";
        break;
      default:
        break;
    }

    switch (true) {
      case surname?.length > 16:
        surnameMessage = "Не более 16 символов";
        break;
      case /\s/.test(surname):
        surnameMessage = "Фамилия не должна содержать пробелы";
        break;
      default:
        break;
    }

    if (nameMessage || surnameMessage) {
      setNameError(nameMessage);
      setSurnameError(surnameMessage);
      return;
    }

    setLoading(true);

    updateUser(user.id, name, surname).then((r) => {
      setLoading(false);
      if (r === 200) {
        setUser((prev) => ({ ...prev, name, surname }));
        setShowSuccessSnackbar(true);
      }
    });
  }

  return (
    <>
      <Box
        sx={{
          display: "grid",
          gap: "24px 16px",
          "@media (min-width: 0px)": {
            gridTemplateColumns: "repeat(1, 1fr)",
          },
          "@media (min-width: 600px)": {
            gridTemplateColumns: "repeat(2, 1fr)",
          },
        }}
      >
        <TextField
          label="Имя"
          name="firstName"
          type="text"
          variant="outlined"
          inputRef={nameRef}
          defaultValue={user.name}
          onChange={() => {
            setNameError("");
          }}
          error={Boolean(nameError)}
          helperText={nameError}
        />
        <TextField
          label="Фамилия"
          name="lastName"
          type="text"
          variant="outlined"
          inputRef={surnameRef}
          defaultValue={user.surname}
          onChange={() => {
            setSurnameError("");
          }}
          error={Boolean(surnameError)}
          helperText={surnameError}
        />
        <TextField
          label="Эл. почта"
          name="email"
          type="text"
          variant="outlined"
          disabled
          defaultValue={user.email}
        />
      </Box>
      <Typography
        variant="caption"
        sx={{
          display: "block",
          m: "16px auto 0",
          color: "text.secondary",
        }}
      >
        При необходимости сменить почту, обратитесь в службу поддержки.
      </Typography>
      <Stack sx={{ mt: "24px", alignItems: "flex-end", gap: "24px" }}>
        <LoadingButton
          variant="contained"
          color="inherit"
          size="medium"
          onClick={handleSubmit}
          loading={loading}
        >
          Сохранить
        </LoadingButton>
      </Stack>
      <SuccessSnackbar
        showSuccessSnackbar={showSuccessSnackbar}
        setShowSuccessSnackbar={setShowSuccessSnackbar}
      />
    </>
  );
}
