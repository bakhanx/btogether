import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SWRConfig } from "swr";
import useUser from "@libs/client/useUser";
import { useRouter } from "next/router";

function App({ Component, pageProps }: AppProps) {
  // Login Check ,, '/enter'
  // const router = useRouter();
  // useUser(router.pathname);

  return (
    <SWRConfig
      value={{
        fetcher: (url: string) =>
          fetch(url).then((response) => response.json()),
      }}
    >
      <div className="w-full max-w-screen-xl mx-auto">
        <Component {...pageProps} />
      </div>
    </SWRConfig>
  );
}

export default App;
