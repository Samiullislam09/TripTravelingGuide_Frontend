"use client";

import { useState } from "react";
import type { ChangeEvent, FocusEvent, FormEvent } from "react";
import { Loader2, Mail, MessageSquare, Send, Sparkles, User } from "lucide-react";
import { sendContact } from "@/lib/api";
import { cn } from "@/lib/utils";

type FieldName = "name" | "email" | "message";

interface FormValues {
  name: string;
  email: string;
  message: string;
}

type FormErrors = Partial<Record<FieldName, string>>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EMPTY_VALUES: FormValues = { name: "", email: "", message: "" };

function validateField(name: FieldName, value: string): string | undefined {
  const trimmed = value.trim();
  switch (name) {
    case "name":
      if (!trimmed) return "Please tell us your name.";
      return undefined;
    case "email":
      if (!trimmed) return "An email is required so we can reply.";
      if (!EMAIL_REGEX.test(trimmed)) return "That email doesn't look right.";
      return undefined;
    case "message":
      if (!trimmed) return "Your message can't be empty.";
      if (trimmed.length < 10) return "A little more detail, please (10+ characters).";
      return undefined;
    default:
      return undefined;
  }
}

function validateAll(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  (Object.keys(values) as FieldName[]).forEach((key) => {
    const error = validateField(key, values[key]);
    if (error) errors[key] = error;
  });
  return errors;
}

interface FloatingFieldProps {
  id: string;
  name: FieldName;
  label: string;
  type?: "text" | "email";
  icon: React.ReactNode;
  multiline?: boolean;
  value: string;
  error?: string;
  touched: boolean;
  disabled: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur: (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

function FloatingField({
  id,
  name,
  label,
  type = "text",
  icon,
  multiline = false,
  value,
  error,
  touched,
  disabled,
  onChange,
  onBlur,
}: FloatingFieldProps) {
  const showError = touched && Boolean(error);
  const errorId = `${id}-error`;

  const sharedClasses = cn(
    "peer w-full rounded-2xl border bg-surface-2 px-4 pb-2.5 pt-6 text-ink-900 outline-none transition",
    "placeholder-transparent focus:border-brand-600 focus:ring-2 focus:ring-brand-600/30",
    "disabled:opacity-60",
    showError
      ? "border-coral-500 focus:border-coral-500 focus:ring-coral-500/30"
      : "border-line",
  );

  return (
    <div className="relative">
      <span
        className="pointer-events-none absolute left-4 top-5 text-ink-400 peer-focus:text-brand-600"
        aria-hidden="true"
      >
        {icon}
      </span>

      {multiline ? (
        <textarea
          id={id}
          name={name}
          rows={5}
          placeholder={label}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          aria-invalid={showError}
          aria-describedby={showError ? errorId : undefined}
          className={cn(sharedClasses, "min-h-[140px] resize-y pl-11")}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          placeholder={label}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          autoComplete={name === "email" ? "email" : name === "name" ? "name" : "off"}
          aria-invalid={showError}
          aria-describedby={showError ? errorId : undefined}
          className={cn(sharedClasses, "pl-11")}
        />
      )}

      <label
        htmlFor={id}
        className={cn(
          "pointer-events-none absolute left-11 top-4 origin-left text-ink-500 transition-all duration-200",
          "peer-focus:top-2 peer-focus:text-xs peer-focus:text-brand-600",
          "peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs",
        )}
      >
        {label}
      </label>

      {showError ? (
        <p id={errorId} className="mt-1.5 pl-1 text-sm text-coral-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export default function ContactForm() {
  const [values, setValues] = useState<FormValues>(EMPTY_VALUES);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<FieldName, boolean>>({
    name: false,
    email: false,
    message: false,
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    const field = name as FieldName;
    setValues((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      setErrors((prev) => ({ ...prev, [field]: validateField(field, value) }));
    }
    if (submitError) setSubmitError(null);
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const field = event.target.name as FieldName;
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({ ...prev, [field]: validateField(field, values[field]) }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);

    const nextErrors = validateAll(values);
    setErrors(nextErrors);
    setTouched({ name: true, email: true, message: true });

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setStatus("submitting");
    try {
      const result = await sendContact({
        name: values.name.trim(),
        email: values.email.trim(),
        message: values.message.trim(),
      });
      if (!result.ok) {
        throw new Error("Something went wrong. Please try again.");
      }
      setStatus("success");
    } catch (error) {
      setStatus("idle");
      setSubmitError(
        error instanceof Error
          ? error.message
          : "We couldn't send your message. Please try again.",
      );
    }
  };

  const resetForm = () => {
    setValues(EMPTY_VALUES);
    setErrors({});
    setTouched({ name: false, email: false, message: false });
    setStatus("idle");
    setSubmitError(null);
  };

  if (status === "success") {
    return (
      <div className="card p-6 sm:p-8" data-reveal="zoom">
        <div className="flex flex-col items-center gap-4 py-8 text-center">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-brand-soft text-brand-600 shadow-glow-sm">
            <Sparkles className="h-8 w-8" aria-hidden="true" />
          </span>
          <h3 className="text-2xl font-bold text-ink-900">
            Thanks — we&apos;ll reply soon ✦
          </h3>
          <p className="max-w-sm text-ink-500">
            Your message just landed in our inbox. Keep an eye on your email for a
            reply from the TripTravelingGuide team.
          </p>
          <button type="button" onClick={resetForm} className="btn btn-outline mt-2">
            Send another message
          </button>
        </div>
      </div>
    );
  }

  const isSubmitting = status === "submitting";

  return (
    <form className="card p-6 sm:p-8" onSubmit={handleSubmit} noValidate>
      <div className="mb-6 space-y-1.5">
        <h3 className="text-2xl font-bold text-ink-900">Send us a message</h3>
        <p className="text-ink-500">
          Have a question, a tip, or a collaboration in mind? We read everything.
        </p>
      </div>

      <div className="space-y-5" data-reveal-stagger>
        <FloatingField
          id="contact-name"
          name="name"
          label="Your name"
          icon={<User className="h-5 w-5" aria-hidden="true" />}
          value={values.name}
          error={errors.name}
          touched={touched.name}
          disabled={isSubmitting}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <FloatingField
          id="contact-email"
          name="email"
          type="email"
          label="Email address"
          icon={<Mail className="h-5 w-5" aria-hidden="true" />}
          value={values.email}
          error={errors.email}
          touched={touched.email}
          disabled={isSubmitting}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <FloatingField
          id="contact-message"
          name="message"
          label="Your message"
          multiline
          icon={<MessageSquare className="h-5 w-5" aria-hidden="true" />}
          value={values.message}
          error={errors.message}
          touched={touched.message}
          disabled={isSubmitting}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </div>

      <div aria-live="assertive" className="min-h-[1.25rem]">
        {submitError ? (
          <p className="mt-4 rounded-xl border border-coral-500/40 bg-coral-500/10 px-4 py-2.5 text-sm text-coral-600">
            {submitError}
          </p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn btn-primary mt-6 w-full sm:w-auto"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            <span>Sending…</span>
          </>
        ) : (
          <>
            <Send className="h-4 w-4" aria-hidden="true" />
            <span>Send message</span>
          </>
        )}
      </button>
    </form>
  );
}
