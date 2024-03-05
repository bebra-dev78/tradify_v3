"use client";

import useMediaQuery from "@mui/material/useMediaQuery";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Popover from "@mui/material/Popover";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

import HeaderPopoverMenu from "#/components/other/header-popover-menu";
import { useMode } from "#/components/global/theme-registry";
import { readNotifications } from "#/server/notifications";
import Settings from "#/components/settings";
import Iconify from "#/utils/iconify";

const MobileMenu = dynamic(() => import("#/layout/mobile-menu"));

function HeaderAction({ username, email }) {
  const { mode } = useMode();

  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton
        onClick={(e) => {
          setAnchorEl(e.currentTarget);
        }}
        sx={{
          width: "39.5px",
          height: "39.5px",
        }}
        style={{
          background: open
            ? "linear-gradient(135deg, rgb(91, 228, 155) 0%, rgb(0, 167, 111) 100%)"
            : "rgba(145, 158, 171, 0.08)",
        }}
      >
        <Avatar
          sx={{
            width: "36px",
            height: "36px",
            "&:hover": {
              borderRadius: "16px",
            },
          }}
        >
          {username?.charAt(0).toUpperCase()}
        </Avatar>
      </IconButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        disableScrollLock
        anchorOrigin={{
          vertical: "bottom",
        }}
        onClose={() => {
          setAnchorEl(null);
        }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              width: "200px",
              padding: "0px",
              marginLeft: "-20px",
              boxShadow:
                mode === "dark"
                  ? "rgba(0, 0, 0, 0.24) 0px 0px 2px 0px, rgba(0, 0, 0, 0.24) -20px 20px 40px -4px"
                  : "rgba(145, 158, 171, 0.24) 0px 0px 2px 0px, rgba(145, 158, 171, 0.24) -20px 20px 40px -4px",
            },
          },
        }}
      >
        <HeaderPopoverMenu
          email={email}
          username={username}
          setAnchorEl={setAnchorEl}
        />
      </Popover>
    </>
  );
}

function Notifications({ id, unread }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [check, setCheck] = useState(false);

  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton
        onClick={(e) => {
          setAnchorEl(e.currentTarget);
          readNotifications(id);
          setCheck(true);
        }}
        sx={{ color: open ? "info.main" : "text.secondary" }}
      >
        <Badge badgeContent={check ? 0 : unread} color="error">
          <Iconify icon="solar:bell-bing-bold-duotone" />
        </Badge>
      </IconButton>
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
        onClose={() => setAnchorEl(null)}
        slotProps={{
          paper: {
            sx: {
              width: "360px",
              "@media (max-width: 600px)": {
                maxWidth: "300px",
              },
            },
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", p: "16px 20px" }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{ color: "text.primary" }}
            >
              Уведомления
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              У вас нет непрочитанных сообщений
            </Typography>
          </Box>
        </Box>
      </Popover>
    </>
  );
}

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
