import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";
import products from "../products";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === "GET") {
    const {
      session: { user },
    } = req;
    const chatRooms = await client.chatRoom.findMany({
      where: {
        OR: [{ sellerId: user?.id }, { purchaserId: user?.id }],
      },
      include: {
        purchaser: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        seller: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        product: {
          select: {
            image: true,
          },
        },
      },
      orderBy:{
        updatedAt:"desc"
        
      }
    });

    res.json({
      ok: true,
      chatRooms,
    });
  }

  if (req.method === "POST") {
    const {
      body: { id },
      session: { user },
    } = req;

    const product = await client.product.findUnique({
      where: {
        id: Number(id),
      },
    });

    const alreadyExistsChats = Boolean(
      await client.chatRoom.findFirst({
        where: {
          seller: {
            id: product?.sellerId,
          },
          purchaser: {
            id: user?.id,
          },
          productId: Number(id),
        },
      })
    );

    if (alreadyExistsChats) {
      res.json({
        ok: false,
        alreadyExistsChats,
      });
    } else {
      const chats = await client.chatRoom.create({
        data: {
          purchaser: {
            connect: {
              id: user?.id,
            },
          },
          seller: {
            connect: {
              id: product?.sellerId,
            },
          },
          product: {
            connect: {
              id: Number(id),
            },
          },
        },
      });

      res.json({
        ok: true,
        chats,
      });
    }
  }
}

export default withApiSession(
  withHandler({
    methods: ["GET", "POST"],
    handler,
  })
);
