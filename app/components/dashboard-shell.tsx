"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { LayoutDashboard, Inbox, Users, Building2, FileText, Images, Briefcase, Settings, Menu, X, LogOut, ArrowUpRight } from "lucide-react";
import { createClient } from "@/lib/supabase/browser";
const admin = [
 {label:"Overview",href:"/admin",icon:LayoutDashboard}, {label:"Inquiries",href:"/admin/inquiries",icon:Inbox},
 {label:"Clients",href:"/admin/clients",icon:Users}, {label:"Projects",href:"/admin/projects",icon:Building2},
 {label:"Quotations",href:"/admin/quotations",icon:FileText}, {label:"Portfolio",href:"/admin/portfolio",icon:Images},
 {label:"Services",href:"/admin/services",icon:Briefcase}, {label:"Settings",href:"/admin/settings",icon:Settings}
];
const portal = [
 {label:"Overview",href:"/portal",icon:LayoutDashboard}, {label:"Projects",href:"/portal/projects",icon:Building2},
 {label:"Quotations",href:"/portal/quotations",icon:FileText}, {label:"Documents",href:"/portal/documents",icon:Images},
 {label:"Account",href:"/portal/account",icon:Settings}
];
export function DashboardShell({area,email,children}:{area:"admin"|"portal";email:string;children:React.ReactNode}) {
 const path=usePathname(), dialog=useRef<HTMLDialogElement>(null);
 const nav=area==="admin"?admin:portal, dashboard=area==="admin"?"/admin":"/portal";
 const active=(href:string)=>path===href||(href!==dashboard&&path.startsWith(href+"/"));
 const title=nav.find(n=>active(n.href))?.label||"Overview";
 const [error,setError]=useState(""), [signingOut,setSigningOut]=useState(false);
 async function logout() {
  setError("");setSigningOut(true);
  try { const {error}=await createClient().auth.signOut();if(error)throw error;window.location.assign("/login"); }
  catch { setError("Unable to sign out. Please try again."); }
  finally { setSigningOut(false); }
 }
 const links=<nav className="dashboard-nav" aria-label={`${area} navigation`}>{nav.map(n=>{
  const Icon=n.icon;
  return <Link aria-current={active(n.href)?"page":undefined} href={n.href} key={n.href} onClick={()=>dialog.current?.close()}><Icon size={17} aria-hidden="true"/>{n.label}</Link>;
 })}</nav>;
 const signOut=<button type="button" className="dashboard-signout" onClick={logout} disabled={signingOut}><LogOut size={16} aria-hidden="true"/>{signingOut?"Signing out…":"Sign out"}</button>;
 return <div className="dashboard">
  <aside className="dashboard-sidebar" aria-label="Sidebar">
   <Link className="forge-brand flex items-center gap-2" href="/">
    <svg className="w-6 h-6 text-[var(--forge-orange)]" viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M4 4h24v5H10v6h14v5H10v8H4V4Z" fill="currentColor"/><path d="M24 20h4v8h-4z" fill="currentColor"/></svg>
    <span className="text-sm font-extrabold tracking-tighter uppercase">FORGE <span className="font-normal">Construction</span></span>
   </Link>
   <p className="mt-1 text-xs uppercase tracking-widest text-white/55">{area==="admin"?"Administration":"Client portal"}</p>
   {links}{signOut}
  </aside>
  <div className="dashboard-main">
   <header className="dashboard-topbar">
    <div className="flex items-center gap-3">
     <button className="dashboard-mobile-trigger forge-button secondary" type="button" aria-label="Open navigation" aria-haspopup="dialog" onClick={()=>dialog.current?.showModal()}><Menu size={18} aria-hidden="true"/></button>
     <div><p className="forge-kicker">{area==="admin"?"FORGE / ADMIN":"FORGE / CLIENT"}</p><h1 className="font-bold uppercase tracking-tight" style={{fontFamily:"var(--display)"}}>{title}</h1></div>
    </div>
    <div className="dashboard-topbar-actions"><Link href={dashboard} className="dashboard-home-link"><LayoutDashboard size={16} aria-hidden="true"/><span>Go to Dashboard</span><ArrowUpRight size={14} aria-hidden="true"/></Link><span className="dashboard-account-email">{email}</span></div>
   </header>
   <dialog className="dashboard-dialog" ref={dialog} aria-label={`${area} navigation`}>
    <div className="mobile-menu-content">
     <div className="flex justify-between items-center"><strong>{area==="admin"?"Admin menu":"Client menu"}</strong><button className="forge-button secondary" type="button" aria-label="Close navigation" onClick={()=>dialog.current?.close()}><X size={18} aria-hidden="true"/></button></div>
     {links}{signOut}
    </div>
   </dialog>
   {error?<p role="alert" className="forge-status forge-error m-4">{error}</p>:null}
   <main className="dashboard-content">{children}</main>
  </div>
 </div>;
}
