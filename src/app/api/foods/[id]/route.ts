import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { FoodType } from "@/types/food";

interface UpdateFoodRequest {
  name: string;
  ingredients: string;
  description: string;
  type: FoodType;
  imageUrl?: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const food = await prisma.food.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!food) {
      return NextResponse.json({ error: "Food not found" }, { status: 404 });
    }

    return NextResponse.json(food);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to fetch food" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body: UpdateFoodRequest = await request.json();

    if (!body.name || !body.ingredients || !body.description || !body.type) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          required: ["name", "ingredients", "description", "type"],
        },
        { status: 400 }
      );
    }

    // Validasi FoodType enum
    const validFoodTypes: FoodType[] = ["uph", "fresh"];
    if (!validFoodTypes.includes(body.type)) {
      return NextResponse.json(
        {
          error: "Invalid food type",
          validTypes: validFoodTypes,
        },
        { status: 400 }
      );
    }

    // Check if food exists
    const existingFood = await prisma.food.findUnique({
      where: { id: params.id },
    });

    if (!existingFood) {
      return NextResponse.json({ error: "Food not found" }, { status: 404 });
    }

    const updatedFood = await prisma.food.update({
      where: {
        id: params.id,
      },
      data: {
        name: body.name.trim(),
        ingredients: body.ingredients.trim(),
        description: body.description.trim(),
        type: body.type,
        imageUrl: body.imageUrl?.trim() || null,
      },
    });

    return NextResponse.json(updatedFood);
  } catch (error) {
    console.error("Database error:", error);

    // Better error handling
    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: "Failed to update food",
          message:
            process.env.NODE_ENV === "development" ? error.message : undefined,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if food exists
    const existingFood = await prisma.food.findUnique({
      where: { id: params.id },
    });

    if (!existingFood) {
      return NextResponse.json({ error: "Food not found" }, { status: 404 });
    }

    await prisma.food.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json(
      { message: "Food deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Database error:", error);

    // Better error handling
    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: "Failed to delete food",
          message:
            process.env.NODE_ENV === "development" ? error.message : undefined,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
