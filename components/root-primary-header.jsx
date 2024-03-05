"use client";

import ListItemButton from "@mui/material/ListItemButton";
import useMediaQuery from "@mui/material/useMediaQuery";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import Divider from "@mui/material/Divider";
import Popover from "@mui/material/Popover";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import AppBar from "@mui/material/AppBar";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";

import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import NProgress from "nprogress";
import Link from "next/link";

import HeaderPopoverMenu from "#/components/other/header-popover-menu";
import { useMode } from "#/components/global/theme-registry";
import Settings from "#/components/settings";
import AppLogo from "#/components/app-logo";
import Iconify from "#/utils/iconify";

const RootPrimaryHeaderMobileMenu = dynamic(() =>
  import("#/components/other/root-primary-header-mobile-menu")
);

function HeaderAction({ name, email }) {
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    function handleOutsideClick(event) {
      if (anchorEl && !anchorEl.contains(event.target)) {
        setAnchorEl(null);
      }
    }

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [anchorEl]);

  const open = Boolean(anchorEl);

  return (
    <Stack
      onClick={(e) => {
        setAnchorEl(e.currentTarget);
      }}
      sx={{
        gap: "12px",
        cursor: "pointer",
        flexDirection: "row",
      }}
    >
      <IconButton
        sx={{
          width: "40px",
          height: "40px",
        }}
      >
        <Avatar>{name.charAt(0).toUpperCase()}</Avatar>
      </IconButton>
      <Stack
        sx={{
          gap: "4px",
          alignItems: "center",
          flexDirection: "row",
          color: "text.primary",
        }}
      >
        <Typography variant="subtitle1">{name}</Typography>
        <Iconify
          icon={`solar:alt-arrow-${open ? "up" : "down"}-bold-duotone`}
        />
        <Stack />
      </Stack>
      <Popover
        open={open}
        anchorEl={anchorEl}
        disableScrollLock
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        onClose={() => {
          setAnchorEl(null);
        }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              padding: 0,
              width: "200px",
            },
          },
        }}
      >
        <HeaderPopoverMenu
          email={email}
          username={name}
          setAnchorEl={setAnchorEl}
        />
      </Popover>
    </Stack>
  );
}

