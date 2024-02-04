"use client";

import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";

import Annotations from "#/client/My/Trades/tools/annotations";
import Figures from "#/client/My/Trades/tools/figures";
import Lines from "#/client/My/Trades/tools/lines";
import Cuts from "#/client/My/Trades/tools/cuts";

export default function KlinesChartOverlaysToolsbar({ addOverlay }) {
  return (
    <Stack
      id="container"
      sx={{ gap: "4px", pt: "4px", pb: "4px", borderRadius: "16px" }}
    >
      <Lines addOverlay={addOverlay} />
      <Divider />
      <Figures addOverlay={addOverlay} />
      <Divider />
      <Annotations addOverlay={addOverlay} />
      <Divider />
      <Cuts addOverlay={addOverlay} />
    </Stack>
  );
}
