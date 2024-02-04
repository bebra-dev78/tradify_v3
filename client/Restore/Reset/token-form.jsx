"use client";

import InputAdornment from "@mui/material/InputAdornment";
import LoadingButton from "@mui/lab/LoadingButton";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";

import { signIn, useSession } from "next-auth/react";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import NProgress from "nprogress";
import axios from "axios";

import FailSnackbar from "#/client/Shared/snackbar-fail";
import Iconify from "#/utils/iconify";

export default function Form({ token, email }) {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    router.prefetch("/my/overview");
    if (status === "authenticated") {
      NProgress.start();
      router.push("/my/overview");
    }
  }, [status]);

  const [repeatPasswordError, setRepeatPasswordError] = useState("");
  const [showFailSnackbar, setShowFailSnackbar] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const repeatPasswordRef = useRef(null);
  const passwordRef = useRef(null);

  async function handleSubmit() {
    let passwordErrorMessage = "";
    let repeatPasswordErrorMessage = "";

    const repeatPassword = repeatPasswordRef.current.value;
    const password = passwordRef.current.value;

    switch (true) {
      case password.length < 8:
        passwordErrorMessage = "Не менее 8 символов";
        break;
      case password.length > 24:
        passwordErrorMessage = "Не более 24 символов";
        break;
      case /\s/.test(password):
        passwordErrorMessage = "Пароль не должен содержать пробелы";
        break;
      case !/^[A-Za-zА-Яа-яЁё\d\s.,!?()-]+$/.test(password):
        passwordErrorMessage = "Некорректный пароль";
        break;
      case password.trim() !== repeatPassword.trim():
        passwordErrorMessage = "Пароли не совпадают";
        repeatPasswordErrorMessage = "Пароли не совпадают";
        break;
      default:
        break;
    }

    if (passwordErrorMessage) {
      setPasswordError(passwordErrorMessage);
      setRepeatPasswordError(repeatPasswordErrorMessage);
      return;
    }

    setLoading(true);

    try {
      await axios.get("http://localhost:8000/sanctum/csrf-cookie", {
        withCredentials: true,
        withXSRFToken: true,
      });

      axios
        .post(
          "http://localhost:8000/reset-password",
          {
            token,
            email,
            password,
            password_confirmation: password,
          },
          { withCredentials: true, withXSRFToken: true }
        )
        .then((r) => {
          if (r?.data?.status === "Your password has been reset.") {
            NProgress.start();
            signIn("credentials", {
              email,
              password,
              redirect: false,
            });
          }
        });
    } catch (error) {
      setShowFailSnackbar(true);

      console.log("Какая-то хуета при смене пароля: ", error);
    }

    setLoading(false);
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        handleSubmit();
      }}
    >
      <Typography variant="h3" gutterBottom sx={{ color: "text.primary" }}>
        Смена пароля
      </Typography>
      <Typography variant="body1" paragraph sx={{ color: "text.secondary" }}>
        Введите новый пароль для аккаунта
      </Typography>
      <Stack sx={{ gap: "24px", mt: "40px" }}>
        <TextField
          label="Новый пароль"
          name="password"
          type={show ? "text" : "password"}
          autoComplete="new-password"
          inputRef={passwordRef}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end" sx={{ paddingRight: 1 }}>
                <IconButton
                  onClick={() => setShow((prev) => !prev)}
                  edge="end"
                  sx={{ color: "text.disabled" }}
                >
                  {show ? (
                    <Iconify icon="solar:eye-bold" />
                  ) : (
                    <Iconify icon="solar:eye-closed-bold-duotone" />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
          onChange={() => {
            setPasswordError("");
          }}
          error={Boolean(passwordError)}
          helperText={passwordError}
        />
        <TextField
          label="Повторите новый пароль"
          name="password"
          type={show ? "text" : "password"}
          inputRef={repeatPasswordRef}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end" sx={{ paddingRight: 1 }}>
                <IconButton
                  onClick={() => setShow((prev) => !prev)}
                  edge="end"
                  sx={{ color: "text.disabled" }}
                >
                  {show ? (
                    <Iconify icon="solar:eye-bold" />
                  ) : (
                    <Iconify icon="solar:eye-closed-bold-duotone" />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
          onChange={() => {
            setRepeatPasswordError("");
          }}
          error={Boolean(repeatPasswordError)}
          helperText={repeatPasswordError}
        />
        <LoadingButton
          variant="contained"
          color="inherit"
          size="large"
          fullWidth
          type="submit"
          loading={loading}
          sx={{
            marginTop: "20px",
          }}
        >
          Сменить пароль
        </LoadingButton>
      </Stack>
      <FailSnackbar
        showFailSnackbar={showFailSnackbar}
        setShowFailSnackbar={setShowFailSnackbar}
      />
    </form>
  );
}
