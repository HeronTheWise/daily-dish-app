"use client"

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, PlusCircle, Salad } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface IngredientEditorProps {
    ingredients: string[];
    onIngredientsChange: (ingredients: string[]) => void;
}

export function IngredientEditor({ ingredients, onIngredientsChange }: IngredientEditorProps) {
    const [newIngredient, setNewIngredient] = useState("");

    const handleAddIngredient = () => {
        if (newIngredient.trim() && !ingredients.includes(newIngredient.trim())) {
            onIngredientsChange([...ingredients, newIngredient.trim()]);
            setNewIngredient("");
        }
    };

    const handleRemoveIngredient = (ingredientToRemove: string) => {
        onIngredientsChange(ingredients.filter(ing => ing !== ingredientToRemove));
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleAddIngredient();
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <div className="flex items-center gap-2 text-2xl">
                        <Salad className="text-primary" />
                        Your Ingredients
                    </div>
                </CardTitle>
                <CardDescription>
                    Review the scanned ingredients. You can add or remove items before generating recipes.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                    {ingredients.map(ingredient => (
                        <Badge key={ingredient} variant="secondary" className="text-base py-1 pl-3 pr-1">
                            {ingredient}
                            <button
                                onClick={() => handleRemoveIngredient(ingredient)}
                                className="ml-2 rounded-full p-0.5 hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors"
                            >
                                <X className="h-3 w-3" />
                                <span className="sr-only">Remove {ingredient}</span>
                            </button>
                        </Badge>
                    ))}
                </div>
                <div className="flex gap-2">
                    <Input
                        value={newIngredient}
                        onChange={(e) => setNewIngredient(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Add another ingredient..."
                        aria-label="Add new ingredient"
                    />
                    <Button onClick={handleAddIngredient} variant="outline" size="icon" aria-label="Add Ingredient">
                        <PlusCircle className="h-4 w-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
