"use client";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import Typography from "@mui/material/Typography";

import NProgress from "nprogress";
import Link from "next/link";

export default function LinkToLogin() {
  return (
    <Link
      href="/login"
      onClick={() => NProgress.start()}
      style={{
        alignItems: "center",
        textDecoration: "none",
        flexDirection: "row",
        display: "flex",
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: "24px",
      }}
    >
      <ArrowBackIosNewRoundedIcon
        sx={{
          width: "12px",
          height: "12px",
          marginRight: "3px",
          color: "info.main",
        }}
      />
      <Typography
        variant="subtitle2"
        sx={{
          "&:hover ": {
            textDecoration: "underline",
          },
          color: "info.main",
        }}
      >
        Вернуться на страницу входа
      </Typography>
    </Link>
  );
}
