"use client";

import { useEffect } from "react";

const FEED_SCROLL_KEY = "home-feed-scroll";

export function useRestoreFeedScroll() {
  useEffect(() => {
    const savedScroll = sessionStorage.getItem(FEED_SCROLL_KEY);

    if (savedScroll) {
      const scrollY = Number(savedScroll);

      requestAnimationFrame(() => {
        window.scrollTo({
          top: scrollY,
          behavior: "auto",
        });
      });
    }


    const handleScroll = () => {
      sessionStorage.setItem(
        FEED_SCROLL_KEY,
        String(window.scrollY),
      );
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
}