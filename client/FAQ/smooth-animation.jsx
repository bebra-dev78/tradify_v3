"use client";

import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";

import { keyframes } from "@emotion/react";
import Image from "next/image";

import woman_1 from "#/public/images/woman_1.png";

export default function SmoothAnimation() {
  return (
    <>
      <Stack
        sx={{
          gap: "24px",
          zIndex: 1,
          "@media (max-width: 900px)": {
            textAlign: "center",
          },
          "@media (min-width: 900px)": {
            animation: `${keyframes`
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        `} 0.5s ease-in-out forwards`,
          },
        }}
      >
        <Typography variant="h1" sx={{ zIndex: 1, color: "text.primary" }}>
          FAQ
        </Typography>
        <Typography
          variant="h6"
          sx={{ color: "text.secondary", zIndex: 1, fontWeight: 500 }}
        >
          В этом справочном разделе Вы найдёте всю основную информацию
          <br />
          для понятия устройства сервиса
        </Typography>
      </Stack>
      <Box
        sx={{
          zIndex: 1,
          "@media (max-width: 900px)": {
            display: "none",
          },
          animation: `${keyframes`
          from {
            opacity: 0;
            transform: translateY(-50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        `} 0.5s ease-in-out forwards`,
        }}
      >
        <Image src={woman_1} priority={true} alt="FAQ" />
      </Box>
    </>
  );
}
