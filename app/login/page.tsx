import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LoginForm } from "@/app/components/login-form";
import styles from "./login.module.css";
export const metadata: Metadata = { title: "Sign in", robots: { index: false, follow: false } };
export default function LoginPage() {
 return <main className={styles.page}>
  <section className={styles.visual} aria-label="FORGE Construction">
   <Image className={styles.photo} src="/assets/images/forge_hero.webp" alt="" fill priority sizes="(max-width:760px) 100vw, 50vw"/>
   <div className={styles.shade}/>
   <Link href="/" className={styles.brand} aria-label="FORGE Construction, home">
    <svg className={styles.mark} viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M4 4h24v5H10v6h14v5H10v8H4V4Z"/><path d="M24 20h4v8h-4z"/></svg>
    <span className={styles.wordmark}><strong>FORGE</strong><small>Construction</small></span>
   </Link>
   <div className={styles.story}><p className={styles.eyebrow}>Built on trust</p><h2>Your project.<br/>Every detail.</h2><p>Stay connected to the work taking shape. Your projects, quotations, and updates, all in one place.</p></div>
   <div className={styles.visualFooter}>Precision. Strength. Commitment.</div>
  </section>
  <section className={styles.content} aria-labelledby="login-title">
   <Link href="/" className={styles.back}><ArrowLeft aria-hidden="true"/>Back to website</Link>
   <div className={styles.formWrap}><p className={styles.label}>FORGE Project Portal</p><h1 id="login-title">Welcome back.</h1><p className={styles.intro}>Sign in to view your projects, quotations, and updates.</p><LoginForm/></div>
   <p className={styles.footer}>FORGE Construction · Built strong. Built to last.</p>
  </section>
 </main>;
}
