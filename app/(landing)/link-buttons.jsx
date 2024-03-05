"use client";

import Button from "@mui/material/Button";

import { useSession } from "next-auth/react";
import NProgress from "nprogress";
import Link from "next/link";

import Iconify from "#/utils/iconify";

export function MainButtons() {
  const { status } = useSession();

  return status === "authenticated" ? (
    <Link href="/my/overview">
      <Button
        variant="outlined"
        color="inherit"
        size="large"
        startIcon={<Iconify icon="line-md:login" />}
        onClick={() => NProgress.start()}
      >
        Панель управления
      </Button>
    </Link>
  ) : (
    <>
      <Link href="/register">
        <Button
          variant="contained"
          color="inherit"
          size="large"
          startIcon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <g
                fill="none"
                stroke="currentColor"
                strokeDasharray="18"
                strokeDashoffset="18"
                strokeLinecap="round"
                strokeWidth="2"
              >
                <path d="M12 5V19">
                  <animate
                    fill="freeze"
                    attributeName="stroke-dashoffset"
                    begin="0.4s"
                    dur="0.3s"
                    values="18;0"
                  />
                </path>
                <path d="M5 12H19">
                  <animate
                    fill="freeze"
                    attributeName="stroke-dashoffset"
                    dur="0.3s"
                    values="18;0"
                  />
                </path>
              </g>
            </svg>
          }
          onClick={() => NProgress.start()}
        >
          Создать аккаунт
        </Button>
      </Link>
      <Link href="/login">
        <Button
          variant="outlined"
          color="inherit"
          size="large"
          startIcon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <g
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="2"
              >
                <path
                  strokeDasharray="32"
                  strokeDashoffset="32"
                  d="M13 4L20 4C20.5523 4 21 4.44772 21 5V19C21 19.5523 20.5523 20 20 20H13"
                >
                  <animate
                    fill="freeze"
                    attributeName="stroke-dashoffset"
                    dur="0.4s"
                    values="32;0"
                  />
                </path>
                <path
                  strokeDasharray="12"
                  strokeDashoffset="12"
                  d="M3 12h11.5"
                  opacity="0"
                >
                  <set attributeName="opacity" begin="0.5s" to="1" />
                  <animate
                    fill="freeze"
                    attributeName="stroke-dashoffset"
                    begin="0.5s"
                    dur="0.2s"
                    values="12;0"
                  />
                </path>
                <path
                  strokeDasharray="6"
                  strokeDashoffset="6"
                  d="M14.5 12l-3.5 -3.5M14.5 12l-3.5 3.5"
                  opacity="0"
                >
                  <set attributeName="opacity" begin="0.7s" to="1" />
                  <animate
                    fill="freeze"
                    attributeName="stroke-dashoffset"
                    begin="0.7s"
                    dur="0.2s"
                    values="6;0"
                  />
                </path>
              </g>
            </svg>
          }
          onClick={() => NProgress.start()}
        >
          Войти
        </Button>
      </Link>
    </>
  );
}

export function FooterButtons() {
  const { status } = useSession();

  return (
    <>
      <Link href={status === "authenticated" ? "/my/overview" : "/register"}>
        <Button
          variant="contained"
          color="inherit"
          size="medium"
          disableElevation
          fullWidth
          startIcon={<Iconify icon="line-md:play-filled" />}
          onClick={() => NProgress.start()}
          sx={{
            height: "48px",
            borderRadius: "24px",
          }}
        >
          Начать
        </Button>
      </Link>
      <Link href="/faq">
        <Button
          variant="outlined"
          color="inherit"
          size="medium"
          disableElevation
          fullWidth
          startIcon={<Iconify icon="line-md:question-circle" />}
          onClick={() => NProgress.start()}
          sx={{
            height: "48px",
          }}
        >
          Часто задаваемые вопросы
        </Button>
      </Link>
    </>
  );
}
