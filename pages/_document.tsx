import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html lang="ko">
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Dongle&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
        {/* <Script
          src="https://t1.kakaocdn.net/kakao_js_sdk/v2/kakao.min.js"
          strategy="lazyOnload"
        />

        <Script
          src="https://connect.facebook.net/en_US/sdk.js"
          onLoad={() =>
            (window.fbAsyncInit = function () {
              FB.init({
                appId: "your-app-id",
                autoLogAppEvents: true,
                xfbml: true,
                version: "v16.0",
              });
            })
          }
        /> */}
      </body>
    </Html>
  );
}
