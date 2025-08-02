"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FoodType } from "@/types/food";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BackButton } from "@/components/BackButton";
import {
  ChefHat,
  Loader2,
  Plus,
  ImageIcon,
  FileText,
  List,
  Tag,
} from "lucide-react";

export default function CreatePage() {
  const [name, setName] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<FoodType>("uph");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const router = useRouter();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = "Food name is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (!ingredients.trim()) newErrors.ingredients = "Ingredients are required";

    if (imageUrl.trim() && !isValidUrl(imageUrl.trim())) {
      newErrors.imageUrl = "Please enter a valid URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    const requestData = {
      name: name.trim(),
      ingredients: ingredients.trim(),
      description: description.trim(),
      type,
      imageUrl: imageUrl.trim() || undefined, // Kirim undefined jika kosong
    };

    console.log("Sending request data:", requestData);

    try {
      const response = await fetch("/api/foods", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        // Reset form setelah berhasil
        setName("");
        setDescription("");
        setIngredients("");
        setImageUrl("");
        setType("uph");
        router.push("/");
      } else {
        const errorData = await response.json();
        console.error("Server error:", errorData);
        setErrors({
          submit: `Error: ${errorData.error || "Failed to create food"}${
            errorData.message ? ` - ${errorData.message}` : ""
          }`,
        });
      }
    } catch (error) {
      console.error("Network error creating food:", error);
      setErrors({
        submit:
          "Network error. Please check your internet connection and try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <Card className="glass-effect border-2">
          <CardHeader className="text-center pb-8">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <ChefHat className="h-16 w-16 text-primary" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                  <Plus className="h-3 w-3 text-white" />
                </div>
              </div>
            </div>
            <CardTitle className="text-4xl mb-4">
              <span className="gradient-text">Create New Food</span>
            </CardTitle>
            <CardDescription className="text-lg">
              Add a new delicious food item to your collection
            </CardDescription>
          </CardHeader>
          <CardContent>
            {errors.submit && (
              <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                {errors.submit}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="flex items-center text-sm font-medium"
                >
                  <FileText className="mr-2 h-4 w-4 text-primary" />
                  Food Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter food name"
                  className={`transition-all duration-300 ${
                    errors.name
                      ? "border-destructive focus:border-destructive"
                      : "focus:border-primary"
                  }`}
                  required
                />
                {errors.name && (
                  <p className="text-destructive text-xs mt-1">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="description"
                  className="flex items-center text-sm font-medium"
                >
                  <FileText className="mr-2 h-4 w-4 text-primary" />
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your food..."
                  rows={4}
                  className={`transition-all duration-300 resize-none ${
                    errors.description
                      ? "border-destructive focus:border-destructive"
                      : "focus:border-primary"
                  }`}
                  required
                />
                {errors.description && (
                  <p className="text-destructive text-xs mt-1">
                    {errors.description}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="imageUrl"
                  className="flex items-center text-sm font-medium"
                >
                  <ImageIcon className="mr-2 h-4 w-4 text-primary" />
                  Image URL (Optional)
                </Label>
                <Input
                  id="imageUrl"
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className={`transition-all duration-300 ${
                    errors.imageUrl
                      ? "border-destructive focus:border-destructive"
                      : "focus:border-primary"
                  }`}
                />
                {errors.imageUrl && (
                  <p className="text-destructive text-xs mt-1">
                    {errors.imageUrl}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="ingredients"
                  className="flex items-center text-sm font-medium"
                >
                  <List className="mr-2 h-4 w-4 text-primary" />
                  Ingredients
                </Label>
                <Textarea
                  id="ingredients"
                  value={ingredients}
                  onChange={(e) => setIngredients(e.target.value)}
                  placeholder="List ingredients separated by commas (e.g., Rice, Chicken, Vegetables)"
                  rows={3}
                  className={`transition-all duration-300 resize-none ${
                    errors.ingredients
                      ? "border-destructive focus:border-destructive"
                      : "focus:border-primary"
                  }`}
                  required
                />
                {errors.ingredients && (
                  <p className="text-destructive text-xs mt-1">
                    {errors.ingredients}
                  </p>
                )}
                {ingredients && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    Ingredients count:{" "}
                    {ingredients.split(",").filter((i) => i.trim()).length}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="type"
                  className="flex items-center text-sm font-medium"
                >
                  <Tag className="mr-2 h-4 w-4 text-primary" />
                  Food Type
                </Label>
                <select
                  id="type"
                  value={type}
                  onChange={(e) => setType(e.target.value as FoodType)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 focus:border-primary"
                >
                  <option value="uph">🏫 UPH (University Traditional)</option>
                  <option value="fresh">🌱 Fresh (Modern Cuisine)</option>
                </select>
                <p className="text-xs text-muted-foreground">
                  {type === "uph"
                    ? "Traditional university recipes and local dishes"
                    : "Modern, fresh, and contemporary cuisine"}
                </p>
              </div>

              <div className="flex gap-4 pt-6">
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <ChefHat className="mr-2 h-4 w-4" />
                      Create Food
                    </>
                  )}
                </Button>
                <BackButton label="Cancel" className="flex-1" />
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
