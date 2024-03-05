"use client";

import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import { useMode } from "#/components/global/theme-registry";
import Iconify from "#/utils/iconify";

export default function SuccessSnackbar({
  showSuccessSnackbar,
  setShowSuccessSnackbar,
}) {
  const { mode } = useMode();

  return (
    <Snackbar
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      key={"bottom" + "right"}
      open={showSuccessSnackbar}
      autoHideDuration={1500}
      transitionDuration={300}
      onClose={() => {
        setShowSuccessSnackbar(false);
      }}
    >
      <Alert
        severity="success"
        icon={
          <Iconify
            icon="solar:check-square-bold"
            sx={{
              color:
                mode === "dark" ? "rgb(119, 237, 139)" : "rgb(34, 197, 94)",
            }}
          />
        }
        onClose={() => {
          setShowSuccessSnackbar(false);
        }}
      >
        Изменения сохранены
      </Alert>
    </Snackbar>
  );
}
