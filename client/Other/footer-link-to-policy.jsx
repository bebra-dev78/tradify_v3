"use client";

import Typography from "@mui/material/Typography";

import { usePathname } from "next/navigation";
import NProgress from "nprogress";
import Link from "next/link";

export default function LinkToPolicy() {
  const pathname = usePathname();

  return (
    <Link
      href="/privacy-policy"
      onClick={() => pathname !== "/privacy-policy" && NProgress.start()}
    >
      <Typography
        variant="body2"
        sx={{
          "&:hover": { textDecoration: "underline" },
          color:
            pathname === "/privacy-policy" ? "primary.main" : "text.secondary",
        }}
      >
        Политика конфиденциальности
      </Typography>
    </Link>
  );
}
