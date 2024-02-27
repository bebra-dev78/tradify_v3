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
        Начните свою
        <br />
        торговлю
        <br />с{" "}
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
          Tradify
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
        Революционный
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
          дневник трейдера
        </Typography>
        , предназначенный для улучшения стратегии вашей торговли.
        Регистрируйтесь, подключайте криптобиржи и ведите детальный журнал
        сделок – всё в одном месте для успешного трейдинга.
      </Typography>
    </>
  );
}
