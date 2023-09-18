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
  const bgRef: RefObject<HTMLDivElement> = useRef(null);

  useEffect(() => {
    if (modalRef.current === null || bgRef.current === null) return;

    if (visiable) {
      modalRef.current.style.pointerEvents = "auto";
      modalRef.current.style.opacity = "1";
      bgRef.current.style.opacity = "0.3";
    } else {
      modalRef.current.style.pointerEvents = "none";
      modalRef.current.style.opacity = "0";
      bgRef.current.style.opacity = "0";
    }
  }, [visiable]);

  const mouseUpEvent = () => {
    dispatch(modalClose());
  };
  const touchEndEvent = mouseUpEvent;

  return (
    <div className="global-modal" ref={modalRef}>
      <div className="modal-background" ref={bgRef} onMouseUp={mouseUpEvent} onTouchEnd={touchEndEvent} />
      {child}
    </div>
  );
}
