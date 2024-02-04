"use client";

import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import NProgress from "nprogress";
import Link from "next/link";
import crypto from "crypto";
import axios from "axios";

export default function AccountLink({ username, keys }) {
  const pathname = usePathname();

  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const key1 = keys.filter((key) => key.exchange === 1)[0];
    const key2 = keys.filter((key) => key.exchange === 2)[0];
    switch (true) {
      case keys.length === 1 && key1 !== undefined:
        axios.get("https://fapi.binance.com/fapi/v1/time").then(({ data }) => {
          axios
            .get("https://fapi.binance.com/fapi/v2/account", {
              headers: {
                "X-MBX-APIKEY": key1.api_key,
              },
              params: {
                timestamp: data.serverTime,
                signature: crypto
                  .createHmac("sha256", key1.secret_key)
                  .update(`timestamp=${data.serverTime}&recvWindow=60000`)
                  .digest("hex"),
                recvWindow: 60000,
              },
            })
            .then(({ data }) => {
              setBalance(parseFloat(data.totalWalletBalance));
            });
        });
        break;

      case keys.length === 1 && key2 !== undefined:
        axios.get("https://api.bybit.com/v5/market/time").then(({ data }) => {
          axios
            .get(
              "https://api.bybit.com/v5/account/wallet-balance?accountType=UNIFIED",
              {
                headers: {
                  "X-BAPI-SIGN": crypto
                    .createHmac("sha256", key2.secret_key)
                    .update(
                      data.time + key2.api_key + 60000 + "accountType=UNIFIED"
                    )
                    .digest("hex"),
                  "X-BAPI-API-KEY": key2.api_key,
                  "X-BAPI-TIMESTAMP": data.time,
                  "X-BAPI-RECV-WINDOW": 60000,
                },
              }
            )
            .then(({ data }) => {
              setBalance(parseFloat(data.result.list[0].totalWalletBalance));
            });
        });
        break;

      case keys.length === 2:
        (async () => {
          const binanceTime = await axios
            .get("https://fapi.binance.com/fapi/v1/time")
            .then(({ data }) => data.serverTime);
          const bybitTime = await axios
            .get("https://api.bybit.com/v5/market/time")
            .then(({ data }) => data.time);
          const [b1, b2] = await Promise.all([
            axios
              .get("https://fapi.binance.com/fapi/v2/account", {
                headers: {
                  "X-MBX-APIKEY": key1.api_key,
                },
                params: {
                  timestamp: binanceTime,
                  signature: crypto
                    .createHmac("sha256", key1.secret_key)
                    .update(`timestamp=${binanceTime}&recvWindow=60000`)
                    .digest("hex"),
                  recvWindow: 60000,
                },
              })
              .then(({ data }) => data),
            axios.get(
              "https://api.bybit.com/v5/account/wallet-balance?accountType=UNIFIED",
              {
                headers: {
                  "X-BAPI-SIGN": crypto
                    .createHmac("sha256", key2.secret_key)
                    .update(
                      bybitTime + key2.api_key + 60000 + "accountType=UNIFIED"
                    )
                    .digest("hex"),
                  "X-BAPI-API-KEY": key2.api_key,
                  "X-BAPI-TIMESTAMP": bybitTime,
                  "X-BAPI-RECV-WINDOW": 60000,
                },
              }
            ),
          ]);
          setBalance(
            parseFloat(b1.totalWalletBalance) +
              parseFloat(b2.data.result.list[0].totalWalletBalance)
          );
        })();
        break;

      default:
        setBalance(0);
        break;
    }
  }, [keys]);

  return (
    <Link
      href="/my/account"
      onClick={() => pathname !== "/my/account" && NProgress.start()}
      style={{ margin: "20px 24px 24px 24px" }}
    >
      <Box
        sx={{
          p: "16px 20px",
          display: "flex",
          alignItems: "center",
          borderRadius: "12px",
          justifyContent: "space-between",
          transition: "opacity 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
          backgroundColor:
            pathname === "/my/account"
              ? "rgba(0, 167, 111, 0.16)"
              : "rgba(145, 158, 171, 0.12)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar>{username?.charAt(0).toUpperCase()}</Avatar>
          <Box
            sx={{
              ml: "16px",
              minWidth: "0px",
            }}
          >
            <Typography
              variant="subtitle2"
              noWrap
              sx={{ color: "text.primary" }}
            >
              {username ?? "."}
            </Typography>
            <Typography variant="body2" noWrap sx={{ color: "text.secondary" }}>
              ${balance.toFixed(2)}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Link>
  );
}
