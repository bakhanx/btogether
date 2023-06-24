import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SWRConfig } from "swr";

function App({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig
      value={{
        fetcher: (url: string) =>
          fetch(url).then((response) => response.json()),
      }}
    >
      <div className="w-full max-w-screen-lg mx-auto overscroll-auto">
        <Component {...pageProps} />
      </div>
    </SWRConfig>
  );
}

export default App;
