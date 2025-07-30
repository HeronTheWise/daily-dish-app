import { ChefHat } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        <div className="flex items-center gap-2">
          <ChefHat className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold text-primary font-headline">Pantry Chef</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost">Login</Button>
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90">Sign Up</Button>
        </div>
      </div>
    </header>
  );
}
