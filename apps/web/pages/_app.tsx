import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import store from "../src/store";
import "../src/styles/global.css";

//switched to any from AppProps
function MyApp({ Component, pageProps }: any) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />;
    </Provider>
  );
}

export default MyApp;
