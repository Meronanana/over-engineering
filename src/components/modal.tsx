"use client";

import { RefObject, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ModalState, modalClose } from "@/utils/redux/modalState";
import { RootState } from "@/utils/redux/store";

import "./components.scss";

export default function Modal() {
  const { visiable, child } = useSelector<RootState>((state) => state.modalStateReducer) as ModalState;
  const dispatch = useDispatch();

  const modalRef: RefObject<HTMLDivElement> = useRef(null);

  useEffect(() => {
    if (modalRef.current === null) return;

    if (visiable) {
      modalRef.current.style.pointerEvents = "auto";
      modalRef.current.style.opacity = "0.3";
    } else {
      modalRef.current.style.opacity = "0";
      modalRef.current.style.pointerEvents = "none";
    }
  }, [visiable]);

  const mouseUpEvent = () => {
    dispatch(modalClose());
  };
  const touchEndEvent = mouseUpEvent;

  return (
    <div className="modal-background" ref={modalRef} onMouseUp={mouseUpEvent} onTouchEnd={touchEndEvent}>
      {child}
    </div>
  );
}
