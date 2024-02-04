"use client";

import useMediaQuery from "@mui/material/useMediaQuery";

import Toolbar from "@mui/material/Toolbar";
import AppBar from "@mui/material/AppBar";
import Stack from "@mui/material/Stack";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

import Notifications from "#/client/Other/notifications";
import { useMode } from "#/client/Global/theme-registry";
import HeaderAction from "#/client/Other/header-action";
import Settings from "#/client/Other/settings";

const MobileMenu = dynamic(() => import("#/client/My/mobile-menu"));

export default function Header({
  id,
  keys,
  email,
  unread,
  stretch,
  username,
  setStretch,
  openSidebar,
}) {
  const isSmallScreen = useMediaQuery("(max-width:1199px)");
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
      position="fixed"
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
        width: isSmallScreen
          ? "100%"
          : `calc(100% - ${openSidebar ? 280 : 110}px)`,
        height: scrolled ? "60px" : isSmallScreen ? "64px" : "80px",
      }}
    >
      <Toolbar
        sx={{
          pl: "16px",
          pr: "16px",
          height: "100%",
          justifyContent: "flex-end",
          transition:
            "height 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, background-color 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
          backdropFilter: scrolled ? "blur(6px)" : "none",
          backgroundColor: scrolled
            ? mode === "dark"
              ? "rgba(22, 28, 36, 0.72)"
              : "rgba(249, 250, 251, 0.72)"
            : "transparent",
          "@media (min-width: 1200px)": {
            pl: "40px",
            pr: "40px",
          },
        }}
      >
        {isSmallScreen && <MobileMenu username={username} keys={keys} />}
        <Stack
          sx={{
            gap: "14px",
            flexGrow: 1,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "flex-end",
          }}
        >
          <Notifications id={id} unread={unread} />
          <Settings stretch={stretch} setStretch={setStretch} />
          <HeaderAction username={username} email={email} />
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
