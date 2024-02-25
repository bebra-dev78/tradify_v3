"use client";

import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import Tooltip from "@mui/material/Tooltip";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";

import useSWRImmutable from "swr/immutable";
import { DateTime } from "luxon";
import { useMemo } from "react";

import Iconify from "#/utils/iconify";

export default function ProfitItem() {
  const { data, isLoading } = useSWRImmutable("null");

  const [current, diff] = useMemo(() => {
    if (data) {
      const now = Date.now();

      const counter = data
        .filter(
          (trade) => now - parseInt(trade.entry_time) <= 24 * 60 * 60 * 1000
        )
        .reduce(
          (acc, trade) =>
            acc + (parseFloat(trade.income) - parseFloat(trade.comission)),
          0
        );

      const subCounter = data
        .filter((trade) => {
          const entryTime = parseInt(trade.entry_time);
          return (
            now - entryTime > 24 * 60 * 60 * 1000 &&
            now - entryTime <= 48 * 60 * 60 * 1000
          );
        })
        .reduce(
          (acc, trade) =>
            acc + (parseFloat(trade.income) - parseFloat(trade.comission)),
          0
        );

      return [counter.toFixed(2), (counter - subCounter).toFixed(2)];
    } else {
      return [0, 0];
    }
  }, [data]);

  return isLoading ? (
    <Skeleton sx={{ height: 166 }} />
  ) : (
    <Card
      sx={{
        padding: "24px",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Box sx={{ flexGrow: "1" }}>
        <Typography variant="subtitle2">Прибыль</Typography>
        <Stack
          sx={{
            gap: "8px",
            marginTop: "16px",
            marginBottom: "8px",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          {diff < 0 ? (
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
            title={`Изменение прибыли относительно вчера в ${DateTime.now().toFormat(
              "HH:mm"
            )}`}
            arrow
            placement="right-start"
          >
            {diff < 0 ? (
              <Typography
                variant="subtitle2"
                sx={{ color: "error.main", cursor: "default" }}
              >
                {diff}$
              </Typography>
            ) : (
              <Typography
                variant="subtitle2"
                sx={{ color: "success.main", cursor: "default" }}
              >
                +{diff}$
              </Typography>
            )}
          </Tooltip>
        </Stack>
        <Stack>
          <Typography variant="h3">{current}$</Typography>
        </Stack>
      </Box>
    </Card>
  );
}
