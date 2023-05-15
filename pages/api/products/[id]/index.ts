import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    query: { id },
    session: { user },
  } = req;
  const product = await client.product.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      seller: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  });

  const terms = product?.name.split(" ").map((word) => ({
    name: {
      contains: word,
    },
  }));

  const relatedProducts = await client.product.findMany({
    where: {
      OR: terms,
      AND: {
        id: {
          not: Number(id),
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 6,
  });

  const isFavorite = Boolean(
    await client.record.findFirst({
      where: {
        kind:"Favorite",
        productId: product?.id,
        userId: user?.id,
      },
      select: {
        id: true,
      },
    })
  );

  const myChatRoom = await client.chatRoom.findFirst({
    where:{
      productId:Number(id),
      purchaserId:user?.id
    }
  })
  const myChatRoomId = myChatRoom?.id

  res.json({
    ok: true,
    product,
    relatedProducts,
    isFavorite,
    myChatRoomId,
  });
}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
  })
);
