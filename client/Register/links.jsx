"use client";

import Typography from "@mui/material/Typography";
import NProgress from "nprogress";
import Link from "next/link";

export function LinkToLogin() {
  return (
    <>
      <Link href="/login" onClick={() => NProgress.start()}>
        <Typography
          variant="subtitle2"
          sx={{
            color: "primary.main",
            "&:hover ": {
              textDecoration: "underline",
            },
          }}
        >
          Войти
        </Typography>
      </Link>
    </>
  );
}

export function LinkToPolicy() {
  return (
    <>
      <Link href="/privacy-policy" onClick={() => NProgress.start()}>
        <Typography
          variant="caption"
          sx={{
            color: "info.main",
            "&:hover ": {
              textDecoration: "underline",
            },
          }}
        >
          политикой конфиденциальности
        </Typography>
      </Link>
    </>
  );
}
