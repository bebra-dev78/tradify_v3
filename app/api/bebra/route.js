import { getServerSession } from "next-auth/next";

import { authConfig } from "#/utils/auth";
import prisma from "#/utils/prisma";

export async function GET() {
  const s = await getServerSession(authConfig);
  return Response.json(
    s !== null
      ? await prisma.users.findUnique({
          where: { email: s.user.email },
        })
      : null
  );
}
