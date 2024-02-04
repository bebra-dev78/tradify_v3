"use client";

import Typography from "@mui/material/Typography";

import NProgress from "nprogress";
import Link from "next/link";

export function LinkToRegister() {
  return (
    <Link href="/register" onClick={() => NProgress.start()}>
      <Typography
        variant="subtitle2"
        sx={{
          color: "primary.main",
          "&:hover ": {
            textDecoration: "underline",
          },
        }}
      >
        Создайте аккаунт
      </Typography>
    </Link>
  );
}

export function LinkToRestore() {
  return (
    <Link href="/restore" onClick={() => NProgress.start()}>
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
    </Link>
  );
}
