"use client";

import Typography from "@mui/material/Typography";

import Toolbar from "@mui/material/Toolbar";
import Divider from "@mui/material/Divider";
import AppBar from "@mui/material/AppBar";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";

import { useEffect, useState } from "react";
import NProgress from "nprogress";
import Link from "next/link";

import { useMode } from "#/client/Global/theme-registry";
import Settings from "#/client/Other/settings";
import AppLogo from "#/client/Shared/app-logo";

export default function RootSecondaryHeader() {
  const { mode } = useMode();

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      if (window.scrollY > 25) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    }

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <AppBar
      color="transparent"
      sx={{
        padding: 0,
        boxShadow: "none",
        borderRadius: "10px",
        backdropFilter: "none",
        backgroundImage: "none",
        backgroundPosition: "unset",
        paddingTop: "env(safe-area-inset-top)",
        transition: "height 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
      }}
    >
      <Toolbar
        sx={{
          pl: "24px",
          pr: "24px",
          justifyContent: "space-between",
          transition: "box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
          backdropFilter: scrolled ? "blur(6px)" : "none",
          backgroundColor: scrolled
            ? mode === "dark"
              ? "rgba(22, 28, 36, 0.72)"
              : "rgba(249, 250, 251, 0.72)"
            : "transparent",
          "@media (min-width:900px)": {
            height: scrolled ? "52px" : "68px",
          },
        }}
      >
        <AppLogo />
        <Stack sx={{ flexDirection: "row", alignItems: "center" }}>
          <Box sx={{ mr: "4px" }}>
            <Settings />
          </Box>
          <Link href="/faq" onClick={() => NProgress.start()}>
            <Typography
              variant="subtitle2"
              sx={{
                color: "info.main",
                "&:hover ": {
                  textDecoration: "underline",
                },
              }}
            >
              Нужна помощь?
            </Typography>
          </Link>
        </Stack>
      </Toolbar>
      {scrolled && (
        <Divider
          sx={{
            borderStyle: "solid",
          }}
        />
      )}
    </AppBar>
  );
}
