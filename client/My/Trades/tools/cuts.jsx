"use client";

import ClickAwayListener from "@mui/material/ClickAwayListener";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Popper from "@mui/material/Popper";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Grow from "@mui/material/Grow";

import { useState } from "react";

import Iconify from "#/utils/iconify";

export default function Cuts({ addOverlay }) {
  const [anchorEl, setAnchorEl] = useState(null);

  return (
    <ClickAwayListener
      onClickAway={() => {
        setAnchorEl(null);
      }}
    >
      <div>
        <ListItemButton
          onClick={(event) => {
            setAnchorEl(anchorEl ? null : event.currentTarget);
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
              mt: 0,
            }}
          >
            <Iconify icon="ph:line-segments-fill" />
          </ListItemIcon>
        </ListItemButton>
        <Popper
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          transition
          placement="right-start"
          modifiers={[
            {
              name: "offset",
              options: {
                offset: [0, 8],
              },
            },
          ]}
          sx={{ zIndex: 1, position: "absolute" }}
        >
          {({ TransitionProps }) => (
            <Grow
              {...TransitionProps}
              timeout={200}
              style={{
                transformOrigin: "top left",
              }}
            >
              <Paper>
                <Stack sx={{ p: "8px" }}>
                  <MenuItem
                    onClick={() => {
                      setAnchorEl(null);
                      addOverlay("sampleThreeWaves");
                    }}
                  >
                    <Iconify icon="ph:line-segments-bold" />
                    <Typography sx={{ ml: 2 }}>3 волны</Typography>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setAnchorEl(null);
                      addOverlay("sampleFiveWaves");
                    }}
                  >
                    <Iconify icon="ph:line-segments-bold" />
                    <Typography sx={{ ml: 2 }}>5 волн</Typography>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setAnchorEl(null);
                      addOverlay("sampleEightWaves");
                    }}
                  >
                    <Iconify icon="ph:line-segments-bold" />
                    <Typography sx={{ ml: 2 }}>8 волн</Typography>
                  </MenuItem>
                </Stack>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    </ClickAwayListener>
  );
}
