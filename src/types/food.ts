export type FoodType = "uph" | "fresh";

export interface Food {
  id: string;
  name: string;
  ingredients: string;
  description: string;
  type: FoodType;
  imageUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
