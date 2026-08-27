import { useEffect, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "motion/react";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { getSpaceRoute } from "@/shared/lib/getSpaceRoute";
import { useAuthStore } from "@/features/auth/store/auth.store";

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
  const navigate = useNavigate();

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);

  const ctaLabel = isAuthenticated
    ? "Accéder à mon espace"
    : "Décrire mon urgence";

  const handleCtaClick = () => {
    setMobileOpen(false);
    if (isAuthenticated && user) {
      navigate(getSpaceRoute(user.role));
    } else {
      navigate("/login");
    }
  };

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 40);
  });

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header className="fixed inset-x-0 top-4 z-50 px-4 md:top-6">
      <motion.div
        animate={{
          backgroundColor: scrolled
            ? "rgba(11,18,32,0.32)"
            : "rgba(11,18,32,0.16)",
          borderColor: scrolled
            ? "rgba(250,247,242,0.16)"
            : "rgba(250,247,242,0.10)",
          boxShadow: scrolled
            ? "0 12px 40px -12px rgba(0,0,0,0.5)"
            : "0 8px 24px -12px rgba(0,0,0,0.3)",
        }}
        transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
        className="mx-auto max-w-5xl rounded border backdrop-blur-xl"
        style={{
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        <nav className="flex items-center justify-between px-5 py-3">
          <a href="#top" className="flex shrink-0 items-center gap-2.5">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-signal" />
            </span>
            <span className="whitespace-nowrap font-display text-lg text-paper">
              SOS Yoon
            </span>
          </a>

          <div className="hidden items-center gap-6 lg:flex xl:gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="whitespace-nowrap text-sm text-paper/70 transition-colors hover:text-paper"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden lg:block">
            <Button
              size="sm"
              onClick={handleCtaClick}
              className="bg-signal text-ink hover:bg-signal/90 whitespace-nowrap"
            >
              {ctaLabel}
            </Button>
          </div>

          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-paper/15 text-paper transition-colors hover:border-paper/30 lg:hidden"
            aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </nav>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="overflow-hidden border-t border-paper/10 lg:hidden"
            >
              <div className="flex flex-col gap-1 px-5 py-4">
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
                  onClick={handleCtaClick}
                >
                  {ctaLabel}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </header>
  );
}
