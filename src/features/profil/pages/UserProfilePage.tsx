import { motion, type Variants } from "motion/react";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { ProfileHeaderCard } from "../components/ProfileHeaderCard";
import { ProfileEditForm } from "../components/ProfileEditForm";
import { SecuritySection } from "../components/SecuritySection";

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] },
  },
};

export function UserProfilePage() {
  const user = useAuthStore((s) => s.user);

  if (!user) return null; // Ne devrait pas arriver derrière ProtectedRoute

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={container}
      className="mx-auto max-w-4xl px-4 py-10 sm:py-14"
    >
      <motion.div variants={item}>
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-signal">
          Mon compte
        </p>
        <h1 className="font-display mt-2 text-2xl text-ink sm:text-3xl">
          Profil
        </h1>
      </motion.div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[280px_1fr] lg:items-start">
        {/* ── Colonne latérale ───────────────────────────── */}
        <motion.div variants={item} className="lg:sticky lg:top-6">
          <ProfileHeaderCard user={user} />
        </motion.div>

        {/* ── Colonne principale ─────────────────────────── */}
        <div className="space-y-4">
          <motion.div variants={item}>
            <ProfileEditForm user={user} />
          </motion.div>

          <motion.div variants={item}>
            <SecuritySection />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}