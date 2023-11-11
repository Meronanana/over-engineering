"use client";

import MapController from "./controller/MapController";
import "./natsel.scss";

export default function NaturalSelection() {
  return (
    <main>
      <div className="natsel-screen">
        <MapController />
      </div>
    </main>
  );
}
