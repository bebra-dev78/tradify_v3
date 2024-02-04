"use client";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import { useState } from "react";

import TabsContent from "#/client/My/Account/tabs-content";
import IconBox from "#/client/Shared/icon-box";
import Iconify from "#/utils/iconify";

export default function TabsWrapper() {
  const [value, setValue] = useState(0);

  return (
    <>
      <Tabs
        value={value}
        onChange={(e, n) => setValue(n)}
        sx={{
          "& .MuiTab-root.Mui-selected": {
            color: "text.primary",
          },
          "& .MuiTabs-indicator": {
            backgroundColor: "text.primary",
          },
        }}
      >
        <Tab
          label="Основное"
          disableTouchRipple
          iconPosition="start"
          icon={<Iconify icon="solar:user-id-bold" sx={{ mr: "8px" }} />}
        />
        <Tab
          label="Ключи"
          disableTouchRipple
          iconPosition="start"
          icon={
            <Iconify
              icon="solar:key-minimalistic-square-bold"
              sx={{ mr: "8px" }}
            />
          }
        />
        <Tab
          label="Безопасность"
          disableTouchRipple
          iconPosition="start"
          icon={<IconBox iconUrl="/svg/security.svg/" iconMarginRight="8px" />}
        />
      </Tabs>
      <div style={{ marginBottom: "40px" }} />
      <TabsContent value={value} />
    </>
  );
}
