"use server";

import crypto from "crypto";

import prisma from "#/utils/prisma";

export async function createBynanceTrades(
  uid,
  kid,
  apikey,
  symbols,
  secretkey,
  startTime
) {
  try {
    var { serverTime } = await fetch("https://fapi.binance.com/fapi/v1/time", {
      cache: "no-cache",
    }).then((r) => r.json());

    var deals = await Promise.all(
      symbols.map(async (symbol) => {
        var chunks = [];
        var symbolTrades = [];

        for (let start = startTime; start < serverTime; start += 604800000) {
          var end = Math.min(start + 604800000, serverTime);

          chunks.push(
            fetch(
              `https://fapi.binance.com/fapi/v1/userTrades?symbol=${symbol}&timestamp=${serverTime}&signature=${crypto
                .createHmac("sha256", secretkey)
                .update(
                  `symbol=${symbol}&timestamp=${serverTime}&recvWindow=60000&limit=1000&startTime=${start}&endTime=${end}`
                )
                .digest(
                  "hex"
                )}&recvWindow=60000&limit=1000&startTime=${start}&endTime=${end}`,
              {
                headers: {
                  "X-MBX-APIKEY": apikey,
                },
                cache: "no-cache",
              }
            )
          );
        }

        for (var chunk of await Promise.all(chunks)) {
          symbolTrades.push(await chunk.json());
        }

        return symbolTrades;
      })
    );

    var trades = [];

    deals.flat().forEach((deal) => {
      let currentTrade = [];

      for (let i = 0; i < deal.length; i++) {
        var currentTradeEmpty = currentTrade.length === 0;
        var isClosingTrade =
          i === deal.length - 1 ||
          (i < deal.length - 1 &&
            parseFloat(deal[i].realizedPnl) !== 0 &&
            parseFloat(deal[i + 1].realizedPnl) === 0);
        var isOpeningTrade =
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
      data: trades.map((trade) => {
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

export async function createBybitTrades(uid, kid, apikey, secretkey, now) {
  try {
    let cursor = "";
    var deals = [];

    var { time } = await fetch("https://api.bybit.com/v5/market/time", {
      cache: "no-cache",
    }).then((r) => r.json());

    for (let start = now - 2592000000; start < now; start += 604800000) {
      var end = Math.min(start + 604800000, now);
      do {
        await fetch(
          `https://api.bybit.com/v5/execution/list?category=linear&limit=100&startTime=${start}&endTime=${end}&cursor=${cursor}`,
          {
            headers: {
              "X-BAPI-SIGN": crypto
                .createHmac("sha256", secretkey)
                .update(
                  time +
                    apikey +
                    60000 +
                    `category=linear&limit=100&startTime=${start}&endTime=${end}&cursor=${cursor}`
                )
                .digest("hex"),
              "X-BAPI-API-KEY": apikey,
              "X-BAPI-TIMESTAMP": time,
              "X-BAPI-RECV-WINDOW": 60000,
            },
            cache: "no-cache",
          }
        ).then(async (r) => {
          var { result } = await r.json();
          cursor = result.nextPageCursor;
          deals.push(result.list);
        });
      } while (cursor !== "");
    }

    var g = deals.flat().reduce((groups, deal) => {
      if (!groups[deal.symbol]) {
        groups[deal.symbol] = [];
      }
      groups[deal.symbol].push(deal);
      return groups;
    }, {});

    for (var symbol in g) {
      g[symbol].sort((a, b) =>
        a.execTime > b.execTime ? 1 : a.execTime < b.execTime ? -1 : 0
      );
    }

    var s = Object.values(g).reduce(
      (sorted, deals) => sorted.concat(deals),
      []
    );

    var trades = [];
    let currentTrade = [];

    for (var deal of s) {
      if (
        (deal.closedSize === "0" &&
          (currentTrade.length === 0 ||
            currentTrade[currentTrade.length - 1].closedSize !== "0")) ||
        (currentTrade.length > 0 && deal.symbol !== currentTrade[0].symbol)
      ) {
        if (currentTrade.length > 0) {
          trades.push(currentTrade);
          currentTrade = [];
        }
      }

      currentTrade.push(deal);
    }

    trades.push(currentTrade);

    await prisma.trades.createMany({
      data: trades.map((trade) => {
        const b = trade.filter((t) => t.side === "Buy");
        const s = trade.filter((t) => t.side === "Sell");
        const bt = b.reduce((a, c) => a + parseFloat(c.execQty), 0);
        const st = s.reduce((a, c) => a + parseFloat(c.execQty), 0);
        const bv = b.reduce((a, c) => a + parseFloat(c.execValue), 0);
        const sv = s.reduce((a, c) => a + parseFloat(c.execValue), 0);
        return {
          uid,
          kid,
          exchange: 2,
          symbol: trade[0].symbol,
          entry_time: String(trade[0].execTime),
          exit_time: String(trade[trade.length - 1].execTime),
          side: trade[0].side === "Buy" ? "BUY" : "SELL",
          procent: (((sv / st - bv / bt) / (bv / bt)) * 100).toFixed(2),
          income: (parseFloat(sv) - parseFloat(bv)).toFixed(3),
          turnover: ((bt + st) / 2).toFixed(1),
          max_volume: (
            Math.max(
              bt + st,
              Math.max(
                ...b.map((b) => parseFloat(b.execQty)),
                ...s.map((s) => parseFloat(s.execQty))
              )
            ) / 2
          ).toFixed(1),
          volume: (
            trade.reduce((a, d) => a + parseFloat(d.execValue), 0) / 2
          ).toFixed(2),
          comission: trade
            .reduce((a, d) => a + parseFloat(d.execFee), 0)
            .toFixed(3),
          avg_entry_price: (
            b.reduce(
              (a, c) => a + parseFloat(c.execPrice) * parseFloat(c.execQty),
              0
            ) / bt
          ).toFixed(4),
          avg_exit_price: (
            s.reduce(
              (a, c) => a + parseFloat(c.execPrice) * parseFloat(c.execQty),
              0
            ) / st
          ).toFixed(4),
          duration: String(
            trade[trade.length - 1].execTime - trade[0].execTime
          ),
        };
      }),
    });

    return 200;
  } catch (e) {
    console.log("Какая-то хуйня в функции createBybitTrades: ", e);
    return null;
  }
}

export async function createDefaultTrades(data) {
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
    console.log("Какая-то хуйня в функции createDefaultTrades: ", e);
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
