"use client";

import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";

import Iconify from "#/utils/iconify";

export default function Lineup({ addOverlay }) {
  return (
    <div>
      <ListItemButton
        onClick={() => {
          addOverlay.current("lineup");
        }}
        sx={{
          backgroundColor: "transparent",
          maxHeight: "60px",
          borderRadius: "6px",
          flexDirection: "column",
          fontWeight: 600,
          m: "0px 4px",
          p: "4px",
          "&:hover": {
            backgroundColor: "rgba(145, 158, 171, 0.08)",
          },
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: "auto",
            width: "24px",
            mt: "4px",
          }}
        >
          <Iconify icon="solar:ruler-angular-bold" />
        </ListItemIcon>
      </ListItemButton>
    </div>
  );
}
