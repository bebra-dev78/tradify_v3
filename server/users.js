"use server";

import prisma from "#/utils/prisma";

export async function createUser(email, name, password) {
  try {
    await prisma.users.create({
      data: {
        email,
        name,
        password,
      },
    });
    return 200;
  } catch (e) {
    return null;
  }
}

export async function updateUser(id, name, surname) {
  try {
    await prisma.users.update({
      where: {
        id,
      },
      data: {
        name,
        surname,
      },
    });
    return 200;
  } catch (e) {
    return null;
  }
}

export async function updatePassword(id, password) {
  try {
    await prisma.users.update({
      where: {
        id,
      },
      data: {
        password,
      },
    });
    return 200;
  } catch (e) {
    return null;
  }
}
