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

  const product = client.product.findUnique({
    where:{
        id:Number(id),
    },
    select:{
        id:true
    }            
  })

  if(!product) {
    return res.status(404).end();
  }

  const alreadyExists = await client.favorite.findFirst({
    where: {
      productId: Number(id),
      userId: user?.id,
    },
  });
  if (alreadyExists) {
    await client.favorite.delete({
      where: {
        id: alreadyExists.id,
      },
    });
  } else {
    await client.favorite.create({
      data: {
        user: {
          connect: {
            id: user?.id,
          },
        },
        product: {
          connect: {
            id: Number(id),
          },
        },
      },
    });
  }

  res.json({
    ok: true,
    id,
  });
}

export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
  })
);