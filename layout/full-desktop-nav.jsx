"use client";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";

import NavPaper from "#/layout/nav-paper";

export default function FullDesktopNav({ setOpenSidebar, username, keys }) {
  return (
    <>
      <IconButton
        onClick={() => {
          setOpenSidebar(false);
          localStorage.setItem("sidebar", JSON.stringify(false));
        }}
        sx={{
          p: "4px",
          top: "32px",
          zIndex: 1101,
          left: "267px",
          width: "26px",
          height: "26px",
          position: "fixed",
          fontSize: "1.125rem",
          backdropFilter: "blur(6px)",
          border: "1px dashed rgba(145, 158, 171, 0.24)",
        }}
      >
        <ArrowBackIosNewRoundedIcon
          sx={{
            width: "16px",
            height: "12px",
            color: "text.secondary",
          }}
        />
      </IconButton>
      <Drawer
        open
        variant="permanent"
        PaperProps={{
          sx: {
            zIndex: 0,
            padding: 0,
            width: "280px",
            borderRadius: 0,
            boxShadow: "none",
            backdropFilter: "none",
            backgroundImage: "none",
            backgroundPosition: "unset",
            backgroundRepeat: "no-repeat",
            backgroundColor: "transparent",
            borderRight: "1px dashed rgba(145, 158, 171, 0.24)",
          },
        }}
      >
        <NavPaper username={username} keys={keys} />
      </Drawer>
    </>
  );
}
