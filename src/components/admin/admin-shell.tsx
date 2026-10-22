"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  House, Image, Tags, PanelsTopLeft, GalleryVerticalEnd, UsersRound, ShieldAlert,
  MessageCircle, Bell, ChartNoAxesColumnIncreasing, ChartNoAxesCombined, BadgeCheck,
  Wrench, ShieldCheck, Settings, Search, Sun, Moon, ChevronDown, LogOut, Menu, X,
} from "lucide-react";

const groups = [
 { label:"", items:[{label:"Dashboard",href:"/admin",icon:House}] },
 { label:"CONTENT", items:[{label:"Wallpapers",href:"/admin/wallpapers",icon:Image},{label:"Categories & Tags",href:"/admin/categories",icon:Tags},{label:"Homepage & Featured",href:"/admin/featured",icon:PanelsTopLeft},{label:"Collections",href:"/admin/collections",icon:GalleryVerticalEnd}] },
 { label:"COMMUNITY", items:[{label:"Users & Creators",href:"/admin/users",icon:UsersRound},{label:"Reports & Moderation",href:"/admin/reports",icon:ShieldAlert},{label:"Support & Feedback",href:"/admin/support",icon:MessageCircle},{label:"Notifications",href:"/admin/notifications",icon:Bell,notice:true}] },
 { label:"ANALYTICS", items:[{label:"Analytics & Reports",href:"/admin/analytics",icon:ChartNoAxesColumnIncreasing},{label:"Revenue & Monetization",href:"/admin/revenue",icon:ChartNoAxesCombined,soon:true},{label:"Subscriptions & Plans",href:"/admin/subscriptions",icon:BadgeCheck,soon:true}] },
 { label:"PLATFORM", items:[{label:"SEO & Content Pages",href:"/admin/seo",icon:Wrench,soon:true}] },
 { label:"SYSTEM", items:[{label:"Audit Logs",href:"/admin/audit-logs",icon:ShieldCheck},{label:"Settings & Security",href:"/admin/settings",icon:Settings}] },
];
export function AdminShell({children,email}:{children:React.ReactNode;email:string}) {
 const path=usePathname(); const router=useRouter(); const [mobileOpen,setMobileOpen]=useState(false); const [dark,setDark]=useState(true);
 async function signOut(){ await fetch('/api/admin/logout',{method:'POST'}); router.push('/admin/login'); router.refresh(); }
 return <div className={`admin-root ${dark?'':'light-mode'}`}>
  <aside className={`admin-sidebar ${mobileOpen?'mobile-open':''}`}>
   <Link href="/admin" className="brand"><span className="brand-mark">V</span><span><strong>Vignify</strong><small>Admin Panel</small></span></Link>
   <nav>{groups.map(g=><section className="nav-group" key={g.label||'main'}>{g.label&&<div className="nav-heading">{g.label}</div>}{g.items.map(item=>{const Icon=item.icon;const active=path===item.href||(item.href!='/admin'&&path.startsWith(item.href));return <Link key={item.href} href={item.href} onClick={()=>setMobileOpen(false)} className={`nav-item ${active?'active':''}`}><Icon size={18} strokeWidth={1.8}/><span>{item.label}</span>{item.soon&&<em>Soon</em>}{item.notice&&<i/>}</Link>})}</section>)}</nav>
   <div className="owner-card"><div className="owner-avatar">V</div><div className="owner-meta"><strong>Vignify Owner</strong><span>Owner</span></div><button aria-label="Sign out" title="Sign out" onClick={signOut} className="icon-button"><LogOut size={17}/></button></div>
  </aside>
  {mobileOpen&&<button className="mobile-scrim" aria-label="Close navigation" onClick={()=>setMobileOpen(false)}/>}
  <div className="admin-main"><header className="admin-topbar"><button className="icon-button mobile-menu" aria-label="Open navigation" onClick={()=>setMobileOpen(true)}><Menu size={20}/></button><label className="global-search"><Search size={18}/><input placeholder="Search wallpapers, users, categories..."/><kbd>Ctrl K</kbd></label><div className="top-actions"><button className="icon-button" aria-label="Toggle theme" onClick={()=>setDark(v=>!v)}>{dark?<Sun size={20}/>:<Moon size={20}/>}</button><button className="icon-button notification-button" aria-label="Notifications"><Bell size={20}/><i/></button><div className="top-avatar" title={email}>{(email[0]||'V').toUpperCase()}</div></div></header><main className="admin-content">{children}</main></div>
 </div>
}
