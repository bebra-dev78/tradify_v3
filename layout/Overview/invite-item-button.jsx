"use client";

import Button from "@mui/material/Button";

import NProgress from "nprogress";

export default function InviteItemButton() {
  return (
    <Button
      variant="contained"
      color="warning"
      size="medium"
      onClick={() => {
        NProgress.start();
      }}
    >
      Перейти
    </Button>
  );
}
