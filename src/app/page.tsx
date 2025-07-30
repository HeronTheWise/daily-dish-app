
"use client";

import { useState, useTransition, useEffect } from "react";
import { Sparkles, MapPin, Loader2, AlertTriangle, Filter, Utensils, DollarSign, ChefHat, LocateFixed, Leaf, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DailyDishCard } from "@/components/food-app/daily-dish-card";
import { suggestDailyDish } from "@/ai/flows/suggest-daily-dish";
import type { SuggestDailyDishOutput } from "@/ai/flows/suggest-daily-dish";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import { useAuthContext } from "@/context/auth-context";

const DAILY_SUGGESTION_LIMIT = 5;

export default function Home() {
  const [isPending, startTransition] = useTransition();
  const [suggestion, setSuggestion] = useState<SuggestDailyDishOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Form State
  const [location, setLocation] = useState<string>("San Francisco, CA");
  const [cuisine, setCuisine] = useState<string>("any");
  const [priceRange, setPriceRange] = useState<string>("any");
  const [deliveryOnly, setDeliveryOnly] = useState<boolean>(false);
  const [courseType, setCourseType] = useState<string>("1 Course Meal");
  const [dietaryPreference, setDietaryPreference] = useState<string>("any");

  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const { toast } = useToast();
  const { user, login } = useAuthContext();
  const [dailySuggestionCount, setDailySuggestionCount] = useState(0);

  const getLocalStorageKey = () => {
    if (!user) return null;
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    return `dailySuggestionCount_${user.uid}_${today}`;
  };

  useEffect(() => {
    if (user && typeof window !== 'undefined') {
      const key = getLocalStorageKey();
      if (key) {
        const storedCount = localStorage.getItem(key);
        setDailySuggestionCount(storedCount ? parseInt(storedCount, 10) : 0);
      }
    } else {
      // Reset count if user logs out
      setDailySuggestionCount(0);
    }
  }, [user]);

  const isLimitReached = user ? dailySuggestionCount >= DAILY_SUGGESTION_LIMIT : true;

  const handleSuggestion = () => {
    if (!user) {
        toast({
            variant: "destructive",
            title: "Please Login",
            description: "You need to be logged in to get meal suggestions.",
        });
        login();
        return;
    }

    if (isLimitReached) {
        toast({
            variant: "destructive",
            title: "Daily Limit Reached",
            description: "You have used all your suggestions for today. Please come back tomorrow!",
        });
        return;
    }

    setError(null);
    setSuggestion(null);
    startTransition(async () => {
      const result = await suggestDailyDish({ 
        location,
        cuisine: cuisine === "any" ? undefined : cuisine,
        priceRange: priceRange === "any" ? undefined : priceRange,
        deliveryOnly: deliveryOnly || undefined,
        courseType: courseType,
        dietaryPreference: dietaryPreference === "any" ? undefined : dietaryPreference,
      });
      if (result) {
        setSuggestion(result);
        const newCount = dailySuggestionCount + 1;
        setDailySuggestionCount(newCount);
        const key = getLocalStorageKey();
        if (key) {
           localStorage.setItem(key, newCount.toString());
        }
      } else {
        setError("Could not get a suggestion. Please try again!");
      }
    });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
        handleSuggestion();
    }
  }

  const clearFilters = () => {
    setCuisine("any");
    setPriceRange("any");
    setDeliveryOnly(false);
    setCourseType("1 Course Meal");
    setDietaryPreference("any");
  }

  const handleUseMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Using a reverse geocoding service to get city from coordinates
          const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
          const data = await response.json();
          const city = data.city || data.locality || '';
          const state = data.principalSubdivisionCode.split('-').pop() || '';
          if (city && state) {
            const newLocation = `${city}, ${state}`;
            setLocation(newLocation);
            toast({
              title: "Location Updated",
              description: `Now suggesting for ${newLocation}.`,
            });
          } else {
            throw new Error("Could not determine location.");
          }
        } catch (error) {
          console.error("Error fetching location:", error);
           toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "Could not fetch your location. Please enter it manually.",
          })
        }
      }, (error) => {
        console.error("Geolocation error:", error);
         toast({
            variant: "destructive",
            title: "Location Access Denied",
            description: "Please allow location access in your browser settings to use this feature.",
          })
      });
    } else {
       toast({
        variant: "destructive",
        title: "Geolocation Not Supported",
        description: "Your browser does not support geolocation.",
      })
    }
  };


  const getButtonContent = () => {
      if (!user) {
          return <> <Lock className="mr-2 h-4 w-4" /> Please Login to Start</>;
      }
      if (isLimitReached) {
          return <> <Lock className="mr-2 h-4 w-4" /> Daily Limit Reached </>;
      }
      if (isPending) {
          return "Searching...";
      }
      return <> <Sparkles className="mr-2 h-4 w-4" /> Suggest a Meal</>;
  }

  return (
    <div className="container mx-auto max-w-7xl py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
          Your Daily Dish
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Tired of endless scrolling and decision fatigue? We give you <span className="text-primary font-semibold">one perfect meal suggestion</span> for your day. That's it.
        </p>
      </div>

      <div className="flex flex-col items-center">
        <Card className="w-full max-w-md p-6 mb-6">
            <div className="relative flex gap-2 items-center mb-4">
                 <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter a city..."
                    className="flex-1 pl-10 pr-12"
                    disabled={!user}
                />
                 <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8" onClick={handleUseMyLocation} aria-label="Use my location" disabled={!user}>
                    <LocateFixed className="h-5 w-5 text-muted-foreground" />
                </Button>
            </div>
            <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen} disabled={!user}>
                <CollapsibleTrigger asChild>
                    <Button variant="outline" className="w-full mb-4" disabled={!user}>
                        <Filter className="mr-2 h-4 w-4" />
                        {isFiltersOpen ? "Hide Filters" : "Show Filters"}
                    </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="cuisine" className="flex items-center mb-2"><Utensils className="mr-2 h-4 w-4" /> Cuisine</Label>
                            <Select value={cuisine} onValueChange={setCuisine}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Any Cuisine" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="any">Any Cuisine</SelectItem>
                                    <SelectItem value="Italian">Italian</SelectItem>
                                    <SelectItem value="Mexican">Mexican</SelectItem>
                                    <SelectItem value="Japanese">Japanese</SelectItem>
                                    <SelectItem value="Indian">Indian</SelectItem>
                                    <SelectItem value="Thai">Thai</SelectItem>
                                    <SelectItem value="Chinese">Chinese</SelectItem>
                                    <SelectItem value="American">American</SelectItem>
                                </SelectContent>
                             </Select>
                        </div>
                        <div>
                             <Label htmlFor="price" className="flex items-center mb-2"><DollarSign className="mr-2 h-4 w-4" /> Price Range</Label>
                             <Select value={priceRange} onValueChange={setPriceRange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Any Price" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="any">Any Price</SelectItem>
                                    <SelectItem value="$">$ (Affordable)</SelectItem>
                                    <SelectItem value="$$">$$ (Mid-Range)</SelectItem>
                                    <SelectItem value="$$$">$$$ (Expensive)</SelectItem>
                                </SelectContent>
                             </Select>
                        </div>
                    </div>
                     <div>
                        <Label htmlFor="dietary" className="flex items-center mb-2"><Leaf className="mr-2 h-4 w-4" /> Dietary Preference</Label>
                        <Select value={dietaryPreference} onValueChange={setDietaryPreference}>
                            <SelectTrigger>
                                <SelectValue placeholder="Any" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="any">Any</SelectItem>
                                <SelectItem value="Vegetarian">Vegetarian</SelectItem>
                                <SelectItem value="Non-Vegetarian">Non-Vegetarian</SelectItem>
                                <SelectItem value="Vegan">Vegan</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="course" className="flex items-center mb-2"><ChefHat className="mr-2 h-4 w-4" /> Meal Type</Label>
                        <Select value={courseType} onValueChange={setCourseType}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select meal type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1 Course Meal">1 Course Meal</SelectItem>
                                <SelectItem value="3 Course Meal">3 Course Meal</SelectItem>
                                <SelectItem value="Full Board">Full Board (Breakfast, Lunch, Dinner)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                            <Label htmlFor="delivery-only">Delivery Available</Label>
                            <p className="text-sm text-muted-foreground">
                                Show only places that offer delivery.
                            </p>
                        </div>
                        <Switch id="delivery-only" checked={deliveryOnly} onCheckedChange={setDeliveryOnly} />
                    </div>
                    <Button variant="ghost" size="sm" onClick={clearFilters} className="w-full text-muted-foreground">Clear Filters</Button>
                </CollapsibleContent>
            </Collapsible>
             <Button onClick={handleSuggestion} disabled={isPending || !location || (!isPending && isLimitReached)} className="w-full mt-4">
                {getButtonContent()}
            </Button>
            {user && <p className="text-xs text-center mt-2 text-muted-foreground">You have {DAILY_SUGGESTION_LIMIT - dailySuggestionCount} suggestions remaining today.</p>}
        </Card>

        {isPending && (
            <Card className="w-full max-w-md p-8 flex flex-col items-center justify-center text-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p className="text-lg text-muted-foreground">Finding the perfect meal in {location}...</p>
            </Card>
        )}

        {error && (
            <Card className="w-full max-w-md p-8 flex flex-col items-center justify-center text-center bg-destructive/10 border-destructive/50">
                <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
                <h3 className="text-xl font-semibold text-destructive mb-2">Oops!</h3>
                <p className="text-destructive/80 mb-6">{error}</p>
                <Button size="lg" onClick={handleSuggestion} variant="destructive">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Try Again
                </Button>
            </Card>
        )}

        {suggestion && (
          <div className="w-full space-y-8">
             <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight text-foreground">{suggestion.mealTitle}</h2>
                <p className="mt-2 max-w-2xl mx-auto text-md text-muted-foreground">{suggestion.reason}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
              {suggestion.dishes.map((dish, index) => (
                  <DailyDishCard 
                      key={index}
                      dish={dish}
                      deliveryApps={suggestion.deliveryApps}
                  />
              ))}
            </div>

            <Card className="overflow-hidden">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><MapPin/> Find Restaurants Near You</CardTitle>
                    <CardDescription>
                        Explore restaurants in {location} that might serve this cuisine.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="w-full h-96">
                        <iframe
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            loading="lazy"
                            allowFullScreen
                            src={`https://www.google.com/maps?q=${encodeURIComponent(`${suggestion.searchQuery}`)}&output=embed`}>
                        </iframe>
                    </div>
                </CardContent>
            </Card>

          </div>
        )}
      </div>
    </div>
  );
}
