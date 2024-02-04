"use client";

import Box from "@mui/material/Box";

import { useMode } from "#/client/Global/theme-registry";

export default function FooterBox({ children }) {
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
