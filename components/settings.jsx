"use client";

import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";

import { keyframes } from "@emotion/react";
import { useState } from "react";

import { useMode } from "#/components/global/theme-registry";
import Iconify from "#/utils/iconify";

export default function Settings({ stretch, setStretch }) {
  const { mode, setMode } = useMode();

  const [openDrawer, setOpenDrawer] = useState(false);

  return (
    <>
      <IconButton
        aria-label="Настройки"
        onClick={() => {
          setOpenDrawer(true);
        }}
        sx={{
          color: "text.secondary",
          animation: `${keyframes`
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          `} 7s linear infinite`,
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            fillRule="evenodd"
            d="M14.279 2.152C13.909 2 13.439 2 12.5 2s-1.408 0-1.779.152a2.008 2.008 0 0 0-1.09 1.083c-.094.223-.13.484-.145.863a1.615 1.615 0 0 1-.796 1.353a1.64 1.64 0 0 1-1.579.008c-.338-.178-.583-.276-.825-.308a2.026 2.026 0 0 0-1.49.396c-.318.242-.553.646-1.022 1.453c-.47.807-.704 1.21-.757 1.605c-.07.526.074 1.058.4 1.479c.148.192.357.353.68.555c.477.297.783.803.783 1.361c0 .558-.306 1.064-.782 1.36c-.324.203-.533.364-.682.556a1.99 1.99 0 0 0-.399 1.479c.053.394.287.798.757 1.605c.47.807.704 1.21 1.022 1.453c.424.323.96.465 1.49.396c.242-.032.487-.13.825-.308a1.64 1.64 0 0 1 1.58.008c.486.28.774.795.795 1.353c.015.38.051.64.145.863c.204.49.596.88 1.09 1.083c.37.152.84.152 1.779.152s1.409 0 1.779-.152a2.008 2.008 0 0 0 1.09-1.083c.094-.223.13-.483.145-.863c.02-.558.309-1.074.796-1.353a1.64 1.64 0 0 1 1.579-.008c.338.178.583.276.825.308c.53.07 1.066-.073 1.49-.396c.318-.242.553-.646 1.022-1.453c.47-.807.704-1.21.757-1.605a1.99 1.99 0 0 0-.4-1.479c-.148-.192-.357-.353-.68-.555c-.477-.297-.783-.803-.783-1.361c0-.558.306-1.064.782-1.36c.324-.203.533-.364.682-.556a1.99 1.99 0 0 0 .399-1.479c-.053-.394-.287-.798-.757-1.605c-.47-.807-.704-1.21-1.022-1.453a2.026 2.026 0 0 0-1.49-.396c-.242.032-.487.13-.825.308a1.64 1.64 0 0 1-1.58-.008a1.615 1.615 0 0 1-.795-1.353c-.015-.38-.051-.64-.145-.863a2.007 2.007 0 0 0-1.09-1.083"
            clipRule="evenodd"
            opacity=".5"
          />
          <path
            fill="currentColor"
            d="M15.523 12c0 1.657-1.354 3-3.023 3c-1.67 0-3.023-1.343-3.023-3S10.83 9 12.5 9c1.67 0 3.023 1.343 3.023 3"
          />
        </svg>
      </IconButton>
      <Drawer
        open={openDrawer}
        anchor="right"
        onClose={() => {
          setOpenDrawer(false);
        }}
        PaperProps={{
          sx: {
            padding: 0,
            width: "280px",
            border: "none",
            borderRadius: 0,
            backgroundColor:
              mode === "dark" ? "rgba(22, 28, 36, 0.8)" : "rgb(249, 250, 251)",
          },
        }}
      >
        <Stack
          sx={{
            flexDirection: "row",
            alignItems: "center",
            p: "16px 8px 16px 20px",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6">Настройки</Typography>
          <IconButton
            onClick={() => {
              setOpenDrawer(false);
            }}
            sx={{
              color: "text.secondary",
            }}
          >
            <Iconify
              icon="line-md:close-small"
              width={25}
              sx={{ color: "text.disabled" }}
            />
          </IconButton>
        </Stack>
        <Divider />
        <Stack sx={{ gap: "24px", p: "24px" }}>
          <Box>
            <Typography
              variant="caption"
              component="div"
              sx={{
                m: "0 0 12px",
                color: "text.disabled",
              }}
            >
              Тема
            </Typography>
            <Stack sx={{ gap: "16px", flexDirection: "row" }}>
              <Button
                onClick={() => {
                  setMode("light");
                  document.body.setAttribute("data-theme", "light");
                  localStorage.setItem("mode", "light");
                }}
                sx={{
                  width: "100%",
                  height: "80px",
                  border: "1px solid rgba(145, 158, 171, 0.08)",
                  color: mode === "light" ? "primary.main" : "text.disabled",
                  backgroundColor:
                    mode === "light" ? "background.paper" : "transparent",
                  boxShadow:
                    mode === "light"
                      ? "rgba(0, 0, 0, 0.08) -24px 8px 24px -4px"
                      : "none",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M11.9998 18.1111C15.3749 18.1111 18.1109 15.3751 18.1109 12C18.1109 8.62495 15.3749 5.88892 11.9998 5.88892C8.62471 5.88892 5.88867 8.62495 5.88867 12C5.88867 15.3751 8.62471 18.1111 11.9998 18.1111Z"
                    fill="currentColor"
                  />
                  <g opacity="0.4">
                    <path
                      d="M10.1667 2.83333C10.1667 1.78189 10.8396 1.00805 11.891 1.00039C11.9266 1.00013 11.9629 1 12 1C12.0371 1 12.0734 1.00013 12.109 1.00039C13.1604 1.00805 13.8333 1.78189 13.8333 2.83333C13.8333 3.88481 13.1604 4.6586 12.109 4.6663C12.0734 4.66654 12.0371 4.66667 12 4.66667C11.9629 4.66667 11.9266 4.66654 11.891 4.6663C10.8396 4.6586 10.1667 3.88475 10.1667 2.83333Z"
                      fill="currentColor"
                    />
                    <path
                      d="M10.1667 21.1667C10.1667 22.2181 10.8396 22.9919 11.891 22.9996C11.9266 22.9999 11.9629 23 12 23C12.0371 23 12.0734 22.9999 12.109 22.9996C13.1604 22.9919 13.8333 22.2181 13.8333 21.1667C13.8333 20.1152 13.1604 19.3414 12.109 19.3337C12.0734 19.3335 12.0371 19.3333 12 19.3333C11.9629 19.3333 11.9266 19.3335 11.891 19.3337C10.8396 19.3414 10.1667 20.1152 10.1667 21.1667Z"
                      fill="currentColor"
                    />
                    <path
                      d="M17.1855 4.22184C17.9289 3.47836 18.9519 3.40695 19.7008 4.14502C19.7262 4.17002 19.7519 4.19562 19.7782 4.22184C19.8044 4.24806 19.83 4.27384 19.855 4.29921C20.593 5.04806 20.5216 6.07106 19.7782 6.81454C19.0347 7.55802 18.0117 7.62939 17.2628 6.89136C17.2375 6.86636 17.2117 6.84076 17.1855 6.81454C17.1592 6.78832 17.1336 6.76253 17.1086 6.73717C16.3706 5.98832 16.442 4.96532 17.1855 4.22184Z"
                      fill="currentColor"
                    />
                    <path
                      d="M4.22184 17.1855C3.47836 17.9289 3.40696 18.9519 4.14502 19.7008C4.17002 19.7262 4.19562 19.7519 4.22184 19.7782C4.24806 19.8044 4.27384 19.83 4.29921 19.855C5.04806 20.593 6.07106 20.5216 6.81454 19.7782C7.55802 19.0347 7.62939 18.0117 6.89136 17.2628C6.86636 17.2375 6.84076 17.2117 6.81454 17.1855C6.78832 17.1592 6.76253 17.1336 6.73717 17.1086C5.98832 16.3706 4.96532 16.442 4.22184 17.1855Z"
                      fill="currentColor"
                    />
                    <path
                      d="M2.83333 13.8333C1.78189 13.8333 1.00805 13.1604 1.00039 12.109C1.00013 12.0734 1 12.0371 1 12C1 11.9629 1.00013 11.9266 1.00039 11.891C1.00805 10.8396 1.78189 10.1667 2.83333 10.1667C3.88475 10.1667 4.6586 10.8396 4.6663 11.891C4.66654 11.9266 4.66667 11.9629 4.66667 12C4.66667 12.0371 4.66654 12.0734 4.6663 12.109C4.6586 13.1604 3.88475 13.8333 2.83333 13.8333Z"
                      fill="currentColor"
                    />
                    <path
                      d="M21.1667 13.8333C22.2181 13.8333 22.9919 13.1604 22.9996 12.109C22.9999 12.0734 23 12.0371 23 12C23 11.9629 22.9999 11.9266 22.9996 11.891C22.9919 10.8396 22.2181 10.1667 21.1667 10.1667C20.1152 10.1667 19.3414 10.8396 19.3337 11.891C19.3335 11.9266 19.3333 11.9629 19.3333 12C19.3333 12.0371 19.3335 12.0734 19.3337 12.109C19.3414 13.1604 20.1152 13.8333 21.1667 13.8333Z"
                      fill="currentColor"
                    />
                    <path
                      d="M4.22184 6.81454C3.47836 6.07106 3.40695 5.04806 4.14502 4.29921C4.17002 4.27384 4.19562 4.24806 4.22184 4.22184C4.24806 4.19562 4.27384 4.17002 4.29921 4.14502C5.04806 3.40695 6.07106 3.47836 6.81454 4.22184C7.55802 4.96532 7.62939 5.98832 6.89136 6.73717C6.86636 6.76253 6.84076 6.78832 6.81454 6.81454C6.78832 6.84076 6.76253 6.86636 6.73717 6.89136C5.98832 7.62939 4.96532 7.55802 4.22184 6.81454Z"
                      fill="currentColor"
                    />
                    <path
                      d="M17.1855 19.7782C17.9289 20.5216 18.9519 20.593 19.7008 19.855C19.7262 19.83 19.7519 19.8044 19.7782 19.7782C19.8044 19.7519 19.83 19.7262 19.855 19.7008C20.593 18.9519 20.5216 17.9289 19.7782 17.1855C19.0347 16.442 18.0117 16.3706 17.2628 17.1086C17.2375 17.1336 17.2117 17.1592 17.1855 17.1855C17.1592 17.2117 17.1336 17.2375 17.1086 17.2628C16.3706 18.0117 16.442 19.0347 17.1855 19.7782Z"
                      fill="currentColor"
                    />
                  </g>
                </svg>
              </Button>
              <Button
                onClick={() => {
                  setMode("dark");
                  document.body.setAttribute("data-theme", "dark");
                  localStorage.setItem("mode", "dark");
                }}
                sx={{
                  width: "100%",
                  height: "80px",
                  border: "1px solid rgba(145, 158, 171, 0.08)",
                  color: mode === "dark" ? "primary.main" : "text.disabled",
                  backgroundColor:
                    mode === "dark" ? "background.paper" : "transparent",
                  boxShadow:
                    mode === "dark"
                      ? "rgba(0, 0, 0, 0.08) -24px 8px 24px -4px"
                      : "none",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    opacity="0.4"
                    d="M16.9462 11.0863C16.9759 11.0874 17.0055 11.0886 17.035 11.0898C20.1966 11.2176 22.5 13.3358 22.5 16.5C22.5 19.6642 20.1966 21.7824 17.035 21.9102C15.7057 21.9639 14.0498 22 12 22C9.9502 22 8.2943 21.9639 6.965 21.9102C3.80337 21.7824 1.5 19.6642 1.5 16.5C1.5 14.0317 2.90165 12.1999 5.019 11.4529C5.2406 8.2951 7.3872 6.02435 10.6413 6.00125C10.7585 6.00045 10.878 6 11 6C11.122 6 11.2415 6.00045 11.3587 6.00125C14.4855 6.02345 16.5897 8.1208 16.9462 11.0863Z"
                    fill="currentColor"
                  />
                  <path
                    d="M19.2407 2.28853C19.5263 2.12002 19.5419 1.62921 19.2169 1.57222C18.1306 1.38179 16.9755 1.56344 15.9464 2.17059C14.4123 3.07575 13.5394 4.70186 13.501 6.38837C15.4283 7.12677 16.6785 8.86242 16.9459 11.0863L17.0347 11.0898C17.7391 11.1183 18.401 11.2456 19.0042 11.4612C19.6324 11.3806 20.2555 11.1732 20.8383 10.8294C21.8673 10.2222 22.5988 9.2907 22.9806 8.23415C23.0948 7.918 22.6711 7.6864 22.3855 7.8549C20.8813 8.74235 18.958 8.2157 18.0896 6.6786C17.2212 5.1415 17.7366 3.17599 19.2407 2.28853Z"
                    fill="currentColor"
                  />
                </svg>
              </Button>
            </Stack>
          </Box>
          {stretch !== undefined && (
            <Box>
              <Typography
                variant="caption"
                component="div"
                sx={{
                  m: "0 0 12px",
                  color: "text.disabled",
                  alignItems: "center",
                  display: "inline-flex",
                }}
              >
                Контейнер
                <Tooltip
                  title="Работает только при больших разрешениях экрана"
                  arrow
                >
                  <Iconify
                    icon="solar:info-circle-linear"
                    sx={{
                      color: "text.disabled",
                      width: "14px",
                      height: "14px",
                      ml: "4px",
                    }}
                  />
                </Tooltip>
              </Typography>
              <Button
                onClick={() => {
                  setStretch((prev) => {
                    localStorage.setItem("stretch", JSON.stringify(!prev));
                    return !prev;
                  });
                }}
                sx={{
                  width: "100%",
                  height: "80px",
                  border: "1px solid rgba(145, 158, 171, 0.08)",
                  backgroundColor: stretch ? "transparent" : "background.paper",
                  boxShadow: stretch
                    ? "none"
                    : "rgba(0, 0, 0, 0.08) -24px 8px 24px -4px",
                }}
              >
                <Stack
                  sx={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    transition: "width 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
                    width: stretch ? "24%" : "50%",
                  }}
                >
                  {stretch ? (
                    <ArrowForwardIosRoundedIcon
                      sx={{
                        color: "text.disabled",
                        width: "20px",
                        height: "20px",
                      }}
                    />
                  ) : (
                    <ArrowBackIosRoundedIcon
                      sx={{
                        color: "primary.main",
                        width: "20px",
                        height: "20px",
                      }}
                    />
                  )}
                  <Box
                    sx={{
                      flexGrow: 1,
                      borderBottom: stretch
                        ? "1.5px dashed rgb(99, 115, 129)"
                        : "1.5px dashed rgb(0, 167, 111)",
                    }}
                  />
                  {stretch ? (
                    <ArrowBackIosRoundedIcon
                      sx={{
                        color: "text.disabled",
                        width: "20px",
                        height: "20px",
                      }}
                    />
                  ) : (
                    <ArrowForwardIosRoundedIcon
                      sx={{
                        color: "primary.main",
                        width: "20px",
                        height: "20px",
                      }}
                    />
                  )}
                </Stack>
              </Button>
            </Box>
          )}
        </Stack>
      </Drawer>
    </>
  );
}
