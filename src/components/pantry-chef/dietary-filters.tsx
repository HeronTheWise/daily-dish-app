import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { PremiumLock } from "./premium-lock";
import { LeafyGreen, WheatOff, MilkOff } from "lucide-react";

interface DietaryFiltersProps {
    isPremium: boolean;
    selectedPreferences: string[];
    onSelectionChange: (preferences: string[]) => void;
}

const dietaryOptions = [
    { id: "vegetarian", label: "Vegetarian", icon: <LeafyGreen className="h-5 w-5 text-green-600" /> },
    { id: "vegan", label: "Vegan", icon: <LeafyGreen className="h-5 w-5 text-green-800" /> },
    { id: "gluten-free", label: "Gluten-Free", icon: <WheatOff className="h-5 w-5 text-yellow-600" /> },
    { id: "dairy-free", label: "Dairy-Free", icon: <MilkOff className="h-5 w-5 text-blue-400" /> },
]

export function DietaryFilters({ isPremium, selectedPreferences, onSelectionChange }: DietaryFiltersProps) {

    const handleCheckedChange = (checked: boolean, id: string) => {
        if (checked) {
            onSelectionChange([...selectedPreferences, id]);
        } else {
            onSelectionChange(selectedPreferences.filter(pref => pref !== id));
        }
    };

    return (
        <div className="relative">
            {!isPremium && <PremiumLock />}
            <fieldset disabled={!isPremium}>
                <legend className="font-semibold mb-2 text-foreground">Dietary Preferences</legend>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {dietaryOptions.map(option => (
                        <div key={option.id} className="flex items-center space-x-2 p-3 rounded-lg border bg-background hover:bg-secondary/50 transition-colors">
                            <Checkbox
                                id={option.id}
                                checked={selectedPreferences.includes(option.id)}
                                onCheckedChange={(checked) => handleCheckedChange(checked as boolean, option.id)}
                            />
                            <Label htmlFor={option.id} className="flex items-center gap-2 cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                {option.icon}
                                {option.label}
                            </Label>
                        </div>
                    ))}
                </div>
            </fieldset>
        </div>
    );
}
