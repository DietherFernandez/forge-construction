"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/browser";
import styles from "@/app/login/login.module.css";

export function LoginForm() {
 const [visible, setVisible] = useState(false);
 const [busy, setBusy] = useState(false);
 const [error, setError] = useState("");
 const submitting = useRef(false);
 async function signIn(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();
  if (submitting.current) return;
  const fields = new FormData(event.currentTarget);
  submitting.current = true; setBusy(true); setError("");
  try {
   const supabase = createClient();
   const { error: authError } = await supabase.auth.signInWithPassword({
    email: String(fields.get("email") || "").trim(), password: String(fields.get("password") || "")
   });
   if (authError) { setError("We couldn’t sign you in. Check your email and password and try again."); return; }
   const response = await fetch("/api/auth/continue", { cache: "no-store" });
   if (!response.ok) throw new Error("Unable to open your account. Please try signing in again.");
   const data = await response.json();
   const allowed = ["/admin", "/portal", "/access-pending"];
   window.location.assign(allowed.includes(data.redirectTo) ? data.redirectTo : "/access-pending");
  } catch {
   setError("Sign-in is unavailable right now. Please try again shortly.");
  } finally { submitting.current = false; setBusy(false); }
 }
 return <>
  <form className={styles.form} onSubmit={signIn} aria-busy={busy} aria-describedby={error ? "login-error" : undefined}>
   <div className={styles.field}>
    <label htmlFor="login-email">Email address</label>
    <input id="login-email" name="email" type="email" autoComplete="username" placeholder="you@example.com" required maxLength={254} disabled={busy}/>
   </div>
   <div className={styles.field}>
    <div className={styles.passwordLabel}><label htmlFor="login-password">Password</label><Link href="/forgot-password" className={styles.forgot}>Forgot password?</Link></div>
    <div className={styles.password}>
     <input id="login-password" name="password" type={visible ? "text" : "password"} autoComplete="current-password" placeholder="Enter your password" required disabled={busy}/>
     <button className={styles.toggle} type="button" aria-label={visible ? "Hide password" : "Show password"} aria-pressed={visible} aria-controls="login-password" onClick={() => setVisible(value => !value)}>{visible ? <EyeOff aria-hidden="true"/> : <Eye aria-hidden="true"/>}</button>
    </div>
   </div>
   {error ? <p id="login-error" role="alert" className={styles.error}>{error}</p> : null}
   <button className={styles.submit} disabled={busy} type="submit"><span>{busy ? "Signing in…" : "Sign in"}</span><ArrowRight aria-hidden="true"/></button>
  </form>
  <p className={styles.help}>Need access? <Link href="/contact">Contact your FORGE project coordinator.</Link></p>
 </>;
}
