"use client";
import Link from "next/link";
import { useRef } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { homeStyles } from "@/app/home-styles";

const links=[["Projects","/projects"],["Services","/services"],["About","/about"],["Contact","/contact"]];

export function SiteFrame({children}:{children:React.ReactNode}){
  const dialog=useRef<HTMLDialogElement>(null);

  return (
    <div className="forge-page">
      <style>{homeStyles}</style>
      <a className="skip-link" href="#main">Skip to content</a>

      <header className="header" style={{background: 'var(--ink)'}} id="site-header">
        <a className="brand" href="/" aria-label="FORGE Construction, home">
          <svg className="brand-mark" viewBox="0 0 32 32" fill="none" aria-hidden="true">
            <path d="M4 4h24v5H10v6h14v5H10v8H4V4Z" fill="currentColor"/>
            <path d="M24 20h4v8h-4z" fill="currentColor"/>
          </svg>
          <span className="brand-name"><strong>FORGE</strong><span>Construction</span></span>
        </a>

        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map(([n,h])=><Link key={h} href={h}>{n}</Link>)}
          <Link href="/login">Client Login</Link>
        </nav>

        <Link className="action header-cta" href="/request-quote">
          Start a Project <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M4 12h15m-6-7 7 7-7 7"/></svg>
        </Link>

        <button className="menu-toggle" type="button" aria-label="Open navigation menu" onClick={()=>dialog.current?.showModal()}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M3 7h18M3 12h18M3 17h18"/></svg>
        </button>
      </header>

      <div className="drawer" id="mobile-drawer" hidden>
        <button className="backdrop" type="button" onClick={()=>dialog.current?.close()}></button>
        <dialog ref={dialog} className="dashboard-dialog" style={{background: 'var(--ink)', color: 'var(--white)'}}>
          <div className="drawer-panel">
            <div className="drawer-top">
              <a className="brand" href="/">
                <svg className="brand-mark" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                  <path d="M4 4h24v5H10v6h14v5H10v8H4V4Z" fill="currentColor"/>
                  <path d="M24 20h4v8h-4z" fill="currentColor"/>
                </svg>
                <span className="brand-name"><strong>FORGE</strong><span>Construction</span></span>
              </a>
              <button className="drawer-close" type="button" onClick={()=>dialog.current?.close()}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="m5 5 14 14M19 5 5 19"/></svg>
              </button>
            </div>
            <nav className="drawer-nav">
              {links.map(([n,h])=><Link key={h} href={h} onClick={()=>dialog.current?.close()}>{n}</Link>)}
              <Link href="/login" onClick={()=>dialog.current?.close()}>Client Login</Link>
            </nav>
            <a className="action drawer-cta" href="/request-quote" onClick={()=>dialog.current?.close()}>
              Start a Project <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M4 12h15m-6-7 7 7-7 7"/></svg>
            </a>
          </div>
        </dialog>
      </div>

      <main id="main">{children}</main>

      <footer className="footer">
        <div className="wrap">
          <div className="footer-top">
            <div className="footer-brand">
              <a className="brand" href="/" aria-label="FORGE Construction, return to top">
                <svg className="brand-mark" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                  <path d="M4 4h24v5H10v6h14v5H10v8H4V4Z" fill="currentColor"/>
                  <path d="M24 20h4v8h-4z" fill="currentColor"/>
                </svg>
                <span className="brand-name"><strong>FORGE</strong><span>Construction</span></span>
              </a>
              <p>Thoughtful planning. Skilled execution. Spaces built for the way you live and work.</p>
            </div>
            <nav className="footer-nav" aria-label="Footer navigation">
              {links.map(([n,h])=><Link key={h} href={h}>{n}</Link>)}
              <Link href="/login">Client Login</Link>
            </nav>
            <p className="footer-line">Built strong.<br />Built to last.</p>
          </div>
          <div className="footer-bottom">
            <p>© FORGE Construction</p>
            <p>Built with care. Made to last. <a href="/admin" className="admin-link">Admin</a></p>
          </div>
        </div>
      </footer>
    </div>
  );
}
