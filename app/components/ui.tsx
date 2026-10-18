import Link from "next/link";
import { AlertCircle, CheckCircle2 } from "lucide-react";
export function PageHeader({kicker,title,description,action}:{kicker:string;title:string;description?:string;action?:React.ReactNode}){return <header className="mb-10"><p className="forge-kicker">{kicker}</p><div className="flex flex-wrap items-end justify-between gap-5"><div><h1 className="forge-title">{title}</h1>{description&&<p className="forge-lede">{description}</p>}</div>{action}</div></header>}
export function EmptyState({title,body,href,label}:{title:string;body:string;href?:string;label?:string}){return <div className="forge-panel my-5"><h2 className="text-lg font-bold">{title}</h2><p className="text-muted mt-2 text-sm">{body}</p>{href&&label&&<Link className="forge-button mt-5" href={href}>{label}</Link>}</div>}
export function ConfigState({feature="This area"}:{feature?:string}){return <div role="status" className="forge-status forge-error"><strong>Configuration required.</strong> {feature} needs Supabase configuration. No data was saved.</div>}
export function ErrorState({message}:{message:string}){return <div role="alert" className="forge-status forge-error flex items-start gap-2"><AlertCircle size={18}/><span>{message}</span></div>}
export function SuccessState({message}:{message:string}){return <div role="status" className="forge-status forge-success flex items-start gap-2"><CheckCircle2 size={18}/><span>{message}</span></div>}
export function StatusBadge({status}:{status:string}){return <span className={`forge-badge status-${status.toLowerCase().replaceAll(" ","-")}`}>{status.replaceAll("_"," ")}</span>}
export function Metric({label,value}:{label:string;value:number|string}){return <div className="metric-card"><span>{label}</span><strong>{value}</strong></div>}
export function SectionTitle({children}:{children:React.ReactNode}){return <h2 className="mb-4 text-xl font-bold">{children}</h2>}
