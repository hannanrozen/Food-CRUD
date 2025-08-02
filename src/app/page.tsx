import Link from "next/link";
import { Food } from "@/types/food";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChefHat, Plus, Eye, Pencil } from "lucide-react";
import { DeleteButton } from "@/components/DeleteButton";

async function getFoods(): Promise<Food[]> {
  const baseUrl =
    process.env.NODE_ENV === "production"
      ? "https://your-domain.com"
      : "http://localhost:3000";

  try {
    const res = await fetch(`${baseUrl}/api/foods`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch foods");
    }

    const data = await res.json();
    return Array.isArray(data) ? data : data.foods || [];
  } catch (error) {
    console.error("Error fetching foods:", error);
    return [];
  }
}

export default async function HomePage() {
  const foods = await getFoods();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ChefHat className="h-8 w-8 text-orange-500" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Food Manager
                </h1>
                <p className="text-gray-600">
                  Kelola koleksi makanan favorit Anda
                </p>
              </div>
            </div>
            <Link href="/create">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                <Plus className="mr-2 h-4 w-4" />
                Tambah Makanan
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Makanan
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {foods.length}
                  </p>
                </div>
                <ChefHat className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Fresh Food
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {foods.filter((food) => food.type === "fresh").length}
                  </p>
                </div>
                <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-sm font-bold">F</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-l-4 border-l-purple-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">UPH Food</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {foods.filter((food) => food.type === "uph").length}
                  </p>
                </div>
                <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 text-sm font-bold">U</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white">
          <CardHeader className="border-b border-gray-200">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold text-gray-900">
                Daftar Makanan
              </CardTitle>
              <Link href="/create">
                <Button variant="outline" size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {foods.length === 0 ? (
              <div className="text-center py-12">
                <ChefHat className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Belum ada makanan
                </h3>
                <p className="text-gray-500 mb-6">
                  Mulai menambahkan makanan favorit Anda
                </p>
                <Link href="/create">
                  <Button className="bg-orange-500 hover:bg-orange-600">
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Makanan Pertama
                  </Button>
                </Link>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold text-gray-900">
                      Nama
                    </TableHead>
                    <TableHead className="font-semibold text-gray-900">
                      Tipe
                    </TableHead>
                    <TableHead className="font-semibold text-gray-900">
                      Deskripsi
                    </TableHead>
                    <TableHead className="font-semibold text-gray-900">
                      Dibuat
                    </TableHead>
                    <TableHead className="font-semibold text-gray-900 text-right">
                      Aksi
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {foods.map((food) => (
                    <TableRow
                      key={food.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <TableCell className="font-medium text-gray-900">
                        {food.name}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            food.type === "fresh"
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : "bg-purple-100 text-purple-800 hover:bg-purple-100"
                          }
                        >
                          {food.type.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <p className="truncate text-gray-600">
                          {food.description}
                        </p>
                      </TableCell>
                      <TableCell className="text-gray-500">
                        {new Date(food.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Link href={`/foods/${food.id}`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-blue-600 border-blue-200 hover:bg-blue-50"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={`/foods/${food.id}`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-green-600 border-green-200 hover:bg-green-50"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </Link>
                          <DeleteButton foodId={food.id} foodName={food.name} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
