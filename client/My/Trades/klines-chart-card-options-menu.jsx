"use client";

import GridOffRoundedIcon from "@mui/icons-material/GridOffRounded";
import GridOnRoundedIcon from "@mui/icons-material/GridOnRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ListItemIcon from "@mui/material/ListItemIcon";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Popover from "@mui/material/Popover";
import Stack from "@mui/material/Stack";

import { useState } from "react";

import Iconify from "#/utils/iconify";

export default function KlinesChartCardOptionsMenu({
  setGridStatus,
  gridStatus,
  showGrid,
  setData,
}) {
  const [anchorEl, setAnchorEl] = useState(null);

  return (
    <>
      <IconButton
        onClick={(e) => {
          setAnchorEl(e.currentTarget);
        }}
      >
        <Iconify
          icon="solar:menu-dots-bold"
          sx={{ transform: "rotate(90deg)" }}
        />
      </IconButton>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
        }}
        onClose={() => {
          setAnchorEl(null);
        }}
        slotProps={{
          paper: {
            sx: {
              marginLeft: "-20px",
              padding: "0px",
              width: "200px",
            },
          },
        }}
      >
        <Stack sx={{ p: "8px" }}>
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              showGrid(!gridStatus);
              setGridStatus((prev) => !prev);
            }}
            sx={{
              color: "text.primary",
              justifyContent: "space-between",
            }}
          >
            {gridStatus ? (
              <>
                Скрыть сетку
                <ListItemIcon sx={{ minWidth: "0px !important" }}>
                  <GridOffRoundedIcon sx={{ width: "20px" }} />
                </ListItemIcon>
              </>
            ) : (
              <>
                Показать сетку
                <ListItemIcon sx={{ minWidth: "0px !important" }}>
                  <GridOnRoundedIcon sx={{ width: "20px" }} />
                </ListItemIcon>
              </>
            )}
          </MenuItem>
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              setData(null);
            }}
            sx={{
              color: "error.main",
              justifyContent: "space-between",
            }}
          >
            Закрыть
            <ListItemIcon
              sx={{ minWidth: "0px !important", color: "error.main" }}
            >
              <CloseRoundedIcon />
            </ListItemIcon>
          </MenuItem>
        </Stack>
      </Popover>
    </>
  );
}
