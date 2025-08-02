import Link from "next/link";
import { ChefHat, Github, Mail, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-card/50 border-t border-border backdrop-blur-sm mt-20">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-orange-500 rounded-full flex items-center justify-center">
                <ChefHat className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">
                Food CRUD App
              </span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-md leading-relaxed">
              A modern food management application built with Next.js,
              TypeScript, and Tailwind CSS. Create, manage, and discover amazing
              recipes with our intuitive interface.
            </p>
            <div className="flex items-center space-x-4 mt-6">
              <a
                href="https://github.com/hannanrozen"
                className="text-muted-foreground hover:text-primary transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="mailto:hannanrozen4567@gmail.com"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/create"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Add Food
                </Link>
              </li>
              <li>
                <Link
                  href="#food-collection"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Browse Foods
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="text-muted-foreground">🏫 UPH Foods</span>
              </li>
              <li>
                <span className="text-muted-foreground">🌱 Fresh Foods</span>
              </li>
              <li>
                <span className="text-muted-foreground">🍳 All Recipes</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            © 2025 Food CRUD App. Built with Next.js & TypeScript.
          </p>
          <div className="flex items-center text-muted-foreground text-sm mt-4 md:mt-0">
            Made with <Heart className="h-4 w-4 mx-1 text-red-500" /> for food
            lovers
          </div>
        </div>
      </div>
    </footer>
  );
}
