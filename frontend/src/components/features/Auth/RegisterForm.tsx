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

interface RegisterFormProps {}

const RegisterForm: React.FC<RegisterFormProps> = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const { register, loading, error, errorType } = useAuthStore();

  // Funcție pentru validarea formatului de email
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email.trim());
  };

  // Verifică dacă parolele se potrivesc
  const passwordsMatch = password === confirmPassword;

  // Verifică dacă formularul este valid
  const isFormValid =
    isValidEmail(email) &&
    password.length >= 6 &&
    confirmPassword.length >= 6 &&
    passwordsMatch;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!passwordsMatch) {
      toast.error("Parolele nu se potrivesc!");
      return;
    }

    await register(email, password);
    const { error } = useAuthStore.getState();
    if (!error) {
      setShowSuccess(true);
      toast.success(MESAJE.REGISTER_SUCCES);
      // Reset form
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      // Hide success message after 5 seconds
      setTimeout(() => setShowSuccess(false), 5000);
    } else {
      let msg = error;
      // Simplificat error handling pentru a evita probleme TypeScript
      if (error.includes("already")) {
        msg = "Email-ul este deja folosit.";
      } else if (error.includes("weak") || error.includes("short")) {
        msg = "Parola este prea slabă. Trebuie să aibă cel puțin 6 caractere.";
      } else {
        msg = error || MESAJE.REGISTER_ERROR;
      }
      toast.error(msg);
    }
  };

  // Determinarea mesajului de eroare formatat
  const getErrorMessage = () => {
    if (!error) return "";
    
    // Simplificat error handling pentru a evita probleme TypeScript
    if (error.includes("already")) {
      return "Email-ul este deja folosit.";
    } else if (error.includes("weak") || error.includes("short")) {
      return "Parola este prea slabă. Trebuie să aibă cel puțin 6 caractere.";
    } else {
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
      data-testid="register-form"
    >
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Înregistrare</h2>
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
          data-testid="register-email"
        />

        {/* Password Input - FIXED: removed unsupported error variant */}
        <Input
          id="password"
          type="password"
          label={`${LABELS.PAROLA}* (min. 6 caractere)`}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          variant="default"
          data-testid="register-password"
        />

        {/* Confirm Password Input - FIXED: removed unsupported error variant */}
        <Input
          id="confirmPassword"
          type="password"
          label={`${LABELS.CONFIRMA_PAROLA}*`}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          variant="default"
          data-testid="register-confirm-password"
        />

        {/* Error Message - FIXED: type → variant */}
        {error && (
          <Alert
            variant="error"
            data-testid="register-error"
          >
            {getErrorMessage() || ""}
          </Alert>
        )}

        {/* Success Message - FIXED: type → variant */}
        {showSuccess && (
          <Alert
            variant="success"
            data-testid="register-success"
          >
            {MESAJE.REGISTER_SUCCES}
          </Alert>
        )}

        {/* Submit Button - FIXED: added children */}
        <ValidatedSubmitButton
          isFormValid={isFormValid}
          size="md"
          isLoading={loading}
          data-testid="register-submit"
          className="w-full"
          submitText={BUTTONS.REGISTER}
        >
          {BUTTONS.REGISTER}
        </ValidatedSubmitButton>

        {/* Login Link */}
        <div className="text-center">
          <Link
            to="/login"
            className={cn(
              button({ variant: "ghost", size: "sm" }),
              "text-blue-600 hover:text-blue-700",
            )}
            data-testid="switch-to-login"
          >
            Ai deja cont? Autentifică-te!
          </Link>
        </div>
      </div>
    </form>
  );
};

export default RegisterForm;
