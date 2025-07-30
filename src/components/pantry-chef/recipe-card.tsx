import { Recipe } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingBasket, Lock, Flame, Utensils } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface RecipeCardProps {
  recipe: Recipe;
  isPremium: boolean;
}

export function RecipeCard({ recipe, isPremium }: RecipeCardProps) {
  return (
    <Card className="flex flex-col h-full shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="font-headline text-xl">{recipe.name}</CardTitle>
        <CardDescription>A delicious recipe suggestion for you.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex-grow space-y-4">
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2"><Utensils className="h-4 w-4 text-primary" />Ingredients</h4>
            <div className="flex flex-wrap gap-2">
              {recipe.ingredients.map((ingredient) => (
                <Badge key={ingredient} variant="secondary">{ingredient}</Badge>
              ))}
            </div>
          </div>
          <Separator />
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2"><Flame className="h-4 w-4 text-primary" />Instructions</h4>
            <ScrollArea className="h-48 pr-4">
              <p className="text-sm whitespace-pre-wrap text-muted-foreground">{recipe.instructions}</p>
            </ScrollArea>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" disabled={!isPremium}>
          {!isPremium ? <Lock className="mr-2 h-4 w-4" /> : <ShoppingBasket className="mr-2 h-4 w-4" />}
          Add to Shopping List
        </Button>
      </CardFooter>
    </Card>
  );
}
