import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { FoodType } from "@/types/food";

interface CreateFoodRequest {
  name: string;
  ingredients: string;
  description: string;
  type: FoodType;
  imageUrl?: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") as FoodType | null;
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");
    const search = searchParams.get("search");

    const where: {
      type?: FoodType;
      OR?: Array<{
        name?: { contains: string; mode: "insensitive" };
        description?: { contains: string; mode: "insensitive" };
        ingredients?: { contains: string; mode: "insensitive" };
      }>;
    } = {};

    if (type && ["uph", "fresh"].includes(type)) {
      where.type = type;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { ingredients: { contains: search, mode: "insensitive" } },
      ];
    }

    const [foods, totalCount] = await Promise.all([
      prisma.food.findMany({
        where,
        orderBy: {
          createdAt: "desc",
        },
        take: limit,
        skip: offset,
      }),
      prisma.food.count({ where }),
    ]);

    return NextResponse.json({
      foods,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount,
      },
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch foods",
        message:
          process.env.NODE_ENV === "development"
            ? (error as Error).message
            : undefined,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateFoodRequest = await request.json();

    // Validasi input dengan type safety yang lebih fleksibel
    if (
      !body.name?.trim() ||
      !body.ingredients?.trim() ||
      !body.description?.trim() ||
      !body.type
    ) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          required: ["name", "ingredients", "description", "type"],
          received: {
            name: !!body.name?.trim(),
            ingredients: !!body.ingredients?.trim(),
            description: !!body.description?.trim(),
            type: !!body.type,
          },
        },
        { status: 400 }
      );
    }

    // Validasi FoodType enum dengan array yang lebih eksplisit
    const validFoodTypes: FoodType[] = ["uph", "fresh"];
    if (!validFoodTypes.includes(body.type)) {
      return NextResponse.json(
        {
          error: "Invalid food type",
          validTypes: validFoodTypes,
          received: body.type,
        },
        { status: 400 }
      );
    }

    // Handle imageUrl yang benar-benar optional
    let finalImageUrl: string | null = null;
    if (body.imageUrl && body.imageUrl.trim() !== "") {
      finalImageUrl = body.imageUrl.trim();
    }

    const food = await prisma.food.create({
      data: {
        name: body.name.trim(),
        ingredients: body.ingredients.trim(),
        description: body.description.trim(),
        type: body.type,
        imageUrl: finalImageUrl,
      },
    });

    return NextResponse.json(food, { status: 201 });
  } catch (error) {
    console.error("Database error dalam POST /api/foods:", error);

    // Better error handling dengan lebih detail
    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: "Failed to create food",
          message: error.message,
          details:
            process.env.NODE_ENV === "development" ? error.stack : undefined,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
