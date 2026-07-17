"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useStore } from "./context/store-context";
import { ProductCard } from "./components/product-card";
import { Sparkles, SlidersHorizontal, ArrowDown, Search, Heart, RefreshCw } from "lucide-react";

const ShopContent: React.FC = () => {
  const { products, wishlist } = useStore();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState<"all" | "under-100" | "100-200" | "over-200">("all");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "rating">("featured");
  // Sync Search Query from URL parameter
  const searchQuery = searchParams.get("q") || "";

  const categories = ["All", "Audio", "Wearables", "Accessories", "Smart Home"];

  // Filter and Sort Logic
  const filteredProducts = products.filter((product) => {
    // 1. Category Filter
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;

    // 2. Price Filter
    let matchesPrice = true;
    if (priceRange === "under-100") matchesPrice = product.price < 100;
    else if (priceRange === "100-200") matchesPrice = product.price >= 100 && product.price <= 200;
    else if (priceRange === "over-200") matchesPrice = product.price > 200;

    // 3. Search Query Filter
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesPrice && matchesSearch;
  });

  // Sort
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    if (sortBy === "rating") return b.rating - a.rating;
    return 0; // Default Featured
  });

  // Clear all filters
  const handleResetFilters = () => {
    setSelectedCategory("All");
    setPriceRange("all");
    setSortBy("featured");
    router.push("/");
  };

  // Scroll to products catalog
  const scrollToCatalog = () => {
    const section = document.getElementById("catalog-section");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Wishlist products
  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 sm:py-32 flex flex-col items-center justify-center text-center">
        {/* Background Gradients */}
        <div className="absolute inset-0 -z-10 bg-radial-gradient from-zinc-200/50 to-transparent dark:from-zinc-950/20" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-40 left-1/3 w-[300px] h-[200px] bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 flex flex-col items-center">
          
          {/* Animated Glow Badge */}
          <div className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-bold text-foreground border border-border animate-glow mb-8">
            <Sparkles className="h-3.5 w-3.5 text-yellow-500" />
            <span>Introducing Aether Workspace V3</span>
          </div>

          {/* Core Title */}
          <h1 className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1] max-w-3xl">
            Sleek Architecture. <br className="hidden sm:inline" />
            <span className="text-gradient">Premium Experience.</span>
          </h1>

          {/* Description */}
          <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed">
            Elevate your workspace setup with custom mechanical keyboards, immersive active noise-canceling headphones, and modern accessories built for developers and creators.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <button
              onClick={scrollToCatalog}
              className="flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-8 text-sm font-semibold text-primary-foreground hover:scale-[1.03] active:scale-97 transition-all duration-200 shadow-lg shadow-black/10"
            >
              Explore Products
              <ArrowDown className="h-4 w-4" />
            </button>
            <Link
              href="/admin"
              className="flex h-12 items-center justify-center rounded-xl border border-border bg-card px-8 text-sm font-semibold text-foreground hover:bg-secondary transition-colors"
            >
              Admin Controls
            </Link>
          </div>

        </div>
      </section>

      {/* Main Catalog Section */}
      <section id="catalog-section" className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-16 scroll-mt-20">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
              The Product Lineup
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Showing {sortedProducts.length} premium tech items
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 no-scrollbar max-w-full">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Filters and Sorting bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-secondary/40 border border-border mb-8">
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <SlidersHorizontal className="h-4.5 w-4.5 text-muted-foreground hidden sm:block" />
            
            {/* Price Filter */}
            <select
              value={priceRange}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPriceRange(e.target.value as "all" | "under-100" | "100-200" | "over-200")}
              className="text-xs font-bold rounded-lg border border-border bg-card text-foreground px-3 py-1.5 focus:outline-none w-full sm:w-auto"
            >
              <option value="all">All Prices</option>
              <option value="under-100">Under $100</option>
              <option value="100-200">$100 - $200</option>
              <option value="over-200">Over $200</option>
            </select>

            {/* Sorting */}
            <select
              value={sortBy}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSortBy(e.target.value as "featured" | "price-asc" | "price-desc" | "rating")}
              className="text-xs font-bold rounded-lg border border-border bg-card text-foreground px-3 py-1.5 focus:outline-none w-full sm:w-auto"
            >
              <option value="featured">Sort by: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Sort by: Rating</option>
            </select>
          </div>

          {/* Active Search & Reset indicator */}
          {(searchQuery || selectedCategory !== "All" || priceRange !== "all" || sortBy !== "featured") && (
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors py-1 px-2"
            >
              <RefreshCw className="h-3 w-3" />
              Clear Filters
            </button>
          )}

        </div>

        {/* Catalog Grid */}
        {sortedProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center rounded-3xl bg-secondary/10 border border-dashed border-border">
            <Search className="h-10 w-10 text-muted-foreground mb-4" />
            <h3 className="font-display font-semibold text-lg text-foreground">No products found</h3>
            <p className="mt-1 text-sm text-muted-foreground max-w-xs">
              No items match your active search terms or category selection. Try resetting filters.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-6 inline-flex h-10 items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground hover:scale-105 active:scale-95 transition-all duration-200"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Wishlist / Saved Items Section */}
      <section id="wishlist" className="bg-secondary/20 border-t border-border py-16 scroll-mt-20">
        <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8">
          
          <div className="flex items-center gap-2 mb-8">
            <Heart className="h-5 w-5 text-red-500 fill-current" />
            <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
              Your Saved Items
            </h2>
            <span className="rounded-full bg-secondary border border-border px-2.5 py-0.5 text-xs font-bold text-muted-foreground">
              {wishlistProducts.length} items
            </span>
          </div>

          {wishlistProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center rounded-3xl bg-card border border-border">
              <Heart className="h-8 w-8 text-muted-foreground mb-3" />
              <h3 className="font-display font-semibold text-sm text-foreground">Wishlist is empty</h3>
              <p className="mt-1 text-xs text-muted-foreground max-w-[240px]">
                Tap the heart on any product card to save it here for later.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {wishlistProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

        </div>
      </section>

    </div>
  );
};

export default function Home() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" />
          <span className="text-sm font-semibold text-muted-foreground">Loading Aether Store...</span>
        </div>
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}
