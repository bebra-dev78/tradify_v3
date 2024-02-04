"use client";

import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import Tooltip from "@mui/material/Tooltip";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";

import { DateTime } from "luxon";
import { useMemo } from "react";

import Iconify from "#/utils/iconify";

export default function CommissionItem({ trades }) {
  const now = Date.now();

  const [counter, subCounter] = useMemo(
    () => [
      trades
        ?.filter(
          (trade) => now - parseInt(trade.entry_time, 10) <= 24 * 60 * 60 * 1000
        )
        .reduce((acc, trade) => acc + trade.comission, 0),
      trades
        ?.filter((trade) => {
          const entryTime = parseInt(trade.entry_time, 10);
          return (
            now - entryTime > 24 * 60 * 60 * 1000 &&
            now - entryTime <= 48 * 60 * 60 * 1000
          );
        })
        .reduce((acc, trade) => acc - trade.comission, 0),
    ],
    [trades]
  );

  return trades !== null ? (
    <Card
      sx={{
        display: "flex",
        alignItems: "center",
        padding: "24px",
      }}
    >
      <Box sx={{ flexGrow: "1" }}>
        <Typography variant="subtitle2">Комиссия</Typography>
        <Stack
          sx={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: "16px",
            marginBottom: "8px",
            gap: "8px",
          }}
        >
          {subCounter < 0 ? (
            <Iconify
              icon="solar:double-alt-arrow-down-bold-duotone"
              sx={{ color: "error.main" }}
            />
          ) : (
            <Iconify
              icon="solar:double-alt-arrow-up-bold-duotone"
              sx={{ color: "success.main" }}
            />
          )}
          <Tooltip
            title={`Изменение комиссии относительно вчера ${DateTime.now()
              .minus({ days: 1 })
              .toFormat("HH:mm")}`}
            arrow
            placement="right-start"
          >
            {subCounter < 0 ? (
              <Typography
                variant="subtitle2"
                sx={{ color: "error.main", cursor: "default" }}
              >
                {subCounter.toFixed(2)}$
              </Typography>
            ) : (
              <Typography
                variant="subtitle2"
                sx={{ color: "success.main", cursor: "default" }}
              >
                +{subCounter.toFixed(2)}$
              </Typography>
            )}
          </Tooltip>
        </Stack>
        <Stack>
          <Typography variant="h3">{counter.toFixed(2)}$</Typography>
        </Stack>
      </Box>
    </Card>
  ) : (
    <Skeleton animation="wave" sx={{ height: 166 }} />
  );
}
