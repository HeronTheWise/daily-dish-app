
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Utensils, Soup, Sandwich, Fish, Cake } from "lucide-react";

interface DishCardProps {
  dish: {
    name: string;
    description: string;
    course: string;
  };
}

const courseIcons: { [key: string]: React.ReactNode } = {
  "Appetizer": <Soup className="h-6 w-6 text-primary" />,
  "Main Course": <Utensils className="h-6 w-6 text-primary" />,
  "Main": <Utensils className="h-6 w-6 text-primary" />,
  "Dessert": <Cake className="h-6 w-6 text-primary" />,
  "Breakfast": <Sandwich className="h-6 w-6 text-primary" />,
  "Lunch": <Fish className="h-6 w-6 text-primary" />,
  "Dinner": <Utensils className="h-6 w-6 text-primary" />,
  "Default": <Utensils className="h-6 w-6 text-primary" />,
};


export function DishCard({ dish }: DishCardProps) {
  return (
    <Card className="h-full flex flex-col">
        <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
                 {courseIcons[dish.course] || courseIcons["Default"]}
                <div>
                    <p className="text-sm font-medium text-primary">{dish.course}</p>
                     {dish.name}
                </div>
            </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
            <CardDescription>{dish.description}</CardDescription>
        </CardContent>
    </Card>
  )
}
