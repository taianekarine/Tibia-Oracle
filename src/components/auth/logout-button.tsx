
"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useLogout } from "@/hooks/useLogout";

export function LogoutButton() {
  const { logout } = useLogout();

  function handleClick() {
    const ok = confirm("Deseja realmente sair?");
    if (!ok) return;

    logout();
  }

  return (
    <Button
      size="icon"
      variant="ghost"
      onClick={handleClick}
      aria-label="Logout"
    >
      <LogOut className="h-4 w-4" />
    </Button>
  );
}
