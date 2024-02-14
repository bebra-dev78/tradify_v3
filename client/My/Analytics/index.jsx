"use client";

import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";

import { useState, useRef } from "react";

import WidgetsDialog from "#/client/My/Analytics/widgets-dialog";
import AddBoardMenu from "#/client/My/Analytics/add-board-menu";
import Layout from "#/client/My/Analytics/layout";
import Iconify from "#/utils/iconify";

export default function Index() {
  const [widgets, setWidgets] = useState(
    () => JSON.parse(localStorage.getItem("widgets")) ?? []
  );
  const [boards, setBoards] = useState(
    () => JSON.parse(localStorage.getItem("boards")) ?? []
  );
  const [anchorEl, setAnchorEl] = useState(null);

  const widgetsParamsRef = useRef({});
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
      <Layout
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
      <AddBoardMenu
        open={Boolean(anchorEl)}
        boards={boards}
        anchorEl={anchorEl}
        setBoards={setBoards}
        setAnchorEl={setAnchorEl}
      />
    </>
  );
}
