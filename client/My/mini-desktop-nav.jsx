"use client";

import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";

import MiniDesktopNavLinks from "#/client/Other/mini-desktop-nav-links";
import AppLogo from "#/client/Shared/app-logo";

export default function MiniDesktopNav({ setOpenSidebar }) {
  return (
    <>
      <IconButton
        onClick={() => {
          setOpenSidebar(true);
          localStorage.setItem("sidebar", JSON.stringify(true));
        }}
        sx={{
          p: "4px",
          top: "22px",
          left: "85px",
          zIndex: 1101,
          width: "26px",
          height: "26px",
          position: "fixed",
          fontSize: "1.125rem",
          backdropFilter: "blur(6px)",
          border: "1px dashed rgba(145, 158, 171, 0.24)",
        }}
      >
        <ArrowForwardIosRoundedIcon
          sx={{
            width: "16px",
            height: "12px",
            color: "rgb(145, 158, 171)",
          }}
        />
      </IconButton>
      <Stack
        sx={{
          pb: "16px",
          height: "100%",
          position: "fixed",
          overflow: "hidden",
          borderRight: "1px dashed rgba(145, 158, 171, 0.24)",
        }}
      >
        <Box
          sx={{
            m: "16px auto",
          }}
        >
          <AppLogo />
        </Box>
        <Stack
          sx={{
            pl: "6px",
            pr: "6px",
            gap: "4px",
            alignItems: "center",
          }}
        >
          <MiniDesktopNavLinks />
        </Stack>
      </Stack>
    </>
  );
}
