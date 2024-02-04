"use client";

import useMediaQuery from "@mui/material/useMediaQuery";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import AppBar from "@mui/material/AppBar";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import NProgress from "nprogress";
import Link from "next/link";

import RootPrimaryHeaderAction from "#/client/Other/root-primary-header-action";
import RootPrimaryHeaderLinks from "#/client/Other/root-primary-header-links";
import { useMode } from "#/client/Global/theme-registry";
import Settings from "#/client/Other/settings";
import AppLogo from "#/client/Shared/app-logo";

const RootPrimaryHeaderMobileMenu = dynamic(() =>
  import("#/client/Other/root-primary-header-mobile-menu")
);

export default function RootPrimaryHeader() {
  const isSmallScreen = useMediaQuery("(max-width:900px)");
  const session = useSession();
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
        disableGutters
        sx={{
          paddingTop: "env(safe-area-inset-top)",
          transition:
            "height 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, background-color 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
          backdropFilter: scrolled ? "blur(6px)" : "none",
          height: scrolled ? "56px" : isSmallScreen ? "64px" : "70px",
          backgroundColor: scrolled
            ? mode === "dark"
              ? "rgba(22, 28, 36, 0.72)"
              : "rgba(249, 250, 251, 0.72)"
            : "transparent",
        }}
      >
        <Container
          sx={{ display: "flex", alignItems: "center", height: "100%" }}
        >
          <AppLogo />
          <Box sx={{ flexGrow: 1 }} />
          {!isSmallScreen ? (
            <>
              <Stack
                component="nav"
                sx={{
                  ml: "64px",
                  gap: "40px",
                  height: "100%",
                  flexDirection: "row",
                }}
              >
                <RootPrimaryHeaderLinks scrolled={scrolled} />
              </Stack>
              {!scrolled && (
                <Box
                  sx={{
                    mr: "8px",
                    display: "inline-flex",
                    "@media (min-width: 900px)": {
                      ml: "40px",
                      mr: "0px",
                    },
                  }}
                >
                  <Settings />
                </Box>
              )}
              <Box sx={{ flexGrow: 1 }} />
              {session.status === "authenticated" ? (
                <RootPrimaryHeaderAction
                  name={session.data.user.name}
                  email={session.data.user.email}
                />
              ) : (
                <Stack
                  sx={{
                    gap: "12px",
                    flexDirection: "row",
                    color: "text.primary",
                  }}
                >
                  <Link href="/login">
                    <Button
                      variant="outlined"
                      color="inherit"
                      size="medium"
                      disableElevation
                      onClick={() => {
                        NProgress.start();
                      }}
                    >
                      Войти
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button
                      variant="contained"
                      color="inherit"
                      size="medium"
                      disableElevation
                      onClick={() => {
                        NProgress.start();
                      }}
                    >
                      Создать аккаунт
                    </Button>
                  </Link>
                </Stack>
              )}
            </>
          ) : (
            <>
              <Box sx={{ mr: "8px", width: "40px", height: "40px" }}>
                <Settings />
              </Box>
              {session.status === "authenticated" ? (
                <RootPrimaryHeaderAction
                  name={session.data.user.name}
                  email={session.data.user.email}
                />
              ) : (
                <Link href="/register">
                  <Button
                    variant="contained"
                    color="inherit"
                    size="medium"
                    disableElevation
                    onClick={() => {
                      NProgress.start();
                    }}
                  >
                    Создать аккаунт
                  </Button>
                </Link>
              )}
              <RootPrimaryHeaderMobileMenu />
            </>
          )}
        </Container>
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
