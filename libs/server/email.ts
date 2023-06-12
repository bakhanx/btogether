import nodemailer from "nodemailer";

const sendMail = async (toMail: string, payload: string) => {

  const smtpTransport = nodemailer.createTransport({
    service: "Naver",
    host: "smtp.naver.com",
    port: 465,
    secure:false,
    auth: {
      user: process.env.MAIL_ID,
      pass: process.env.MAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailOptions = {
    from: process.env.MAIL_ID,
    to: toMail,
    subject: "B-Together 계정 인증 메일입니다.",
    text: `인증 코드 : ${payload}`,
    html: `<strong>인증 코드 : ${payload}</strong>`,
  };

  await new Promise((resolve,  reject) =>{
    return smtpTransport.sendMail(
      mailOptions,
      (error, response) => {
        if (error) {
          reject(error);
          return null;
        } else {
         resolve(response)
          return null;
        }
      }
    );
  })

  smtpTransport.close();
};

export default sendMail;
