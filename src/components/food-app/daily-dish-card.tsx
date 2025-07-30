
import Image from "next/image";
import { Utensils, Bike, ChefHat, Youtube } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface DailyDishCardProps {
  dish: {
      name: string;
      description: string;
      course: string;
      recipe: {
          ingredients: string[];
          instructions: string;
      };
      imageHint: string;
  };
  deliveryApps: string[];
}

export function DailyDishCard({ dish, deliveryApps }: DailyDishCardProps) {
 
  return (
    <Card className="group w-full flex flex-col h-full max-w-md overflow-hidden rounded-xl border shadow-lg transition-all hover:shadow-2xl">
      <CardHeader className="p-0">
        <div className="relative">
          <Image
            src={`https://placehold.co/600x400.png`}
            alt={`Image of ${dish.name}`}
            width={600}
            height={400}
            className="h-60 w-full object-cover"
            data-ai-hint={dish.imageHint}
          />
           <Badge
              variant="default"
              className="absolute top-4 left-4 bg-primary/90 text-primary-foreground font-bold text-sm px-3 py-1"
            >
              {dish.course}
            </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6 flex-grow">
        <CardTitle className="text-2xl font-bold tracking-tight mb-2">{dish.name}</CardTitle>
        <CardDescription className="text-base mb-4">{dish.description}</CardDescription>
        
        <Separator className="my-4"/>

         <div className="space-y-4 text-foreground/90 mb-6">
             <div className="flex items-start gap-3">
                <Utensils className="h-5 w-5 mt-1 text-primary shrink-0" />
                 <div>
                    <h4 className="font-semibold">Find it near you</h4>
                    <p className="text-muted-foreground text-sm">Check the map for local restaurants.</p>
                </div>
            </div>
        </div>

        {dish.recipe && (
             <div className="mt-auto">
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="recipe">
                        <AccordionTrigger>
                            <div className="flex items-center gap-3 text-lg font-semibold">
                                <ChefHat className="h-6 w-6 text-primary" />
                                <span>Cook it yourself</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-2">
                             <div className="space-y-4">
                                <div>
                                    <h4 className="font-semibold text-md mb-2">Ingredients</h4>
                                    <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
                                        {dish.recipe.ingredients.map((item, index) => <li key={index}>{item}</li>)}
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-md mb-2">Instructions</h4>
                                    <p className="text-muted-foreground whitespace-pre-wrap text-sm">{dish.recipe.instructions}</p>
                                </div>
                                <Button asChild variant="outline" size="sm">
                                    <a href={`https://www.youtube.com/results?search_query=how+to+cook+${encodeURIComponent(dish.name)}`} target="_blank" rel="noopener noreferrer">
                                        <Youtube className="mr-2 h-4 w-4 text-red-600" />
                                        Watch Tutorial
                                    </a>
                                </Button>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        )}

      </CardContent>
      {deliveryApps && deliveryApps.length > 0 && (
          <CardFooter className="p-6 pt-0 border-t mt-auto">
            <div className="w-full">
              <h4 className="font-semibold mb-3 flex items-center gap-2 text-sm">
                <Bike className="h-5 w-5 text-primary" />
                Order Delivery
              </h4>
              <div className="flex flex-wrap gap-2">
                {deliveryApps.map((app, index) => (
                  <Button asChild key={`${app}-${index}`} variant="outline" size="sm">
                    <a href={`https://www.google.com/search?q=${encodeURIComponent(`${dish.name} on ${app}`)}`} target="_blank" rel="noopener noreferrer">
                      {app}
                    </a>
                  </Button>
                ))}
              </div>
            </div>
          </CardFooter>
      )}
    </Card>
  );
}
