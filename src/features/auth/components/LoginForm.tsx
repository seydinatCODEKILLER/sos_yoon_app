import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, type Variants } from "motion/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { getSpaceRoute } from "@/shared/lib/getSpaceRoute";
import { useLogin } from "../hooks/useLogin";
import { loginSchema, type LoginFormValues } from "../schema/auth.schema";
import { getErrorMessage } from "@/shared/lib/errorHandler";
import { Label } from "@/shared/components/ui/label";

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] },
  },
};

export function LoginForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const login = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (values: LoginFormValues) => {
    login.mutate(values, {
      onSuccess: ({ user }) => {
        navigate(getSpaceRoute(user.role));
      },
    });
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={container}
      className="mx-auto w-full max-w-sm"
    >
      <motion.div variants={item} className="mb-8 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-signal">
          SOS Yoon
        </p>
        <h1 className="font-display mt-2 text-2xl text-paper md:text-3xl">
          Accéder à mon espace
        </h1>
        <p className="mt-2 text-sm text-paper/60">
          Connectez-vous pour suivre vos demandes et échanger avec votre
          professionnel.
        </p>
      </motion.div>

      <motion.form
        variants={item}
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="space-y-5"
      >
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-paper/80">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="vous@exemple.com"
            className="border-paper/15 bg-paper/5 text-paper placeholder:text-paper/30"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-red-400">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-paper/80">
              Mot de passe
            </Label>
            <Link
              to="/mot-de-passe-oublie"
              className="text-xs text-paper/50 underline underline-offset-4 hover:text-paper/80"
            >
              Oublié ?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              className="border-paper/15 bg-paper/5 pr-10 text-paper placeholder:text-paper/30"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-paper/40 hover:text-paper/70"
              aria-label={
                showPassword
                  ? "Masquer le mot de passe"
                  : "Afficher le mot de passe"
              }
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-400">{errors.password.message}</p>
          )}
        </div>

        {login.isError && (
          <p className="rounded-lg border border-red-400/30 bg-red-400/10 px-3 py-2 text-sm text-red-300">
            {getErrorMessage(login.error)}
          </p>
        )}

        <Button
          type="submit"
          disabled={login.isPending}
          className="w-full bg-signal text-ink hover:bg-signal/90"
        >
          {login.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Connexion...
            </>
          ) : (
            "Se connecter"
          )}
        </Button>
      </motion.form>

      <motion.p
        variants={item}
        className="mt-6 text-center text-sm text-paper/60"
      >
        Pas encore de compte ?{" "}
        <Link
          to="/register"
          className="text-paper underline underline-offset-4 hover:text-signal"
        >
          Créer un compte
        </Link>
      </motion.p>
    </motion.div>
  );
}
