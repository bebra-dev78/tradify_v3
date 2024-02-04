"use client";

import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import Avatar from "@mui/material/Avatar";

import { useState } from "react";

import { useMode } from "#/client/Global/theme-registry";
import PopoverMenu from "#/client/Other/popover-menu";

export default function HeaderAction({ username, email }) {
  const { mode } = useMode();

  const [anchorEl, setAnchorEl] = useState(null);

  return (
    <>
      <IconButton
        onClick={(e) => {
          setAnchorEl(e.currentTarget);
        }}
        sx={{
          width: "40px",
          height: "40px",
        }}
      >
        <Avatar>{username?.charAt(0).toUpperCase()}</Avatar>
      </IconButton>
      <Popover
        open={Boolean(anchorEl)}
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
        <PopoverMenu
          username={username}
          email={email}
          setAnchorEl={setAnchorEl}
        />
      </Popover>
    </>
  );
}
