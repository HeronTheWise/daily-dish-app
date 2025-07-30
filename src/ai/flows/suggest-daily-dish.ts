
'use server';

/**
 * @fileOverview Suggests a daily dish or meal based on location, popularity, and other user preferences.
 * 
 * - suggestDailyDish - A function that suggests a dish or meal.
 * - SuggestDailyDishInput - The input type for the suggestDailyDish function.
 * - SuggestDailyDishOutput - The return type for the suggestDailyDish function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestDailyDishInputSchema = z.object({
  location: z.string().describe('The location to base the suggestion on.'),
  priceRange: z.string().optional().describe("The desired price range (e.g., '$', '$$', '$$$')."),
  cuisine: z.string().optional().describe("A specific cuisine type to filter by (e.g., 'Italian', 'Mexican')."),
  deliveryOnly: z.boolean().optional().describe("Whether to suggest only restaurants that offer delivery."),
  courseType: z.string().optional().describe("The desired meal type (e.g., '1 Course Meal', '3 Course Meal', 'Full Board')."),
  dietaryPreference: z.string().optional().describe("The dietary preference (e.g., 'Vegetarian', 'Non-Vegetarian', 'Vegan').")
});
export type SuggestDailyDishInput = z.infer<typeof SuggestDailyDishInputSchema>;

const DishSchema = z.object({
  name: z.string().describe("The name of the dish."),
  description: z.string().describe("A tantalizing description of the dish."),
  course: z.string().describe("The course this dish belongs to (e.g., Appetizer, Main, Dessert, Breakfast)."),
  recipe: z.object({
    ingredients: z.array(z.string()).describe("A list of ingredients needed for this dish."),
    instructions: z.string().describe("Step-by-step instructions to cook this dish."),
  }).describe("A detailed recipe for the dish."),
  imageHint: z.string().describe("A one or two-word hint for generating an image of this dish, e.g., 'pad thai' or 'pepperoni pizza'"),
});

const SuggestDailyDishOutputSchema = z.object({
    mealTitle: z.string().describe("The title for the suggested meal plan (e.g., 'Today's 3-Course Italian Feast')."),
    dishes: z.array(DishSchema).describe("An array of dishes that make up the meal. Each dish must have its own recipe."),
    searchQuery: z.string().describe("A Google search query to find restaurants serving this type of meal in the user's location. For example, 'best pad thai in San Francisco'."),
    reason: z.string().describe("A brief explanation for why this meal was chosen today (e.g., based on popularity, local trends, or weather)."),
    deliveryApps: z.array(z.string()).describe("A list of popular food delivery app names (e.g., Zomato, Swiggy, Uber Eats)."),
});
export type SuggestDailyDishOutput = z.infer<typeof SuggestDailyDishOutputSchema>;

export async function suggestDailyDish(input: SuggestDailyDishInput): Promise<SuggestDailyDishOutput> {
  return suggestDailyDishFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestDailyDishPrompt',
  input: {schema: SuggestDailyDishInputSchema},
  output: {schema: SuggestDailyDishOutputSchema},
  model: 'googleai/gemini-1.5-flash',
  prompt: `You are an expert chef and food curator who provides a single, perfect meal-of-the-day recommendation. Your suggestions must be based on real, well-known dishes. Do NOT invent new or hybrid dishes. The combination of dishes in a meal must be logical and coherent. Each time you run, provide a new, surprising, and varied recommendation.

  Based on the provided location and user preferences, you will suggest a meal. This could be a single dish, a multi-course meal, or a full day's plan (for 'Full Board').
  - For "1 Course Meal", suggest one authentic dish.
  - For "3 Course Meal", suggest an appetizer, a main course, and a dessert that are commonly served together in the specified cuisine.
  - For "Full Board", suggest a breakfast, lunch, and dinner that make sense for a full day of eating within the user's preferences.
  
  Your suggestion must include:
  - A creative but realistic title for the meal.
  - A list of the dishes. Each dish must be an authentic, real-world dish.
  - FOR EVERY SINGLE DISH, you must provide a detailed recipe including ingredients and instructions.
  - FOR EVERY SINGLE DISH, you must provide a 1-2 word image hint.
  - A concise Google search query to find restaurants serving this meal in the user's location. For example, "best tacos in Austin" or "top-rated vegetarian pasta in San Francisco".
  - A compelling reason why this meal is the pick of the day for that location.
  - A list of 2-3 popular delivery app names (like Zomato, Swiggy, Uber Eats).

  User Preferences:
  Location: {{location}}
  {{#if priceRange}}Price Range: {{priceRange}}{{/if}}
  {{#if cuisine}}Cuisine: {{cuisine}}{{/if}}
  {{#if courseType}}Meal Type: {{courseType}}{{/if}}
  {{#if dietaryPreference}}Dietary Preference: {{dietaryPreference}}{{/if}}
  {{#if deliveryOnly}}Delivery Options Required: Yes{{/if}}
  `,
});

const suggestDailyDishFlow = ai.defineFlow(
  {
    name: 'suggestDailyDishFlow',
    inputSchema: SuggestDailyDishInputSchema,
    outputSchema: SuggestDailyDishOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
