// components/admin/Header.jsx
import React from "react";
import { Menu, Search, Bell, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header({ toggleSidebar, toggleCollapse, collapsed }) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between p-4 bg-white border-b border-gray-200">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="md:hidden hover:bg-gray-100"
        >
          <Menu size={20} />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleCollapse}
          className="hidden md:flex hover:bg-gray-100"
        >
          <Menu size={20} />
        </Button>

        <div className="relative flex-1 max-w-md">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <Input
            placeholder="Search..."
            className="pl-10 bg-gray-50 border-gray-200"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="relative hover:bg-gray-100"
        >
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 hover:bg-gray-100">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" />
                <AvatarFallback className="bg-blue-500 text-white">
                  JD
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium">John Doe</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              <ChevronDown size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 bg-white border-gray-200"
          >
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-200" />
            <DropdownMenuItem className="hover:bg-gray-100">
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-gray-100">
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-gray-100">
              Billing
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gray-200" />
            <DropdownMenuItem className="text-red-600 hover:bg-red-50">
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