function HeaderLinks({ scrolled }) {
  const pathname = usePathname();
  const { mode } = useMode();

  const root = pathname === "/";
  const faq = pathname === "/faq";

  return scrolled ? (
    <>
      <Link href="/">
        <ListItemButton
          disableRipple
          onClick={() => !root && NProgress.start()}
          sx={{
            p: "0px",
            transition: "opacity 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
            fontWeight: 600,
            fontSize: "0.875rem",
            color: "text.primary",
            height: "100%",
            "&::after": {
              display: "block",
              position: "absolute",
              height: "4px",
              left: "0px",
              right: "0px",
              bottom: "0px",
              borderRadius: "3px 3px 0px 0px",
              content: '""',
              backgroundColor: root ? "primary.main" : "transparent",
            },
            "&:hover": {
              color:
                mode === "dark"
                  ? "rgba(255, 255, 255, 0.7)"
                  : "rgba(33, 43, 54, 0.7)",
              backgroundColor: "transparent",
              "&::after": {
                display: "block",
                position: "absolute",
                height: "4px",
                left: "0px",
                right: "0px",
                bottom: "0px",
                borderRadius: "3px 3px 0px 0px",
                content: '""',
                backgroundColor: root
                  ? "rgba(0, 167, 111, 0.7)"
                  : mode === "dark"
                  ? "rgba(255, 255, 255, 0.7)"
                  : "rgba(33, 43, 54, 0.7)",
              },
            },
          }}
        >
          Главная
        </ListItemButton>
      </Link>
      <Link href="/faq">
        <ListItemButton
          disableRipple
          onClick={() => !faq && NProgress.start()}
          sx={{
            p: "0px",
            transition: "opacity 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
            fontWeight: 600,
            fontSize: "0.875rem",
            color: "text.primary",
            height: "100%",
            "&::after": {
              display: "block",
              position: "absolute",
              height: "4px",
              left: "0px",
              right: "0px",
              bottom: "0px",
              borderRadius: "3px 3px 0px 0px",
              content: '""',
              backgroundColor: faq ? "primary.main" : "transparent",
            },
            "&:hover": {
              color:
                mode === "dark"
                  ? "rgba(255, 255, 255, 0.7)"
                  : "rgba(33, 43, 54, 0.7)",
              backgroundColor: "transparent",
              "&::before": {
                display: "block",
                position: "absolute",
                height: "4px",
                left: "0px",
                right: "0px",
                bottom: "0px",
                borderRadius: "3px 3px 0px 0px",
                content: '""',
                backgroundColor: faq
                  ? "rgba(0, 167, 111, 0.7)"
                  : mode === "dark"
                  ? "rgba(255, 255, 255, 0.7)"
                  : "rgba(33, 43, 54, 0.7)",
              },
            },
          }}
        >
          FAQ
        </ListItemButton>
      </Link>
    </>
  ) : (
    <>
      <Link href="/">
        <ListItemButton
          disableRipple
          onClick={() => !root && NProgress.start()}
          sx={{
            p: "0px",
            transition: "opacity 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
            fontWeight: 600,
            fontSize: "0.875rem",
            color: root ? "primary.main" : "text.primary",
            height: "100%",
            "&::before": {
              content: '""',
              borderRadius: "50%",
              position: "absolute",
              width: "6px",
              height: "6px",
              left: "-14px",
              opacity: 0.48,
              backgroundColor: root ? "primary.main" : "transparent",
            },
            "&:hover": {
              color: root
                ? "rgba(0, 167, 111, 0.7)"
                : mode === "dark"
                ? "rgba(255, 255, 255, 0.7)"
                : "rgba(33, 43, 54, 0.7)",
              backgroundColor: "transparent",
              "&::before": {
                content: '""',
                borderRadius: "50%",
                position: "absolute",
                width: "6px",
                height: "6px",
                left: "-14px",
                opacity: 0.48,
                backgroundColor: root
                  ? "rgba(0, 167, 111, 0.7)"
                  : mode === "dark"
                  ? "rgba(255, 255, 255, 0.7)"
                  : "rgba(33, 43, 54, 0.7)",
              },
            },
          }}
        >
          Главная
        </ListItemButton>
      </Link>
      <Link href="/faq">
        <ListItemButton
          disableRipple
          onClick={() => !faq && NProgress.start()}
          sx={{
            p: "0px",
            transition: "opacity 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
            fontWeight: 600,
            fontSize: "0.875rem",
            color: faq ? "primary.main" : "text.primary",
            height: "100%",
            "&::before": {
              content: '""',
              borderRadius: "50%",
              position: "absolute",
              width: "6px",
              height: "6px",
              left: "-14px",
              opacity: 0.48,
              backgroundColor: faq ? "primary.main" : "transparent",
            },
            "&:hover": {
              color: faq
                ? "rgba(0, 167, 111, 0.7)"
                : mode === "dark"
                ? "rgba(255, 255, 255, 0.7)"
                : "rgba(33, 43, 54, 0.7)",
              backgroundColor: "transparent",
              "&::before": {
                content: '""',
                borderRadius: "50%",
                position: "absolute",
                width: "6px",
                height: "6px",
                left: "-14px",
                opacity: 0.48,
                backgroundColor: faq
                  ? "rgba(0, 167, 111, 0.7)"
                  : mode === "dark"
                  ? "rgba(255, 255, 255, 0.7)"
                  : "rgba(33, 43, 54, 0.7)",
              },
            },
          }}
        >
          FAQ
        </ListItemButton>
      </Link>
    </>
  );
}

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
                <HeaderLinks scrolled={scrolled} />
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
                <HeaderAction
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
                <HeaderAction
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
