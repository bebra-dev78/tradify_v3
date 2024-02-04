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

export default function Figures({ addOverlay }) {
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
            <Iconify icon="line-md:circle" />
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
                      addOverlay("sampleCircle");
                    }}
                  >
                    <Iconify icon="line-md:circle" />
                    <Typography sx={{ ml: 2 }}>Круг</Typography>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setAnchorEl(null);
                      addOverlay("sampleRect");
                    }}
                  >
                    <Iconify icon="line-md:square" />
                    <Typography sx={{ ml: 2 }}>Прямоугольник</Typography>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setAnchorEl(null);
                      addOverlay("sampleTriangle");
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="2 2 20 20"
                    >
                      <g transform="rotate(-90 12 12)">
                        <path
                          fill="none"
                          stroke="currentColor"
                          stroke-dasharray="36"
                          stroke-dashoffset="36"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="1.7"
                          d="M8 6L18 12L8 18z"
                        >
                          <animate
                            fill="freeze"
                            attributeName="stroke-dashoffset"
                            dur="0.4s"
                            values="36;0"
                          />
                        </path>
                      </g>
                    </svg>
                    <Typography sx={{ ml: 2 }}>Треугольник</Typography>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setAnchorEl(null);
                      addOverlay("sampleParallelogram");
                    }}
                  >
                    <Iconify icon="akar-icons:parallelogram" />
                    <Typography sx={{ ml: 2 }}>Параллелограмм</Typography>
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
