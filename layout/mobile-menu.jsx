"use client";

import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";

import NavPaper from "#/layout/nav-paper";

import menu from "#/public/svg/menu.svg";

export default function MobileMenu({ username, keys }) {
  const pathname = usePathname();

  const [openDrawer, setOpenDrawer] = useState(false);

  useEffect(() => {
    setOpenDrawer(false);
  }, [pathname]);

  return (
    <>
      <IconButton
        onClick={() => {
          setOpenDrawer(true);
        }}
      >
        <Image src={menu} />
      </IconButton>
      <Drawer
        open={openDrawer}
        anchor="left"
        onClose={() => {
          setOpenDrawer(false);
        }}
        PaperProps={{
          sx: {
            padding: 0,
            width: "280px",
            borderRadius: 0,
          },
        }}
      >
        <NavPaper username={username} keys={keys} />
      </Drawer>
    </>
  );
}
