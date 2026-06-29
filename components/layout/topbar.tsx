import { MobileSidebar } from "./mobile-sidebar";
import { Breadcrumb } from "./breadcrumb";
import { SearchBar } from "./search-bar";
import { ThemeToggle } from "./theme-toggle";
import { UserMenu } from "./user-menu";

export function Topbar() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-md lg:px-6">
      <MobileSidebar />
      <Breadcrumb />
      <div className="flex flex-1 items-center justify-end gap-2 md:justify-between">
        <div className="hidden flex-1 justify-center md:flex">
          <SearchBar />
        </div>
        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
