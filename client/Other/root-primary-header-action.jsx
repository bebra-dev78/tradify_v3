"use client";

import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";

import { useEffect, useState } from "react";

import PopoverMenu from "#/client/Other/popover-menu";
import Iconify from "#/utils/iconify";

export default function RootPrimaryHeaderAction({ name, email }) {
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
        <PopoverMenu username={name} email={email} setAnchorEl={setAnchorEl} />
      </Popover>
    </Stack>
  );
}
