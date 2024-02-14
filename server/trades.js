"use server";

import crypto from "crypto";

import prisma from "#/utils/prisma";

export async function createBynanceTrades(
  uid,
  kid,
  apiKey,
  symbols,
  secretKey,
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
                  `symbol=${symbol}&timestamp=${serverTime}&recvWindow=60000&limit=1000&startTime=${start}&endTime=${end}`
                )
                .digest(
                  "hex"
                )}&recvWindow=60000&limit=1000&startTime=${start}&endTime=${end}`,
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

    await prisma.trades.createMany({
      data: trades.flatMap((trade) => {
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
          side: trade[0].side,
          procent: (((sv / st - bv / bt) / (bv / bt)) * 100).toFixed(2),
          income: trade
            .reduce((a, c) => a + parseFloat(c.realizedPnl), 0)
            .toFixed(3),
          turnover: ((bt + st) / 2).toFixed(1),
          max_volume: (
            Math.max(
              bt + st,
              Math.max(
                ...b.map((b) => parseFloat(b.qty)),
                ...s.map((s) => parseFloat(s.qty))
              )
            ) / 2
          ).toFixed(1),
          volume: (
            trade.reduce(
              (a, d) => a + parseFloat(d.price) * parseFloat(d.qty),
              0
            ) / 2
          ).toFixed(2),
          comission: trade
            .reduce((a, d) => a + parseFloat(d.commission), 0)
            .toFixed(3),
          avg_entry_price: (
            b.reduce((a, c) => a + parseFloat(c.price) * parseFloat(c.qty), 0) /
            bt
          ).toFixed(4),
          avg_exit_price: (
            s.reduce((a, c) => a + parseFloat(c.price) * parseFloat(c.qty), 0) /
            st
          ).toFixed(4),
          duration: String(trade[trade.length - 1].time - trade[0].time),
        };
      }),
    });
    return 200;
  } catch (e) {
    console.log("Какая-то хуйня в функции createBynanceTrades: ", e);
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
    console.log("Какая-то хуйня в функции createBybitTrades: ", e);
    return null;
  }
}

export async function getTrades(uid) {
  try {
    return await prisma.trades.findMany({
      where: { uid },
    });
  } catch (e) {
    console.log("Какая-то хуйня в функции getTrades: ", e);
    return [];
  }
}

export async function updateBynanceTrades(
  uid,
  kid,
  apiKey,
  symbols,
  secretKey,
  startTime
) {
  try {
    const t = await fetch("https://fapi.binance.com/fapi/v1/time", {
      cache: "no-cache",
    });

    const { serverTime } = await t.json();

    var deals = await Promise.all(
      symbols.map(async (symbol) => {
        const chunk = await fetch(
          `https://fapi.binance.com/fapi/v1/userTrades?symbol=${symbol}&timestamp=${serverTime}&signature=${crypto
            .createHmac("sha256", secretKey)
            .update(
              `symbol=${symbol}&timestamp=${serverTime}&recvWindow=60000&limit=1000&startTime=${startTime}`
            )
            .digest("hex")}&recvWindow=60000&limit=1000&startTime=${startTime}`,
          {
            headers: {
              "X-MBX-APIKEY": apiKey,
            },
            cache: "no-cache",
          }
        );
        return await chunk.json();
      })
    );

    var trades = [];

    deals
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

    if (trades.length > 0) {
      return await Promise.all(
        trades.map(async (trade) => {
          var b = trade.filter((t) => t.side === "BUY");
          var s = trade.filter((t) => t.side === "SELL");
          var bt = b.reduce((a, c) => a + parseFloat(c.qty), 0);
          var st = s.reduce((a, c) => a + parseFloat(c.qty), 0);
          var bv = b.reduce((a, c) => a + parseFloat(c.quoteQty), 0);
          var sv = s.reduce((a, c) => a + parseFloat(c.quoteQty), 0);
          return await prisma.trades.create({
            data: {
              uid,
              kid,
              exchange: 1,
              symbol: trade[0].symbol,
              entry_time: String(trade[0].time),
              exit_time: String(trade[trade.length - 1].time),
              side: trade[0].side,
              procent: (((sv / st - bv / bt) / (bv / bt)) * 100).toFixed(2),
              income: trade
                .reduce((a, c) => a + parseFloat(c.realizedPnl), 0)
                .toFixed(3),
              turnover: ((bt + st) / 2).toFixed(1),
              max_volume: (
                Math.max(
                  bt + st,
                  Math.max(
                    ...b.map((b) => parseFloat(b.qty)),
                    ...s.map((s) => parseFloat(s.qty))
                  )
                ) / 2
              ).toFixed(1),
              volume: (
                trade.reduce(
                  (a, d) => a + parseFloat(d.price) * parseFloat(d.qty),
                  0
                ) / 2
              ).toFixed(2),
              comission: trade
                .reduce((a, d) => a + parseFloat(d.commission), 0)
                .toFixed(3),
              avg_entry_price: (
                b.reduce(
                  (a, c) => a + parseFloat(c.price) * parseFloat(c.qty),
                  0
                ) / bt
              ).toFixed(4),
              avg_exit_price: (
                s.reduce(
                  (a, c) => a + parseFloat(c.price) * parseFloat(c.qty),
                  0
                ) / st
              ).toFixed(4),
              duration: String(trade[trade.length - 1].time - trade[0].time),
            },
          });
        })
      );
    } else {
      return [];
    }
  } catch (e) {
    console.log("Какая-то хуйня в функции updateBynanceTrades: ", e);
    return null;
  }
}

export async function updateBybitTrades(data) {
  try {
    return await Promise.all(
      data.map(
        async (trade) =>
          await prisma.trades.create({
            data: trade,
          })
      )
    );
  } catch (e) {
    console.log("Какая-то хуйня в функции updateBybitTrades: ", e);
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
    console.log("Какая-то хуйня в функции updateRating:", e);
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
    console.log("Какая-то хуйня в функции updateTags:", e);
    return null;
  }
}

export async function updateDefaultTrade(id, data) {
  try {
    return await prisma.trades.update({
      where: { id },
      data,
    });
  } catch (e) {
    console.log("Какая-то хуйня в функции createDefaultTrade: ", e);
    return null;
  }
}

export async function deleteTrades(ids) {
  try {
    await prisma.trades.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  } catch (e) {
    console.log("Какая-то хуйня в функции deleteTrades:", e);
    return null;
  }
}
