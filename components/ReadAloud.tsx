"use client";

import { useEffect, useRef, useState } from "react";
import { Square, Volume2 } from "lucide-react";
import { useApp } from "@/lib/app-context";

/** Reads the main part of the page out loud using the browser's built-in voice. */
export function ReadAloud({ className = "" }: { className?: string }) {
  const { t, lang } = useApp();
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(true);
  const cancelled = useRef(false);

  useEffect(() => {
    setSupported(typeof window !== "undefined" && "speechSynthesis" in window);
    return () => {
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, []);

  // Stop reading when the language changes or the page changes.
  useEffect(() => {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    setSpeaking(false);
  }, [lang]);

  function stop() {
    cancelled.current = true;
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }

  function start() {
    if (!supported) {
      alert(t.noSpeech);
      return;
    }
    const main = document.getElementById("main");
    if (!main) return;
    // Skip parts that make no sense out loud (like the map).
    const copy = main.cloneNode(true) as HTMLElement;
    copy.querySelectorAll("[data-noread], script, style, noscript").forEach((n) => n.remove());
    copy.style.position = "fixed";
    copy.style.left = "-9999px";
    document.body.appendChild(copy);
    const text = copy.innerText.replace(/\s+\n/g, "\n").trim();
    copy.remove();
    // Some browsers stop long speech early, so we read one sentence at a time.
    const chunks = text
      .replace(/([.!?:])\s+/g, "$1\n")
      .split(/\n+/)
      .map((c) => c.trim())
      .filter(Boolean);
    const synth = window.speechSynthesis;
    synth.cancel();
    cancelled.current = false;
    const voiceLang = lang === "es" ? "es" : "en";
    const voice = synth.getVoices().find((v) => v.lang.toLowerCase().startsWith(voiceLang));
    chunks.forEach((chunk, i) => {
      const u = new SpeechSynthesisUtterance(chunk);
      u.lang = lang === "es" ? "es-US" : "en-US";
      if (voice) u.voice = voice;
      u.rate = 0.9;
      if (i === chunks.length - 1) u.onend = () => setSpeaking(false);
      u.onerror = () => {
        if (!cancelled.current) setSpeaking(false);
      };
      synth.speak(u);
    });
    setSpeaking(true);
  }

  return (
    <button
      type="button"
      onClick={speaking ? stop : start}
      aria-pressed={speaking}
      className={className}
    >
      {speaking ? <Square className="h-5 w-5" aria-hidden="true" /> : <Volume2 className="h-5 w-5" aria-hidden="true" />}
      <span>{speaking ? t.stopReading : t.readAloud}</span>
    </button>
  );
}
