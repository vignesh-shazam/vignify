"use client";

import {
Compass,
House,
Library,
UserRound,
} from "lucide-react";

export type MobileTab = "home" | "explore" | "saved" | "profile" | "search";

type MobileBottomNavProps = {
activeTab: MobileTab;
onTabChange: (tab: MobileTab) => void;
};

const tabs = [
{ id: "home", label: "Home", Icon: House },
{ id: "explore", label: "Explore", Icon: Compass },
{ id: "saved", label: "Library", Icon: Library },
{ id: "profile", label: "Profile", Icon: UserRound },
] as const;

export default function MobileBottomNav({
activeTab,
onTabChange,
}: MobileBottomNavProps) {
return (
<nav className="mobile-bottom-nav" aria-label="Mobile navigation">
{tabs.map(({ id, label, Icon }) => {
const active = activeTab === id;

    return (
      <button
        key={id}
        type="button"
        className={`mobile-nav-item${active ? " is-active" : ""}`}
        aria-current={active ? "page" : undefined}
        aria-label={label}
        onClick={() => onTabChange(id)}
      >
        <Icon size={20} strokeWidth={active ? 2.4 : 1.8} />
        <span>{label}</span>
      </button>
    );
  })}
</nav>

);
}