"use client";
import { useEffect, useRef } from "react";
import { initializeHome } from "@/lib/home-runtime.mjs";
export function HomeExperience({ markup }: { markup: string }) {
 const root = useRef<HTMLDivElement>(null);
 useEffect(() => {
  if (!root.current) return;
  return initializeHome(root.current);
 }, []);
 return <div ref={root} id="main-content" dangerouslySetInnerHTML={{ __html: markup }}/>;
}
