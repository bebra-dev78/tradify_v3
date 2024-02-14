"use server";

import prisma from "#/utils/prisma";

export async function createKey(uid, api_key, secret_key, title, exchange) {
  try {
    return await prisma.keys.create({
      data: {
        uid,
        api_key,
        secret_key,
        title,
        exchange,
      },
    });
  } catch (e) {
    return null;
  }
}

export async function getKeys(uid) {
  try {
    return await prisma.keys.findMany({
      where: { uid },
    });
  } catch (e) {
    return null;
  }
}

export async function updateTitle(id, title) {
  try {
    await prisma.keys.update({
      where: { id },
      data: {
        title,
      },
    });
  } catch (e) {
    return null;
  }
}

export async function deleteKey(kid) {
  try {
    await prisma.trades.deleteMany({
      where: { kid },
    });
    await prisma.keys.delete({
      where: { id: kid },
    });
  } catch (e) {
    return null;
  }
}
