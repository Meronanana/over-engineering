"use client";

import { Provider } from "react-redux";
import { store } from "@/utils/redux/store";
import Sandbox from "./_app";
import Modal from "@/components/modal";

export default function App() {
  return (
    <Provider store={store}>
      <Sandbox />
      <Modal />
    </Provider>
  );
}
