"use client";

import useMediaQuery from "@mui/material/useMediaQuery";
import Box from "@mui/material/Box";

import { useState, useEffect, useContext, createContext } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { SWRConfig } from "swr";

import FullDesktopNav from "#/layout/full-desktop-nav";
import MiniDesktopNav from "#/layout/mini-desktop-nav";
import Header from "#/layout/header";

const BottomNav = dynamic(() => import("#/layout/bottom-nav"));

const UserContext = createContext();
const KeysContext = createContext();

export default function MyLayout({ children }) {
  const isSmallScreen = useMediaQuery("(max-width:600px)");
  const isBigScreen = useMediaQuery("(min-width:1200px)");
  const router = useRouter();

  const [openSidebar, setOpenSidebar] = useState(true);
  const [stretch, setStretch] = useState(true);
  const [user, setUser] = useState(null);
  const [keys, setKeys] = useState(null);

  useEffect(() => {
    fetch("/api/bebra")
      .then((res) => res.json())
      .then((data) => {
        if (data === null) {
          setUser(false);
        } else {
          setUser(data[0]);
          setKeys(data[1]);
        }
      });
    setOpenSidebar(JSON.parse(localStorage.getItem("sidebar")) ?? true);
    setStretch(JSON.parse(localStorage.getItem("stretch")) ?? true);
  }, []);

  if (user === false) {
    router.push("/login");
  } else if (user !== null) {
    return (
      <>
        <Header
          keys={keys}
          id={user.id}
          stretch={stretch}
          email={user.email}
          unread={user.unread}
          username={user.name}
          setStretch={setStretch}
          openSidebar={openSidebar}
        />
        <Box
          sx={{
            "@media (min-width: 1200px)": {
              display: "flex",
              minHeight: "100%",
            },
          }}
        >
          <Box
            component="nav"
            sx={{
              "@media (min-width: 1200px)": {
                flexShrink: 0,
                width: openSidebar ? "280px" : "90px",
              },
            }}
          >
            {isBigScreen &&
              (openSidebar ? (
                <FullDesktopNav
                  setOpenSidebar={setOpenSidebar}
                  username={user.name}
                  keys={keys}
                />
              ) : (
                <MiniDesktopNav setOpenSidebar={setOpenSidebar} />
              ))}
          </Box>
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              "@media (min-width: 1200px)": {
                pl: "16px",
                pr: "16px",
                pt: "100px",
                width: "calc(100% - 280px)",
                pb: "calc(76px + env(safe-area-inset-bottom))",
              },
              "@media (max-width: 1200px)": {
                pt: "calc(72px + env(safe-area-inset-top))",
                pb: "calc(72px + env(safe-area-inset-top))",
              },
            }}
          >
            <Box
              sx={{
                mr: "auto",
                ml: "auto",
                pl: "16px",
                pr: "16px",
                width: "100%",
                display: "block",
                boxSizing: "border-box",
                "@media (min-width: 600px)": {
                  pl: "24px",
                  pr: "24px",
                },
                "@media (min-width: 1600px)": {
                  maxWidth: stretch ? "1600px" : "100%",
                },
              }}
            >
              <UserContext.Provider value={{ user, setUser }}>
                <KeysContext.Provider value={{ keys, setKeys }}>
                  <SWRConfig
                    value={{
                      fetcher: () =>
                        fetch(`/api/aboba?uid=${user.id}`).then((res) =>
                          res.json()
                        ),
                    }}
                  >
                    {children}
                  </SWRConfig>
                </KeysContext.Provider>
              </UserContext.Provider>
            </Box>
          </Box>
          {isSmallScreen && <BottomNav />}
        </Box>
      </>
    );
  }
}

export function useUser() {
  return useContext(UserContext);
}

export function useKeys() {
  return useContext(KeysContext);
}
