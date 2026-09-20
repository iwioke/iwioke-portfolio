"use client";

import {zodResolver} from "@hookform/resolvers/zod";
import {useCallback, useEffect, useRef, useState} from "react";
import {useForm} from "react-hook-form";
import {contactFormSchema, type ContactFormValues} from "@/lib/contact-schema";
import type {PortfolioCopy} from "@/content/types";

type ContactFormProps = {copy: PortfolioCopy["contact"]["form"]};
type SubmitStatus = "idle" | "success" | "error";

const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: Record<string, unknown>) => string;
      remove: (widgetId: string) => void;
    };
  }
}

function Turnstile({onToken}: {onToken: (token: string) => void}) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!turnstileSiteKey || !container.current) return;
    let widgetId: string | undefined;
    const render = () => {
      if (!container.current || !window.turnstile || widgetId) return;
      widgetId = window.turnstile.render(container.current, {
        sitekey: turnstileSiteKey,
        callback: onToken,
        "expired-callback": () => onToken(""),
        "error-callback": () => onToken(""),
      });
    };
    const existing = document.querySelector<HTMLScriptElement>('script[data-turnstile="true"]');
    const script = existing ?? document.createElement("script");
    if (!existing) {
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      script.dataset.turnstile = "true";
      document.head.appendChild(script);
    }
    script.addEventListener("load", render);
    render();

    return () => {
      script.removeEventListener("load", render);
      if (widgetId && window.turnstile) window.turnstile.remove(widgetId);
    };
  }, [onToken]);

  return <div className="turnstile" ref={container} />;
}

export function ContactForm({copy}: ContactFormProps) {
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const handleTurnstileToken = useCallback((token: string) => setTurnstileToken(token), []);
  const {register, handleSubmit, formState: {errors, isSubmitting}, reset} = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {name: "", email: "", company: "", subject: "", message: "", consent: false, website: ""},
  });

  const errorMessage = (field: keyof ContactFormValues) => {
    if (!errors[field]) return undefined;
    if (field === "name") return copy.validation.name;
    if (field === "email") return copy.validation.email;
    if (field === "message") return copy.validation.message;
    if (field === "consent") return copy.validation.consent;
    return copy.genericError;
  };

  async function onSubmit(values: ContactFormValues) {
    setStatus("idle");
    setStatusMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({...values, turnstileToken: turnstileToken || undefined}),
      });
      const result = await response.json().catch(() => null) as {ok?: boolean; error?: string} | null;

      if (response.status === 503) {
        setStatus("error");
        setStatusMessage(copy.deliveryUnavailable);
        return;
      }

      if (response.status === 403) {
        setStatus("error");
        setStatusMessage(copy.spam);
        return;
      }

      if (!response.ok || !result?.ok) {
        setStatus("error");
        setStatusMessage(copy.genericError);
        return;
      }

      reset();
      setStatus("success");
      setStatusMessage(copy.success);
    } catch {
      setStatus("error");
      setStatusMessage(copy.genericError);
    }
  }

  return (
    <form className="contact-form" noValidate onSubmit={handleSubmit(onSubmit)}>
      <div className="form-honeypot" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>
      {turnstileSiteKey ? <Turnstile onToken={handleTurnstileToken} /> : null}
      <div className="form-grid">
        <div className="field">
          <label htmlFor="name">{copy.name}</label>
          <input id="name" autoComplete="name" aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "name-error" : undefined} {...register("name")} />
          {errors.name ? <p id="name-error" className="field-error">{errorMessage("name")}</p> : null}
        </div>
        <div className="field">
          <label htmlFor="email">{copy.email}</label>
          <input id="email" type="email" autoComplete="email" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "email-error" : undefined} {...register("email")} />
          {errors.email ? <p id="email-error" className="field-error">{errorMessage("email")}</p> : null}
        </div>
        <div className="field">
          <label htmlFor="company">{copy.company}</label>
          <input id="company" autoComplete="organization" {...register("company")} />
        </div>
        <div className="field">
          <label htmlFor="subject">{copy.subject}</label>
          <input id="subject" {...register("subject")} />
        </div>
        <div className="field field--full">
          <label htmlFor="message">{copy.message}</label>
          <textarea id="message" rows={5} aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? "message-error" : undefined} {...register("message")} />
          {errors.message ? <p id="message-error" className="field-error">{errorMessage("message")}</p> : null}
        </div>
      </div>
      <div className="form-submit-row">
        <div className="consent-field">
          <input id="consent" type="checkbox" aria-invalid={Boolean(errors.consent)} aria-describedby={errors.consent ? "consent-error" : undefined} {...register("consent")} />
          <label htmlFor="consent">{copy.consent}</label>
          {errors.consent ? <p id="consent-error" className="field-error">{errorMessage("consent")}</p> : null}
        </div>
        <button className="button button--pink" type="submit" disabled={isSubmitting}>
          {isSubmitting ? copy.sending : copy.submit}<span aria-hidden="true">↗</span>
        </button>
      </div>
      <p className={`form-status ${status === "success" ? "form-status--success" : "form-status--error"}`} aria-live="polite" role={status === "error" ? "alert" : undefined}>
        {status === "idle" ? null : statusMessage}
      </p>
    </form>
  );
}
