"use client";

import { Provider } from "react-redux";
import { store } from "@/utils/redux/store";
import DeadLock from "./_app";
import Modal from "@/components/modal";

export default function App() {
  return (
    <Provider store={store}>
      <DeadLock />
      <Modal />
    </Provider>
  );
}
