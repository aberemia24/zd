import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../../stores/authStore";
import toast from "react-hot-toast";
import { MESAJE, LABELS, BUTTONS } from "@budget-app/shared-constants";

// CVA styling imports - UNIFIED MIGRATION
import { cn, card, button, spaceY } from "../../../styles/cva-v2";

import Input from "../../primitives/Input/Input";
import { ValidatedSubmitButton } from "../../primitives/Button";
import Alert from "../../primitives/Alert/Alert";

interface LoginFormProps {}

const LoginForm: React.FC<LoginFormProps> = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading, error, errorType } = useAuthStore();

  // Funcție pentru validarea formatului de email
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email.trim());
  };

  // Verifică dacă formularul este valid (email corect și parolă introdusă)
  const isFormValid = isValidEmail(email) && password.length >= 6;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
    const { error } = useAuthStore.getState();
    if (!error) {
      toast.success(MESAJE.LOGIN_SUCCES);
    } else {
      let msg = error;
      switch (errorType) {
        case "INVALID_CREDENTIALS":
          msg =
            MESAJE.EROARE_AUTENTIFICARE || "Date de autentificare incorecte.";
          break;
        case "RLS_DENIED":
          msg = MESAJE.EROARE_RLS || "Acces interzis (RLS).";
          break;
        case "NETWORK":
          msg = MESAJE.EROARE_RETEA || "Eroare de rețea. Încearcă din nou.";
          break;
        default:
          msg = error || MESAJE.LOGIN_ERROR;
      }
      toast.error(msg);
    }
  };

  // Determinarea mesajului de eroare formatat
  const getErrorMessage = () => {
    switch (errorType) {
      case "INVALID_CREDENTIALS":
        return (
          MESAJE.EROARE_AUTENTIFICARE || "Date de autentificare incorecte."
        );
      case "RLS_DENIED":
        return MESAJE.EROARE_RLS || "Acces interzis (RLS).";
      case "NETWORK":
        return MESAJE.EROARE_RETEA || "Eroare de rețea. Încearcă din nou.";
      default:
        return error;
    }
  };

  return (
    <form
      className={cn(
        card({ variant: "elevated" }),
        "w-full max-w-md mx-auto",
      )}
      onSubmit={handleSubmit}
      data-testid="login-form"
    >
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Autentificare</h2>
      </div>

      <div className={cn("p-6", spaceY({ spacing: 4 }))}>
        {/* Email Input - FIXED: removed unsupported error variant */}
        <Input
          id="email"
          type="email"
          label={`${LABELS.EMAIL}*`}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          variant="default"
          data-testid="login-email"
        />

        {/* Password Input - FIXED: removed unsupported error variant */}
        <Input
          id="password"
          type="password"
          label={`${LABELS.PAROLA}*`}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          variant="default"
          data-testid="login-password"
        />

        {/* Error Message - FIXED: type → variant */}
        {error && (
          <Alert
            variant="error"
            data-testid="login-error"
          >
            {getErrorMessage() || ""}
          </Alert>
        )}

        {/* Submit Button - FIXED: added children */}
        <ValidatedSubmitButton
          isFormValid={isFormValid}
          size="md"
          isLoading={loading}
          data-testid="login-submit"
          className="w-full"
          submitText={BUTTONS.LOGIN}
        >
          {BUTTONS.LOGIN}
        </ValidatedSubmitButton>

        {/* Register Link */}
        <div className="text-center">
          <Link
            to="/register"
            className={cn(
              button({ variant: "ghost", size: "sm" }),
              "text-blue-600 hover:text-blue-700",
            )}
            data-testid="switch-to-register"
          >
            Nu ai cont? Crează unul!
          </Link>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
