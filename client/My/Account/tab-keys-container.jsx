"use client";

import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Divider from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";

import { useState, useRef } from "react";
import Script from "next/script";
import Image from "next/image";

import SuccessSnackbar from "#/client/Shared/snackbar-success";
import { updateTitle, deleteKey } from "#/server/keys";
import { useKeys } from "#/app/my/layout";
import Iconify from "#/utils/iconify";

const EXCHANGES = {
  1: "Binance Futures",
  2: "Bybit Linear",
};

export default function TabKeysContainer({ loadingTrades }) {
  const { keys, setKeys } = useKeys();

  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [editedTitleError, setEditedTitleError] = useState("");
  const [editedTitle, setEditedTitle] = useState("");
  const [editMode, setEditMode] = useState(false);

  const selectedKeyIdRef = useRef(null);
  const editIndexRef = useRef(null);

  function handleSaveTitle(id, newTitle) {
    let editedTitleMessage = "";

    switch (true) {
      case newTitle.length < 3:
        editedTitleMessage = "Не менее 3 символов";
        break;
      case newTitle.length > 18:
        editedTitleMessage = "Не более 18 символов";
        break;
      case !/^[A-Za-zА-Яа-яЁё\d\s.,!?()-]+$/.test(newTitle):
        editedTitleMessage = "Некорректное название";
        break;
      default:
        break;
    }

    if (editedTitleMessage) {
      setEditedTitleError(editedTitleMessage);
      return;
    }

    setShowSuccessSnackbar(true);
    setEditMode(false);
    setEditedTitle("");
    setKeys((prev) =>
      prev.map((key) => (key.id === id ? { ...key, title: newTitle } : key))
    );
    editIndexRef.current = null;
    updateTitle(id, newTitle);
  }

  return (
    <>
      {keys.length > 0 ? (
        <Box
          sx={{
            mt: 5,
            gap: 3,
            display: "grid",
            "@media (min-width: 0px)": {
              gridTemplateColumns: "repeat(1, 1fr)",
            },
            "@media (min-width: 600px)": {
              gridTemplateColumns: "repeat(2, 1fr)",
            },
            "@media (min-width: 900px)": {
              gridTemplateColumns: "repeat(3, 1fr)",
            },
          }}
        >
          {keys.map((key, index) => (
            <Card
              key={key.id}
              sx={{
                p: 1,
                position: "relative",
                transition: "height 0.3s ease-in-out",
                height: editIndexRef.current === index ? "auto" : "260px",
              }}
            >
              <Stack
                sx={{
                  mt: 3,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Box
                  sx={{
                    ml: 3,
                  }}
                >
                  <Image
                    src="/images/tiktok.png"
                    width={48}
                    height={48}
                    style={{ borderRadius: "12px" }}
                  />
                </Box>
                <Box sx={{ mt: -3 }}>
                  <IconButton
                    onClick={() => {
                      setEditMode((prev) => !prev);
                      editIndexRef.current =
                        index === editIndexRef.current ? null : index;
                      setEditedTitle(key.title);
                      setEditedTitleError("");
                    }}
                    sx={{
                      top: 1,
                      right: 1,
                      color: "text.secondary",
                    }}
                  >
                    <Iconify icon="solar:pen-bold" width={20} />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      selectedKeyIdRef.current = key.id;
                      setDeleteConfirmation(true);
                    }}
                    sx={{
                      top: 1,
                      right: 1,
                      color: "error.main",
                    }}
                  >
                    <Iconify icon="solar:trash-bin-trash-bold" width={20} />
                  </IconButton>
                </Box>
              </Stack>
              <Stack sx={{ p: "20px 24px 16px" }}>
                <Box sx={{ mb: 1 }}>
                  {editIndexRef.current !== index ? (
                    <Typography variant="body1" sx={{ color: "text.primary" }}>
                      {key.title}
                    </Typography>
                  ) : (
                    <>
                      <TextField
                        variant="standard"
                        size="small"
                        value={editMode ? editedTitle : key.title}
                        onChange={(e) => {
                          setEditedTitle(e.target.value);
                          setEditedTitleError("");
                        }}
                        error={Boolean(editedTitleError)}
                        helperText={editedTitleError}
                      />
                      <IconButton
                        onClick={() => {
                          handleSaveTitle(key.id, editedTitle);
                        }}
                      >
                        <Iconify icon="solar:sd-card-bold-duotone" width={20} />
                      </IconButton>
                    </>
                  )}
                  <Typography
                    variant="body2"
                    sx={{ color: "text.disabled", mt: 1, mb: "4px" }}
                  >
                    {EXCHANGES[key.exchange]}
                  </Typography>
                  {loadingTrades.status === true &&
                  loadingTrades.id === key.id ? (
                    <Stack
                      sx={{
                        gap: "4px",
                        fontWeight: 400,
                        lineHeight: 1.5,
                        cursor: "default",
                        fontSize: "0.75rem",
                        flexDirection: "row",
                        alignItems: "center",
                        color: "warning.main",
                      }}
                    >
                      <Iconify
                        icon="line-md:downloading-loop"
                        sx={{ mr: "3px", mt: "3px" }}
                      />
                      Загрузка сделок...
                    </Stack>
                  ) : (
                    <Stack
                      sx={{
                        gap: "4px",
                        fontWeight: 400,
                        lineHeight: 1.5,
                        cursor: "default",
                        fontSize: "0.75rem",
                        flexDirection: "row",
                        alignItems: "center",
                        color: "primary.main",
                      }}
                    >
                      <Iconify
                        icon="solar:playback-speed-bold-duotone"
                        sx={{ mr: "3px", mt: "3px" }}
                      />
                      Подключено
                    </Stack>
                  )}
                </Box>
              </Stack>
              <Divider
                sx={{
                  borderWidth: "0px 0px thin",
                  borderStyle: "dashed",
                  borderColor: "rgba(145, 158, 171, 0.2)",
                }}
              />
              <Box
                sx={{
                  p: 3,
                  rowGap: 2,
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                }}
              />
            </Card>
          ))}
        </Box>
      ) : (
        <Box sx={{ display: "flex", justifyContent: "center", mt: "100px" }}>
          <Script src="https://unpkg.com/@lottiefiles/lottie-player@2.0.3/dist/tgs-player.js" />
          <tgs-player
            autoplay
            loop
            mode="normal"
            src="/video/duck_not_found.tgs"
            style={{ height: "250px", width: "250px" }}
          />
        </Box>
      )}
      <Dialog
        open={deleteConfirmation}
        onClose={() => {
          setDeleteConfirmation(false);
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, p: 3, color: "text.primary" }}>
          Подтвердите действие
        </DialogTitle>
        <DialogContent sx={{ pl: 3, pr: 3 }}>
          <DialogContentText>
            Вы уверены, что хотите удалить этот ключ?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            variant="contained"
            color="error"
            size="medium"
            onClick={() => {
              setDeleteConfirmation(false);
              setKeys((prev) =>
                prev.filter((k) => k.id !== selectedKeyIdRef.current)
              );
              setShowSuccessSnackbar(true);
              deleteKey(selectedKeyIdRef.current);
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
              setDeleteConfirmation(false);
            }}
          >
            Отмена
          </Button>
        </DialogActions>
      </Dialog>
      <SuccessSnackbar
        showSuccessSnackbar={showSuccessSnackbar}
        setShowSuccessSnackbar={setShowSuccessSnackbar}
      />
    </>
  );
}
