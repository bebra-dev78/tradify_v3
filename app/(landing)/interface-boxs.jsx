"use client";

import Box from "@mui/material/Box";

import { useMode } from "#/components/global/theme-registry";

export function OverlayBox({ children }) {
  const { mode } = useMode();

  return (
    <Box
      sx={{
        height: "100vh",
        minHeight: "600px",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
        backgroundImage:
          mode === "dark"
            ? "linear-gradient(rgba(22, 28, 36, 0.94), rgba(22, 28, 36, 0.94)), url(/images/preview_overlay.jpg)"
            : "linear-gradient(rgba(249, 250, 251, 0.9), rgba(249, 250, 251, 0.9)), url(/images/preview_overlay.jpg)",
        "@media (min-width: 900px)": {
          left: 0,
          top: 0,
          width: "100%",
          position: "fixed",
        },
      }}
    >
      {children}
    </Box>
  );
}

export function MainBox({ children }) {
  const { mode } = useMode();

  return (
    <Box
      sx={{
        overflow: "hidden",
        position: "relative",
        backgroundColor:
          mode === "dark" ? "rgb(22, 28, 36)" : "rgb(249, 250, 251)",
      }}
    >
      {children}
    </Box>
  );
}

export function FooterBox({ children }) {
  const { mode } = useMode();

  return (
    <Box
      component="footer"
      sx={{
        paddingTop: "40px",
        paddingBottom: "40px",
        textAlign: "center",
        position: "relative",
        backgroundColor:
          mode === "dark" ? "rgb(22, 28, 36)" : "rgb(249, 250, 251)",
      }}
    >
      {children}
    </Box>
  );
}
