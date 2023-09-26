"use client";

import { Provider } from "react-redux";
import { store } from "@/utils/redux/store";
import Modal from "@/components/modal";
import NWJNS_Powerpuffgirl from "./_app";

export default function App() {
  return (
    <Provider store={store}>
      <NWJNS_Powerpuffgirl />
      <Modal />
    </Provider>
  );
}
