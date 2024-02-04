"use client";

import Typography from "@mui/material/Typography";

import { keyframes } from "@emotion/react";

export default function SmoothAnimation() {
  return (
    <>
      <Typography
        variant="h1"
        sx={{
          animation: `${keyframes`
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        `} 0.3s ease-in-out forwards`,
        }}
      >
        Трейдинг
        <br />
        Крипта
        <br />
        <Typography
          variant="h1"
          component="span"
          sx={{
            color: "primary.main",
            animation: `${keyframes`
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          `} 0.6s ease-in-out forwards`,
          }}
        >
          Бабосики
        </Typography>
      </Typography>
      <Typography
        variant="body1"
        sx={{
          animation: `${keyframes`
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        `} 0.8s ease-in-out forwards`,
        }}
      >
        Современный
        <Typography
          component="strong"
          sx={{
            color: "primary.main",
            fontWeight: 600,
            animation: `${keyframes`
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          `} 1s ease-in-out forwards`,
          }}
        >
          {" "}
          днеуник трецдера{" "}
        </Typography>
        крипта крипта бабосики 암호 화폐 상인 일기 섹스 토마토 푸틴 암호 화폐
        상인 일기 섹스 토마토 푸틴 암호 화폐 상인 일기 섹스 토마토 푸틴 암호
        화폐 상인 일기 섹스 토마토 푸틴 암호 화폐 상인 일기 섹스 토마토 푸틴
      </Typography>
    </>
  );
}
