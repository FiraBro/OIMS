import {
  FiSearch,
  FiBell,
  FiSettings,
  FiHelpCircle,
  FiLogOut,
  FiChevronDown,
} from "react-icons/fi";
import { useAuthStore } from "@/stores/authStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // Standard shadcn component
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export default function Topbar() {
  const { logout, user } = useAuthStore();

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border border-gray-300 sticky top-0 z-30 flex items-center justify-between px-8">
      {/* 1. Global Search: Essential for quick policy/claim lookup */}
      <div className="flex-1 max-w-md relative group">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
        <Input
          type="text"
          placeholder="Search policies, claims, or customers (Cmd + K)"
          className="pl-10 bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-primary/20 w-full"
        />
      </div>

      {/* 2. Right Side Actions */}
      <div className="flex items-center gap-2">
        {/* Notifications: Vital for pending claim alerts */}
        <div className="relative p-2 hover:bg-slate-100 rounded-full cursor-pointer transition-colors">
          <FiBell className="text-slate-600 text-lg" />
          <Badge className="absolute top-1 right-1 h-4 w-4 flex items-center justify-center p-0 bg-destructive text-[10px]">
            3
          </Badge>
        </div>

        <div className="h-6 w-[1px] bg-slate-200 mx-2" />

        {/* 3. User Dropdown Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-3 hover:bg-slate-50 p-1.5 rounded-lg transition-all focus:outline-none">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-slate-900 leading-none">
                {user?.displayName || "Admin User"}
              </p>
              <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-tighter">
                Underwriting Dept
              </p>
            </div>
            <div className="bg-primary/10 text-primary h-8 w-8 rounded-md flex items-center justify-center font-bold text-xs border border-primary/20">
              {user?.email?.charAt(0).toUpperCase() || "A"}
            </div>
            <FiChevronDown className="text-slate-400 text-xs" />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56 mt-2">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <FiSettings className="mr-2 h-4 w-4" />
              <span>System Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <FiHelpCircle className="mr-2 h-4 w-4" />
              <span>Support Documentation</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={logout}
              className="text-destructive focus:bg-destructive focus:text-destructive-foreground cursor-pointer"
            >
              <FiLogOut className="mr-2 h-4 w-4" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
