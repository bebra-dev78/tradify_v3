"use client";

import LoadingButton from "@mui/lab/LoadingButton";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import NProgress from "nprogress";
import Script from "next/script";
import Link from "next/link";
import axios from "axios";

import ErrorIcon from "#/client/Shared/error-icon";

export default function Form() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    router.prefetch("/my/overview");
    if (status === "authenticated") {
      NProgress.start();
      router.push("/my/overview");
    }
  }, [status]);

  const [showError, setShowError] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState(false);

  const emailRef = useRef(null);

  async function handleSubmit() {
    let emailErrorMessage = "";

    const email = emailRef.current.value;

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

    if (emailErrorMessage) {
      setEmailError(emailErrorMessage);
      return;
    }

    setLoading(true);
    setShowError(false);

    try {
      await axios.get("http://localhost:8000/sanctum/csrf-cookie", {
        withCredentials: true,
        withXSRFToken: true,
      });

      axios
        .post(
          "http://localhost:8000/forgot-password",
          {
            email,
          },
          { withCredentials: true, withXSRFToken: true }
        )
        .then((r) => {
          if (r?.data?.status === "We have emailed your password reset link.") {
            setAction(true);
          }
        });
    } catch (error) {
      setShowError(true);

      console.log("Какая-то хуета при сбросе пароля: ", error);
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
      <Stack sx={{ gap: "24px" }}>
        {action ? (
          <>
            <tgs-player
              autoplay
              loop
              mode="normal"
              src="/video/duck_send_message.tgs"
              style={{ height: "250px", width: "250px" }}
            />
            <Typography variant="h3" paragraph sx={{ color: "text.primary" }}>
              Запрос успешно отправлен!
            </Typography>
            <Typography
              variant="body1"
              paragraph
              sx={{
                color: "text.secondary",
              }}
            >
              Мы отправили письмо с подтверждением на <br />
              <Link href="https://mail.google.com/">
                <Typography
                  component="strong"
                  sx={{
                    "&:hover": { textDecoration: "underline" },
                    color: "info.main",
                  }}
                >
                  {emailRef.current.value}
                </Typography>
              </Link>
              <br />
              Пожалуйста, проверьте свою электронную почту.
            </Typography>
          </>
        ) : (
          <>
            <Box sx={{ ml: "auto", mr: "auto" }}>
              <tgs-player
                autoplay
                loop
                mode="normal"
                src="/video/duck_secret.tgs"
                style={{ height: "250px", width: "250px" }}
              />
            </Box>
            <Typography variant="h3" sx={{ color: "text.primary" }}>
              Забыли свой пароль?
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "text.secondary", m: "0px 0px 40px" }}
            >
              Пожалуйста, введите адрес электронной почты, связанный с вашим
              аккаунтом, и мы отправим вам ссылку для сброса пароля.
            </Typography>
            {showError && (
              <Alert severity="error" icon={<ErrorIcon />}>
                Произошла ошибка. Либо аккаунта с данной почтой не существует
                или он не активирован, либо недавно уже был создан запрос на
                восстановление аккаунта.
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
            <LoadingButton
              variant="contained"
              color="inherit"
              size="large"
              fullWidth
              type="submit"
              loading={loading}
            >
              Сбросить пароль
            </LoadingButton>
          </>
        )}
      </Stack>
      <Script src="https://unpkg.com/@lottiefiles/lottie-player@2.0.3/dist/tgs-player.js" />
    </form>
  );
}
