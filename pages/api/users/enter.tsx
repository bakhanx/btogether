import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import sendMail from "@libs/server/email";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { phone, email } = req.body;

  const username = "guest" + Date.now().toString().slice(-5);
  let tempMail;

  if (email && email === "guest@bt.com") {
    tempMail = username + "@bt.com";
  }

  const user = phone ? { phone } : email ? { email: tempMail || email } : null;

  if (!user) {
    return res.status(400).json({ ok: false });
  }
  const payload = Math.floor(100000 + Math.random() * 900000) + "";

  const token = await client.token.create({
    data: {
      payload,
      user: {
        connectOrCreate: {
          where: {
            ...user,
          },
          create: {
            name: username,
            ...user,
          },
        },
      },
    },
  });
  console.log("Token: ", token);

  if (email === "guest@bt.com" && token) {
    console.log("guest hi");
    return res.json({
      ok: true,
      token: payload,
    });
  }

  // 임시 토큰 내 메일로
  else if (email) {
    await sendMail(email, payload);
  }

  // else if (phone){
  //   return res.json({
  //     ok:true,
  //     token : payload,
  //   })
  // }

  // 이메일 인증
  // if (email) {
  //   const mailOptions = {
  //     from: process.env.MAIL_ID,
  //     to: email,
  //     subject: "B-Together 계정 인증 메일입니다.",
  //     text: `인증 코드 : ${payload}`,
  //     html : `<strong>인증 코드 : ${payload}</strong>`
  //   };
  //   const result = await smtpTransport.sendMail(
  //     mailOptions,
  //     (error, response) => {
  //       if (error) {
  //         console.log(error);
  //         return null;
  //       } else {
  //         console.log(response);
  //         return null;
  //       }
  //     }
  //   );
  //   smtpTransport.close();
  //   console.log(result);
  // }

  return res.json({
    ok: true,
  });
}

export default withHandler({
  methods: ["POST"],
  handler,
  isPrivate: false,
});
