import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const REVEAL_TARGETS = [
  "main > section",
  "main > article",
  ".dashboard-container > section",
  ".dashboard-container > div",
  ".sc-card",
  ".sc-stat-card",
  ".service-card",
  ".document-card",
  ".stat-card",
  ".complaint-form",
  ".upload-form",
  ".complaints-table-container",
].join(",");

export default function ScrollReveal() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("is-revealed", entry.isIntersecting);
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -7% 0px" },
    );

    const registerTargets = () => {
      document.querySelectorAll(REVEAL_TARGETS).forEach((element, index) => {
        if (element.classList.contains("scroll-section")) return;
        if (!element.dataset.scrollReveal) {
          element.dataset.scrollReveal = "true";
          element.style.setProperty("--reveal-delay", `${Math.min(index % 4, 3) * 55}ms`);
        }
        observer.observe(element);
      });
    };

    registerTargets();
    const mutationObserver = new MutationObserver(registerTargets);
    mutationObserver.observe(document.getElementById("root"), { childList: true, subtree: true });

    return () => {
      mutationObserver.disconnect();
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}
