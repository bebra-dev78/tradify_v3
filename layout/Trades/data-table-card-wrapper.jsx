"use client";

import IconButton from "@mui/material/IconButton";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import Collapse from "@mui/material/Collapse";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";

import { useState } from "react";

import Iconify from "#/utils/iconify";

export default function DataTableCardContent({ children }) {
  const [openInfo, setOpenInfo] = useState(false);

  return (
    <Card>
      <CardHeader
        title="Таблица сделок"
        action={
          <IconButton onClick={() => setOpenInfo((prev) => !prev)}>
            <Iconify icon="solar:info-circle-linear" color="text.disabled" />
          </IconButton>
        }
        sx={{
          p: "24px 24px 0px",
          mb: "16px",
        }}
      />
      <Collapse in={openInfo} timeout="auto" unmountOnExit>
        <Typography sx={{ p: "24px", color: "text.secondary" }}>
          Здесь вы можете просмотреть историю своих сделок и проанализировать
          их, взаимодействуя с ними или добавляя дополнительную информацию. Для
          открытия свечного графика по определённому тикеру нажмите на название
          нужного тикера. Чтобы горизонтально перемещаться по таблице Вы можете
          использовать нижний скролл или зажать клавишу{" "}
          <Box
            component="span"
            sx={{
              height: "24px",
              minWidth: "24px",
              lineHeight: 0,
              borderRadius: "6px",
              cursor: "default",
              WebkitBoxAlign: "center",
              alignItems: "center",
              whiteSpace: "nowrap",
              display: "inline-flex",
              WebkitBoxPack: "center",
              justifyContent: "center",
              textTransform: "capitalize",
              padding: "0px 6px",
              fontWeight: 700,
              transition: "all 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
              backgroundColor: "rgba(145, 158, 171, 0.16)",
              fontSize: "12px",
              color: "rgb(145, 158, 171)",
            }}
          >
            Shift
          </Box>{" "}
          и использовать колёсико мыши.
        </Typography>
      </Collapse>
      {children}
    </Card>
  );
}
