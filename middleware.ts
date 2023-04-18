import { NextResponse, userAgent } from "next/server";
import type { NextFetchEvent, NextRequest } from "next/server";

const COOKIE_SESSION_NAME = "btsession";

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

export function middleware(req: NextRequest, ev: NextFetchEvent) {
  console.log("global middleware");

  const ua = userAgent(req);

  // 봇 체크
  if (ua.isBot) {
    return new Response("You are a bot! Get out here!", { status: 403 });
  }

  // 로그인 세션 체크
  if (!req.nextUrl.pathname.startsWith("/api")) {
    if (!req.cookies.get(COOKIE_SESSION_NAME) && !req.url.includes("/enter")) {
      console.log("미들웨어 세션체크중");
      return NextResponse.redirect(new URL("/enter", req.url));
    }
  }

  // 디바이스체크
  const viewport = ua.device.type === "mobile" ? "mobile" : "desktop";
  // 채팅
  if (req.nextUrl.pathname.startsWith("/chats")) {
    console.log("chat middleware");
  }
}
