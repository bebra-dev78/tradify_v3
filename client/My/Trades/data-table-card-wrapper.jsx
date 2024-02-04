"use client";

import IconButton from "@mui/material/IconButton";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import Collapse from "@mui/material/Collapse";
import Card from "@mui/material/Card";

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
            <Iconify
              icon="solar:info-circle-linear"
              sx={{ color: openInfo ? "secondary.main" : "text.secondary" }}
            />
          </IconButton>
        }
        sx={{
          p: "24px 24px 0px",
          mb: "16px",
        }}
      />
      <Collapse in={openInfo} timeout="auto" unmountOnExit>
        <Typography sx={{ p: "24px", color: "text.secondary" }}>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sint,
          eligendi nemo recusandae maxime dicta exercitationem quod excepturi
          expedita. Id possimus rerum eveniet, odit, quis, dolor excepturi minus
          dolore voluptatem provident cupiditate! Quos fugiat dolorum sed
          voluptas, in, repellendus deleniti explicabo consequuntur aspernatur
          reiciendis perspiciatis quam at autem similique qui facere?
        </Typography>
      </Collapse>
      {children}
    </Card>
  );
}
