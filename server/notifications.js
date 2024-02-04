"use server";

import prisma from "#/utils/prisma";

export async function readNotifications(id) {
  try {
    await prisma.users.update({
      where: { id },
      data: {
        unread: 0,
      },
    });
    return 200;
  } catch (e) {
    return null;
  }
}
