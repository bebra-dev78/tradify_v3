"use client";

import InputAdornment from "@mui/material/InputAdornment";
import LoadingButton from "@mui/lab/LoadingButton";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import NProgress from "nprogress";

import NProgressLink from "#/components/nprogress-link";
import ErrorIcon from "#/components/other/error-icon";
import Iconify from "#/utils/iconify";

export default function Form() {
  const router = useRouter();

  useEffect(() => {
    fetch("/api/bebra")
      .then((r) => {
        r.json();
      })
      .then((data) => {
        if (data) {
          NProgress.start();
          router.push("/my/overview");
        }
      });
  }, []);

  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState(false);
  const [show, setShow] = useState(false);

  const passwordRef = useRef(null);
  const emailRef = useRef(null);

  useEffect(() => {
    function handleKeyPress(event) {
      if (event.key === "Enter" || event.key === " ") {
        handleSubmit();
      }
    }

    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  function handleSubmit() {
    let emailErrorMessage = "";
    let passwordErrorMessage = "";

    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    switch (true) {
      case !email:
        emailErrorMessage = "Эл. почта не указана";
        break;
      case !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email):
        emailErrorMessage = "Некорректная эл. почта";
        break;
      default:
        break;
    }

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
      default:
        break;
    }

    if (emailErrorMessage || passwordErrorMessage) {
      setEmailError(emailErrorMessage);
      setPasswordError(passwordErrorMessage);
      return;
    }

    setLoading(true);
    setAction(false);

    signIn("credentials", {
      email,
      password,
      redirect: false,
    }).then((data) => {
      setLoading(false);
      if (data.status === 401) {
        setAction(true);
      } else {
        NProgress.start();
        router.push("/my/overview");
      }
    });
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        handleSubmit();
      }}
    >
      <Stack sx={{ gap: "24px" }}>
        {action && (
          <Alert severity="error" icon={<ErrorIcon />}>
            Неверные данные бля. Проверьте правильность введённых данных.
          </Alert>
        )}
        <TextField
          label="Эл. почта"
          name="email"
          type="email"
          variant="outlined"
          inputRef={emailRef}
          onChange={() => {
            setEmailError("");
          }}
          error={Boolean(emailError)}
          helperText={emailError}
        />
        <TextField
          label="Пароль"
          name="password"
          type={show ? "text" : "password"}
          variant="outlined"
          autoComplete="current-password"
          inputRef={passwordRef}
          onChange={() => {
            setPasswordError("");
          }}
          error={Boolean(passwordError)}
          helperText={passwordError}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end" sx={{ paddingRight: 1 }}>
                <IconButton
                  aria-label="Скрыть/Показать пароль"
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
        />
      </Stack>
      <Stack
        sx={{
          marginTop: "16px",
          marginBottom: "16px",
          alignItems: "flex-end",
        }}
      >
        <NProgressLink path="/restore">
          <Typography
            variant="body2"
            sx={{
              color: "info.main",
              "&:hover ": {
                textDecoration: "underline",
              },
            }}
          >
            Забыли пароль?
          </Typography>
        </NProgressLink>
      </Stack>
      <LoadingButton
        variant="contained"
        color="inherit"
        size="large"
        type="submit"
        fullWidth
        loading={loading}
      >
        Войти
      </LoadingButton>
    </form>
  );
}
