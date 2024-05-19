"use client";

import { useEffect, useState } from "react";
import { actionRevalidateRoot } from "./actions";

type Props = {
  date: Date;
};

export function UpdatedAt({ date }: Props) {
  const [str, setStr] = useState(() => "");

  useEffect(() => {
    if (Date.now() - date.getTime() > 10000) {
      void actionRevalidateRoot();
    }
  }, [date]);
  useEffect(() => {
    if (Date.now() - date.getTime() <= 10000) {
      //setStr(`Updated ${Math.round((Date.now() - date.getTime()) / 1000)} seconds ago`);
      setStr("Updated just now");
    }
  }, [date]);

  return <p className={`min-h-6 text-xs ${str === "" ? "" : "animate-fade-in-out"}`}>{str}</p>;
}
