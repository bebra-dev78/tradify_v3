"use client";

import Popover from "@mui/material/Popover";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";

import { useState, useRef } from "react";

import WidgetsDialog from "#/layout/Analytics/widgets-dialog";
import WidgetsLayout from "#/layout/Analytics/widgets-layout";
import AddBoardMenu from "#/layout/Analytics/add-board-menu";
import Iconify from "#/utils/iconify";

export default function Index() {
  const [widgets, setWidgets] = useState(
    JSON.parse(localStorage.getItem("widgets")) ?? []
  );
  const [boards, setBoards] = useState(
    JSON.parse(localStorage.getItem("boards")) ?? []
  );
  const [anchorEl, setAnchorEl] = useState(null);

  const widgetsParamsRef = useRef(
    JSON.parse(localStorage.getItem("widgetsParams")) ?? {}
  );
  const currentBoardRef = useRef(0);

  return boards.length > 0 ? (
    <>
      <WidgetsDialog
        boards={boards}
        widgets={widgets}
        setWidgets={setWidgets}
        currentBoardRef={currentBoardRef}
        widgetsParamsRef={widgetsParamsRef}
      />
      <WidgetsLayout
        boards={boards}
        widgets={widgets}
        setBoards={setBoards}
        setWidgets={setWidgets}
        currentBoardRef={currentBoardRef}
        widgetsParamsRef={widgetsParamsRef}
      />
    </>
  ) : (
    <>
      <Box
        sx={{
          "& > :not(style)": { m: 1 },
          "@media (max-width: 600px)": {
            "& > :not(style)": { m: 0 },
          },
        }}
      >
        <Fab
          variant="extended"
          onClick={(e) => {
            setAnchorEl(e.currentTarget);
          }}
          sx={{ width: "100%" }}
        >
          <Iconify icon="ic:round-plus" sx={{ mr: 1 }} />
          Добавить доску
        </Fab>
      </Box>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        onClose={() => {
          setAnchorEl(null);
        }}
        sx={{ mt: "30px" }}
      >
        <AddBoardMenu
          boards={boards}
          setBoards={setBoards}
          setAnchorEl={setAnchorEl}
        />
      </Popover>
    </>
  );
}
