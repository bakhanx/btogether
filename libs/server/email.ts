import nodemailer from "nodemailer";

const sendMail = async (toMail: string, payload: string) => {

  const smtpTransport = nodemailer.createTransport({
    service: "Naver",
    host: "smtp.naver.com",
    port: 587,
    secure:false,
    requireTLS: true,
    auth: {
      user: process.env.MAIL_ID,
      pass: process.env.MAIL_PASSWORD,
    },
    // tls: {
    //   rejectUnauthorized: false,
    // },
  });

  const mailOptions = {
    from: process.env.MAIL_ID,
    to: toMail,
    subject: "B-Together 계정 인증 메일입니다.",
    text: `인증 코드 : ${payload}`,
    html: `<strong>인증 코드 : ${payload}</strong>`,
  };
  console.log("smtpTransport : ",smtpTransport)
  console.log("mailOptions : ", mailOptions);

  await new Promise((resolve,  reject) =>{
    return smtpTransport.sendMail(
      mailOptions,
      (error, response) => {
        console.log("전송중");
        if (error) {
          reject(error);
          console.log("error : ", error);
          return null;
        } else {
         resolve(response)
         console.log("response : ", response);
          return null;
        }
        
      }
    );
  })
  console.log("smtp close 시작");
  smtpTransport.close();
  console.log("smtp close 완료")
};

export default sendMail;
