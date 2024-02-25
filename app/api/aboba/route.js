import prisma from "#/utils/prisma";

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  return Response.json(
    await prisma.trades.findMany({
      where: { uid: searchParams.get("uid") ?? "" },
    })
  );
}
