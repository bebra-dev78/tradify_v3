"use client";

import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";

import { useState } from "react";

import Iconify from "#/utils/iconify";

export default function BoardsLayout({ boards, setBoards }) {
  const [confirmation, setConfirmation] = useState(false);

  return (
    <>
      {boards.map((board) => (
        <Card
          key={board.board_id}
          sx={{
            width: "95%",
            "@media (min-width: 600px)": {
              width: "50%",
            },
          }}
        >
          <Stack
            sx={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="button" sx={{ ml: "auto", mr: "auto" }}>
              {board.title}
            </Typography>
            <IconButton
              onClick={() => {
                setConfirmation(true);
              }}
              sx={{
                color: "error.main",
              }}
            >
              <Iconify icon="solar:trash-bin-trash-bold" />
            </IconButton>
          </Stack>
        </Card>
      ))}
      <Dialog
        open={confirmation}
        onClose={() => {
          setConfirmation(false);
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, p: 3, color: "text.primary" }}>
          Подтвердите действие
        </DialogTitle>
        <DialogContent sx={{ pl: 3, pr: 3 }}>
          <DialogContentText>
            Вы уверены, что хотите удалить эту доску?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            variant="contained"
            color="error"
            size="medium"
            onClick={() => {
              setConfirmation(false);
              setBoards([]);
              localStorage.setItem("widgets", JSON.stringify([]));
              localStorage.setItem("boards", JSON.stringify([]));
            }}
          >
            Удалить
          </Button>
          <Button
            variant="outlined"
            color="inherit"
            size="medium"
            autoFocus
            onClick={() => {
              setConfirmation(false);
            }}
          >
            Отмена
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
