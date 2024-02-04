"use client";

import InputAdornment from "@mui/material/InputAdornment";
import LoadingButton from "@mui/lab/LoadingButton";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";

import { useState, useRef } from "react";
import bcrypt from "bcryptjs";

import SuccessSnackbar from "#/client/Shared/snackbar-success";
import { updatePassword } from "#/server/users";
import { useUser } from "#/app/my/layout";
import Iconify from "#/utils/iconify";

export default function TabSecurity() {
  const { user, setUser } = useUser();

  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);
  const [repeatPasswordError, setRepeatPasswordError] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [oldPasswordError, setOldPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  const userPasswordRef = useRef(user.password);
  const repeatPasswordRef = useRef(null);
  const newPasswordRef = useRef(null);
  const oldPasswordRef = useRef(null);

  function handleSubmit() {
    let oldPasswordMessage = "";
    let newPasswordMessage = "";
    let repeatPasswordMessage = "";

    const repeatPassword = repeatPasswordRef.current.value;
    const newPassword = newPasswordRef.current.value;
    const oldPassword = oldPasswordRef.current.value;

    switch (false) {
      case bcrypt.compareSync(oldPassword, userPasswordRef.current):
        oldPasswordMessage = "Неверный пароль";
        break;
      default:
        break;
    }

    switch (true) {
      case newPassword.length < 8:
        newPasswordMessage = "Не менее 8 символов";
        break;
      case newPassword.length > 24:
        newPasswordMessage = "Не более 24 символов";
        break;
      case /\s/.test(newPassword):
        newPasswordMessage = "Пароль не должен содержать пробелы";
        break;
      case !/^[A-Za-zА-Яа-яЁё\d\s.,!?()-]+$/.test(newPassword):
        newPasswordMessage = "Некорректный пароль";
        break;
      case repeatPassword.trim() !== newPassword.trim():
        repeatPasswordMessage = "Пароли не совпадают";
        newPasswordMessage = "Пароли не совпадают";
        break;
      case oldPassword.trim() === newPassword.trim():
        oldPasswordMessage = "Пароли должны отличаться";
        newPasswordMessage = "Пароли должны отличаться";
        break;
      default:
        break;
    }

    if (oldPasswordMessage || newPasswordMessage) {
      setOldPasswordError(oldPasswordMessage);
      setNewPasswordError(newPasswordMessage);
      setRepeatPasswordError(repeatPasswordMessage);
      return;
    }

    setLoading(true);

    const hash = bcrypt.hashSync(newPassword, 10);

    updatePassword(user.id, hash).then((r) => {
      setLoading(false);

      if (r === 200) {
        setShowSuccessSnackbar(true);
        setUser((prev) => ({ ...prev, password: hash }));
        setOldPasswordError("");
        setNewPasswordError("");
        setRepeatPasswordError("");

        userPasswordRef.current = hash;

        repeatPasswordRef.current.value = "";
        newPasswordRef.current.value = "";
        oldPasswordRef.current.value = newPassword;

        setShowOldPassword(false);
        setShowNewPassword(false);
      }
    });
  }

  return (
    <>
      <TextField
        label="Старый пароль"
        name="password"
        type={showOldPassword ? "text" : "password"}
        fullWidth
        inputRef={oldPasswordRef}
        onChange={() => {
          setOldPasswordError("");
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end" sx={{ paddingRight: 1 }}>
              <IconButton
                onClick={() => setShowOldPassword((prev) => !prev)}
                edge="end"
                sx={{ color: "text.disabled" }}
              >
                {showOldPassword ? (
                  <Iconify icon="solar:eye-bold" />
                ) : (
                  <Iconify icon="solar:eye-closed-bold-duotone" />
                )}
              </IconButton>
            </InputAdornment>
          ),
        }}
        error={Boolean(oldPasswordError)}
        helperText={oldPasswordError}
      />
      <TextField
        label="Новый пароль"
        name="password"
        type={showNewPassword ? "text" : "password"}
        fullWidth
        autoComplete="new-password"
        inputRef={newPasswordRef}
        onChange={() => {
          setNewPasswordError("");
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end" sx={{ paddingRight: 1 }}>
              <IconButton
                onClick={() => setShowNewPassword((prev) => !prev)}
                edge="end"
                sx={{ color: "text.disabled" }}
              >
                {showNewPassword ? (
                  <Iconify icon="solar:eye-bold" />
                ) : (
                  <Iconify icon="solar:eye-closed-bold-duotone" />
                )}
              </IconButton>
            </InputAdornment>
          ),
        }}
        error={Boolean(newPasswordError)}
        helperText={newPasswordError}
      />
      <TextField
        label="Повторите новый пароль"
        type={showNewPassword ? "text" : "password"}
        fullWidth
        autoComplete="off"
        inputRef={repeatPasswordRef}
        onChange={() => {
          setRepeatPasswordError("");
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end" sx={{ paddingRight: 1 }}>
              <IconButton
                onClick={() => setShowNewPassword((prev) => !prev)}
                edge="end"
                sx={{ color: "text.disabled" }}
              >
                {showNewPassword ? (
                  <Iconify icon="solar:eye-bold" />
                ) : (
                  <Iconify icon="solar:eye-closed-bold-duotone" />
                )}
              </IconButton>
            </InputAdornment>
          ),
        }}
        error={Boolean(repeatPasswordError)}
        helperText={repeatPasswordError}
      />
      <LoadingButton
        variant="contained"
        color="inherit"
        size="medium"
        loading={loading}
        onClick={handleSubmit}
      >
        Сохранить
      </LoadingButton>
      <SuccessSnackbar
        showSuccessSnackbar={showSuccessSnackbar}
        setShowSuccessSnackbar={setShowSuccessSnackbar}
      />
    </>
  );
}
