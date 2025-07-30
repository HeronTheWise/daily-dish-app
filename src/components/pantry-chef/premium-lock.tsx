import { Lock, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function PremiumLock({ message = "This is a premium feature" }: { message?: string }) {
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 rounded-lg bg-background/90 backdrop-blur-sm p-4">
      <div className="flex items-center gap-2">
        <Lock className="h-6 w-6 text-accent-foreground" />
        <p className="text-center text-lg font-semibold text-foreground">{message}</p>
      </div>
      <Button size="sm" className="mt-2 bg-accent text-accent-foreground hover:bg-accent/90">
        <Star className="mr-2 h-4 w-4" />
        Upgrade to Premium
      </Button>
    </div>
  );
}
