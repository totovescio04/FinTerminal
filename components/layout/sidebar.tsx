import { Logo } from "./logo";
import { NavLinks } from "./nav-links";

/** Fixed desktop sidebar. Mobile uses <MobileSidebar/> inside the Topbar. */
export function Sidebar() {
  return (
    <aside className="hidden border-r border-sidebar-border bg-sidebar lg:flex lg:w-64 lg:flex-col">
      <div className="flex h-16 items-center border-b border-sidebar-border px-5">
        <Logo />
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <NavLinks />
      </div>
      <div className="border-t border-sidebar-border p-4">
        <p className="px-2 text-xs text-muted-foreground">
          Fixed Income · v0.1
          <span className="mt-0.5 block text-[11px] text-muted-foreground/70">
            Analytics engine — coming in Stage 2
          </span>
        </p>
      </div>
    </aside>
  );
}
