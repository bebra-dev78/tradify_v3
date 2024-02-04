"use server";

import crypto from "crypto";

import prisma from "#/utils/prisma";

export async function createBynanceTrades(
  symbols,
  apiKey,
  secretKey,
  kid,
  uid,
  startTime
) {
  try {
    const t = await fetch("https://fapi.binance.com/fapi/v1/time", {
      cache: "no-cache",
    });

    const { serverTime } = await t.json();

    var deals = await Promise.all(
      symbols.map(async (symbol) => {
        const chunks = [];
        const symbolTrades = [];

        for (let start = startTime; start < serverTime; start += 604800000) {
          const end = Math.min(start + 604800000, serverTime);

          chunks.push(
            fetch(
              `https://fapi.binance.com/fapi/v1/userTrades?symbol=${symbol}&timestamp=${serverTime}&signature=${crypto
                .createHmac("sha256", secretKey)
                .update(
                  `symbol=${symbol}&timestamp=${serverTime}&recvWindow=60000&startTime=${start}&endTime=${end}`
                )
                .digest(
                  "hex"
                )}&recvWindow=60000&startTime=${start}&endTime=${end}`,
              {
                headers: {
                  "X-MBX-APIKEY": apiKey,
                },
                cache: "no-cache",
              }
            )
          );
        }

        for (const chunk of await Promise.all(chunks)) {
          symbolTrades.push(await chunk.json());
        }

        return symbolTrades;
      })
    );

    var trades = [];

    deals
      .flat()
      .filter((t) => t.length)
      .forEach((deal) => {
        let currentTrade = [];

        for (let i = 0; i < deal.length; i++) {
          const currentTradeEmpty = currentTrade.length === 0;
          const isClosingTrade =
            i === deal.length - 1 ||
            (i < deal.length - 1 &&
              parseFloat(deal[i].realizedPnl) !== 0 &&
              parseFloat(deal[i + 1].realizedPnl) === 0);
          const isOpeningTrade =
            i === 0 ||
            (i > 0 &&
              parseFloat(deal[i].realizedPnl) === 0 &&
              parseFloat(deal[i - 1].realizedPnl) !== 0);

          if (currentTradeEmpty || isOpeningTrade) {
            currentTrade.push(deal[i]);
          } else if (isClosingTrade) {
            currentTrade.push(deal[i]);
            trades.push([...currentTrade]);
            currentTrade = [];
          } else {
            currentTrade.push(deal[i]);
          }
        }
      });

    const data = trades.flatMap((trade) => {
      var b = trade.filter((t) => t.side === "BUY");
      var s = trade.filter((t) => t.side === "SELL");
      var bt = b.reduce((a, c) => a + parseFloat(c.qty), 0);
      var st = s.reduce((a, c) => a + parseFloat(c.qty), 0);
      var bv = b.reduce((a, c) => a + parseFloat(c.quoteQty), 0);
      var sv = s.reduce((a, c) => a + parseFloat(c.quoteQty), 0);
      return {
        uid,
        kid,
        exchange: 1,
        symbol: trade[0].symbol,
        entry_time: String(trade[0].time),
        exit_time: String(trade[trade.length - 1].time),
        average_entry_price:
          b.reduce((a, c) => a + parseFloat(c.price) * parseFloat(c.qty), 0) /
          bt,
        average_exit_price:
          s.reduce((a, c) => a + parseFloat(c.price) * parseFloat(c.qty), 0) /
          st,
        side: trade[0].side,
        procent: (sv / st - bv / bt) / (bv / bt),
        income: trade.reduce((a, c) => a + parseFloat(c.realizedPnl), 0),
        turnover: bt + st,
        max_volume: Math.max(
          bt + st,
          Math.max(
            ...b.map((b) => parseFloat(b.qty)),
            ...s.map((s) => parseFloat(s.qty))
          )
        ),
        volume: trade.reduce(
          (a, d) => a + parseFloat(d.price) * parseFloat(d.qty),
          0
        ),
        comission: Number(
          trade.reduce((a, d) => a + parseFloat(d.commission), 0)
        ),
      };
    });

    await prisma.trades.createMany({
      data,
    });

    return data;
  } catch (e) {
    console.log("e: ", e);
    return null;
  }
}

export async function createBybitTrades(data) {
  try {
    await prisma.trades.createMany({
      data,
    });
    return 200;
  } catch (e) {
    console.log("e: ", e);
    return null;
  }
}

export async function getTrades(uid) {
  try {
    return await prisma.trades.findMany({
      where: { uid },
    });
  } catch (e) {
    return null;
  }
}

export async function updateRating(id, rating) {
  try {
    await prisma.trades.update({
      where: { id },
      data: {
        rating,
      },
    });
  } catch (e) {
    return null;
  }
}

export async function updateTags(id, tags) {
  try {
    await prisma.trades.update({
      where: { id },
      data: {
        tags,
      },
    });
  } catch (e) {
    return null;
  }
}
