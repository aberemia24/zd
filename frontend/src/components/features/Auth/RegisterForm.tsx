import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../../stores/authStore";
import type { AuthErrorType } from "../../../services/supabaseAuthService";
import toast from "react-hot-toast";
import { MESAJE, LABELS, BUTTONS } from "@shared-constants";
import { cn } from "../../../styles/cva/shared/utils";
import { card } from "../../../styles/cva/components/layout";
import { button } from "../../../styles/cva/components/forms";
import Input from "../../primitives/Input/Input";
import { ValidatedSubmitButton } from "../../primitives/Button";
import Alert from "../../primitives/Alert/Alert";

const RegisterForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const { register, loading, error, errorType } = useAuthStore();
  const [success, setSuccess] = useState<string | null>(null);

  // Funcție pentru validarea formatului de email
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email.trim());
  };

  // Verificare dacă parolele coincid și sunt suficient de lungi
  const isPasswordValid = password.length >= 8;
  const doPasswordsMatch = password === confirm && confirm !== "";

  // Verifică dacă formularul este valid
  const isFormValid =
    isValidEmail(email) && isPasswordValid && doPasswordsMatch;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);
    if (password !== confirm) {
      setSuccess(null);
      toast.error(MESAJE.PAROLE_NECORESPUNZATOARE);
      return;
    }
    await register(email, password);
    const { error } = useAuthStore.getState();
    if (!error) {
      setSuccess(MESAJE.REGISTER_SUCCES);
      toast.success(MESAJE.REGISTER_SUCCES);
    } else {
      let msg = error;
      switch (errorType) {
        case "PASSWORD_WEAK":
          msg =
            MESAJE.PAROLA_PREA_SLABA ||
            "Parola trebuie să aibă minim 8 caractere, literă mare, mică, cifră și simbol.";
          break;
        case "NETWORK":
          msg = MESAJE.EROARE_RETEA || "Eroare de rețea. Încearcă din nou.";
          break;
        default:
          msg = error || MESAJE.REGISTER_ERROR;
      }
      toast.error(msg);
    }
  };

  // Determinarea mesajului de eroare formatat
  const getErrorMessage = () => {
    switch (errorType as AuthErrorType) {
      case "PASSWORD_WEAK":
        return (
          MESAJE.PAROLA_PREA_SLABA ||
          "Parola trebuie să aibă minim 8 caractere, literă mare, mică, cifră și simbol."
        );
      case "NETWORK":
        return MESAJE.EROARE_RETEA || "Eroare de rețea. Încearcă din nou.";
      default:
        return error || "";
    }
  };

  return (
    <form
      className={cn(
        card({ variant: "elevated", size: "md" }),
        "w-full max-w-md mx-auto",
      )}
      onSubmit={handleSubmit}
      data-testid="register-form"
    >
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Înregistrare</h2>
      </div>

      <div className="p-6 space-y-4">
        {/* Email Input */}
        <Input
          id="register-email"
          type="email"
          label={`${LABELS.EMAIL}*`}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          variant={error ? "error" : "default"}
          dataTestId="register-email"
        />

        {/* Password Input */}
        <Input
          id="register-password"
          type="password"
          label={`${LABELS.PAROLA}*`}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          variant={
            password.length > 0 && !isPasswordValid ? "error" : "default"
          }
          dataTestId="register-password"
        />

        {/* Confirm Password Input */}
        <Input
          id="register-confirm"
          type="password"
          label={`${LABELS.CONFIRMA_PAROLA}*`}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          variant={
            confirm.length > 0 && !doPasswordsMatch ? "error" : "default"
          }
          dataTestId="register-confirm"
        />

        {/* Error Message */}
        {error && (
          <Alert
            type="error"
            message={getErrorMessage()}
            size="md"
            dataTestId="register-error"
          />
        )}

        {/* Success Message */}
        {success && (
          <Alert
            type="success"
            message={success || ""}
            size="md"
            dataTestId="register-success"
          />
        )}

        {/* Submit Button */}
        <ValidatedSubmitButton
          isFormValid={isFormValid}
          size="md"
          isLoading={loading}
          dataTestId="register-submit"
          className="w-full"
          submitText={BUTTONS.REGISTER}
        />

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
