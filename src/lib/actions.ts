"use server";

import { z } from "zod";
import { generateRecipes } from "@/ai/flows/generate-recipes";
import { scanIngredients } from "@/ai/flows/scan-ingredients";
import type { Recipe } from "./types";

const scanIngredientsSchema = z.object({
  image: z.instanceof(File).refine((file) => file.size > 0, { message: "Image is required." }),
});

export async function handleScanIngredients(formData: FormData): Promise<{ ingredients?: string[]; error?: string }> {
  const rawFormData = {
    image: formData.get('image'),
  };
  
  const validatedFields = scanIngredientsSchema.safeParse(rawFormData);
  if (!validatedFields.success) {
    return { error: 'Invalid image file.' };
  }

  const { image } = validatedFields.data;

  try {
    const buffer = await image.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const photoDataUri = `data:${image.type};base64,${base64}`;

    const result = await scanIngredients({ photoDataUri });
    
    if (result.ingredients.length === 0) {
      return { error: "Couldn't find any ingredients in the image. Try a clearer photo!" };
    }
    
    return { ingredients: result.ingredients };
  } catch (e) {
    console.error(e);
    return { error: 'Failed to scan ingredients. Please try again.' };
  }
}

export async function handleGenerateRecipes(ingredients: string[], dietaryPreferences: string[]): Promise<{ recipes?: Recipe[]; error?: string }> {
  if (ingredients.length === 0) {
    return { error: 'Please add some ingredients first.' };
  }

  try {
    const result = await generateRecipes({ ingredients, dietaryPreferences });
    return { recipes: result.recipes };
  } catch (e) {
    console.error(e);
    return { error: 'Failed to generate recipes. Please try again.' };
  }
}
