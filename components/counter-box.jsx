"use client";

import Box from "@mui/material/Box";

import { useMode } from "#/components/global/theme-registry";

export default function CounterBox({ widgets, board, counter }) {
  const { mode } = useMode();

  return (
    <Box
      sx={{
        ml: 1,
        lineHeight: 0,
        height: "24px",
        fontWeight: 700,
        minWidth: "24px",
        cursor: "default",
        padding: "0px 6px",
        fontSize: "0.75rem",
        borderRadius: "6px",
        alignItems: "center",
        whiteSpace: "nowrap",
        display: "inline-flex",
        justifyContent: "center",
        backgroundColor: "rgba(0, 184, 217, 0.16)",
        transition: "all 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
        color: mode === "dark" ? "rgb(97, 243, 243)" : "rgb(0, 108, 156)",
      }}
    >
      {typeof widgets !== undefined
        ? widgets.filter((w) => w.owner_board === board).length
        : counter}
    </Box>
  );
}
