"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { Food, FoodType } from "@/types/food";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BackButton } from "@/components/BackButton";
import { DeleteButton } from "@/components/DeleteButton";
import {
  Edit,
  Save,
  X,
  Calendar,
  UtensilsCrossed,
  Loader2,
} from "lucide-react";

export default function FoodDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [food, setFood] = useState<Food | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    ingredients: "",
    type: "uph" as FoodType,
    imageUrl: "",
  });

  const fetchFood = useCallback(async () => {
    try {
      const response = await fetch(`/api/foods/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setFood(data);
        setEditForm({
          name: data.name,
          description: data.description,
          ingredients: data.ingredients,
          type: data.type,
          imageUrl: data.imageUrl || "",
        });
      } else {
        console.error("Failed to fetch food");
      }
    } catch (error) {
      console.error("Error fetching food:", error);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    if (params.id) {
      fetchFood();
    }
  }, [params.id, fetchFood]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (food) {
      setEditForm({
        name: food.name,
        description: food.description,
        ingredients: food.ingredients,
        type: food.type,
        imageUrl: food.imageUrl || "",
      });
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/foods/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editForm),
      });

      if (response.ok) {
        const updatedFood = await response.json();
        setFood(updatedFood);
        setIsEditing(false);
        alert("Food updated successfully!");
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to update food");
      }
    } catch (error) {
      console.error("Error updating food:", error);
      alert("Error updating food. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-16 w-16 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading food details...</p>
        </div>
      </div>
    );
  }

  if (!food) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <UtensilsCrossed className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Food Not Found</h1>
          <p className="text-gray-600 mb-6">
            The food item you&apos;re looking for doesn&apos;t exist.
          </p>
          <BackButton label="Back to Home" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <BackButton />

          {!isEditing && (
            <div className="flex gap-3">
              <Button
                onClick={handleEdit}
                variant="outline"
                className="text-blue-600 border-blue-200 hover:bg-blue-50"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <DeleteButton
                foodId={food.id}
                foodName={food.name}
                onDeleteSuccess={() => router.push("/")}
              />
            </div>
          )}

          {isEditing && (
            <div className="flex gap-3">
              <Button
                onClick={handleCancel}
                variant="outline"
                disabled={isSaving}
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700"
                disabled={isSaving}
              >
                {isSaving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save
              </Button>
            </div>
          )}
        </div>

        <Card className="bg-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              {isEditing ? (
                <div className="flex-1 space-y-4">
                  <div>
                    <Label htmlFor="name">Nama Makanan</Label>
                    <Input
                      id="name"
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm({ ...editForm, name: e.target.value })
                      }
                      placeholder="Masukkan nama makanan"
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Tipe Makanan</Label>
                    <select
                      id="type"
                      value={editForm.type}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          type: e.target.value as FoodType,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="uph">UPH</option>
                      <option value="fresh">Fresh</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="imageUrl">URL Gambar (Optional)</Label>
                    <Input
                      id="imageUrl"
                      value={editForm.imageUrl}
                      onChange={(e) =>
                        setEditForm({ ...editForm, imageUrl: e.target.value })
                      }
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-900">
                      {food.name}
                    </CardTitle>
                    <div className="flex items-center space-x-4 mt-2">
                      <Badge
                        className={
                          food.type === "fresh"
                            ? "bg-green-100 text-green-800"
                            : "bg-purple-100 text-purple-800"
                        }
                      >
                        {food.type.toUpperCase()}
                      </Badge>
                      <div className="flex items-center text-gray-500 text-sm">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(food.createdAt).toLocaleDateString("id-ID")}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div>
              <Label className="text-lg font-semibold text-gray-900">
                Deskripsi
              </Label>
              {isEditing ? (
                <Textarea
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  placeholder="Masukkan deskripsi makanan"
                  rows={4}
                  className="mt-2"
                />
              ) : (
                <p className="text-gray-600 mt-2 leading-relaxed">
                  {food.description}
                </p>
              )}
            </div>

            <div>
              <Label className="text-lg font-semibold text-gray-900">
                Bahan-bahan
              </Label>
              {isEditing ? (
                <Textarea
                  value={editForm.ingredients}
                  onChange={(e) =>
                    setEditForm({ ...editForm, ingredients: e.target.value })
                  }
                  placeholder="Masukkan bahan-bahan"
                  rows={4}
                  className="mt-2"
                />
              ) : (
                <p className="text-gray-600 mt-2 leading-relaxed whitespace-pre-line">
                  {food.ingredients}
                </p>
              )}
            </div>

            {food.imageUrl && (
              <div>
                <Label className="text-lg font-semibold text-gray-900">
                  Gambar
                </Label>
                <div className="mt-2">
                  <Image
                    src={food.imageUrl}
                    alt={food.name}
                    width={400}
                    height={256}
                    className="w-full max-w-md h-64 object-cover rounded-lg border"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                    }}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
