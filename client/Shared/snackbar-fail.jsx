"use client";

import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import { useMode } from "#/client/Global/theme-registry";
import Iconify from "#/utils/iconify";

export default function FailSnackbar({
  showFailSnackbar,
  setShowFailSnackbar,
  text = (
    <>
      Операция не удалась
      <br />
      (см. Консоль браузера).
    </>
  ),
}) {
  const { mode } = useMode();

  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      key={"top" + "right"}
      open={showFailSnackbar}
      autoHideDuration={3000}
      onClose={() => {
        setShowFailSnackbar(false);
      }}
    >
      <Alert
        severity="error"
        icon={
          <Iconify
            icon="solar:danger-bold"
            sx={{
              color:
                mode === "dark" ? "rgb(255, 172, 130)" : "rgb(255, 86, 48)",
            }}
          />
        }
        onClose={() => {
          setShowFailSnackbar(false);
        }}
      >
        {text}
      </Alert>
    </Snackbar>
  );
}
