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
    const product = await client.product.findUnique({
      where: {
      },
    });
    const chats = await client.chatRoom.findFirst({
        where: {
          seller: {
            id: product?.sellerId,
          },
          purchaser: {
            id: user?.id,
          },
        },
        include:{
          purchaser:true,
          seller:true,

        }
      })
    res.json({
      ok: true,
      chats,
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
        },
      })
    );

    if (alreadyExistsChats) {
      res.json({
        ok: false,
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
