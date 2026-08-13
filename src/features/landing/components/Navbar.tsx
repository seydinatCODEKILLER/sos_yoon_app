import { useEffect, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "motion/react";
import { Menu, X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

const navLinks = [
  { label: "Comment ça marche", href: "#comment-ca-marche" },
  { label: "Nos métiers", href: "#metiers" },
  { label: "Confiance", href: "#confiance" },
  { label: "Professionnels", href: "#professionnels" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 40);
  });

  // verrouille le scroll du body pendant que le menu mobile est ouvert
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <motion.div
        animate={{
          backgroundColor: scrolled ? "rgba(11,18,32,0.7)" : "rgba(11,18,32,0)",
          borderColor: scrolled
            ? "rgba(250,247,242,0.1)"
            : "rgba(250,247,242,0)",
          boxShadow: scrolled
            ? "0 8px 30px -16px rgba(0,0,0,0.45)"
            : "0 0 0 0 rgba(0,0,0,0)",
        }}
        transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
        className="border-b"
        style={{
          backdropFilter: scrolled ? "blur(20px)" : "blur(0px)",
          WebkitBackdropFilter: scrolled ? "blur(20px)" : "blur(0px)",
          transition: "backdrop-filter 0.4s ease",
        }}
      >
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a href="#top" className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-signal" />
            </span>
            <span className="font-display text-lg text-paper">SOS Yoon</span>
          </a>

          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-paper/70 transition-colors hover:text-paper"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden md:block">
            <Button size="sm" className="bg-signal text-ink hover:bg-signal/90">
              Décrire mon urgence
            </Button>
          </div>

          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-paper/15 text-paper transition-colors hover:border-paper/30 md:hidden"
            aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </nav>
      </motion.div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="overflow-hidden border-b border-paper/10 bg-ink/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  className="rounded-lg px-3 py-3 text-sm text-paper/80 transition-colors hover:bg-paper/5 hover:text-paper"
                >
                  {link.label}
                </motion.a>
              ))}
              <Button
                size="sm"
                className="mt-2 bg-signal text-ink hover:bg-signal/90"
                onClick={() => setMobileOpen(false)}
              >
                Décrire mon urgence
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
