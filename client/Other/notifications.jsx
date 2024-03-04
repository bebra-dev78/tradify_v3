"use client";

import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";

import { useState } from "react";

import { readNotifications } from "#/server/notifications";
import Iconify from "#/utils/iconify";

export default function Notifications({ id, unread }) {
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
