"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useStore, Product } from "../context/store-context";
import { Star, Heart, ShoppingCart, Eye } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { wishlist, toggleWishlist, addToCart } = useStore();
  const isWishlisted = wishlist.includes(product.id);

  // Handle wishlist toggle and stop event propagation
  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  // Handle quick-add and stop event propagation
  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.inStock) {
      addToCart(product, 1);
    }
  };

  return (
    <div className="group relative flex flex-col w-full overflow-hidden rounded-2xl glass-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border border-border">
      
      {/* Product Image Frame */}
      <div className="relative aspect-square w-full overflow-hidden bg-secondary">
        <Link href={`/products/${product.id}`} className="relative block h-full w-full">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
            unoptimized
          />
        </Link>

        {/* Badges Overlay */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5 pointer-events-none">
          {!product.inStock && (
            <span className="rounded-full bg-red-500/90 backdrop-blur-sm px-2.5 py-1 text-[10px] font-bold tracking-wider text-white uppercase shadow-sm">
              Out of Stock
            </span>
          )}
          {product.price > 200 && product.inStock && (
            <span className="rounded-full bg-primary/95 px-2.5 py-1 text-[10px] font-bold tracking-wider text-primary-foreground uppercase shadow-sm">
              Premium
            </span>
          )}
        </div>

        {/* Wishlist Button Overlay */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full glass shadow-md transition-all duration-300 hover:scale-110 ${
            isWishlisted
              ? "text-red-500 bg-white dark:bg-zinc-900 border-red-500"
              : "text-muted-foreground hover:text-red-500 bg-white/80 dark:bg-zinc-900/80"
          }`}
          aria-label="Add to wishlist"
        >
          <Heart
            className={`h-4.5 w-4.5 transition-transform duration-300 ${
              isWishlisted ? "fill-current scale-110" : ""
            }`}
          />
        </button>

        {/* Hover Quick Actions Grid Overlay */}
        <div className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-center gap-3 bg-gradient-to-t from-black/60 to-transparent p-4 transition-transform duration-300 group-hover:translate-y-0">
          <Link
            href={`/products/${product.id}`}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-zinc-900 shadow-lg hover:bg-zinc-100 hover:scale-105 transition-all duration-200"
            title="View Details"
          >
            <Eye className="h-4.5 w-4.5" />
          </Link>
          
          {product.inStock && (
            <button
              onClick={handleQuickAdd}
              className="flex flex-1 items-center justify-center gap-2 h-10 px-4 rounded-xl bg-primary text-primary-foreground text-xs font-semibold shadow-lg hover:scale-[1.03] active:scale-95 transition-all duration-200"
            >
              <ShoppingCart className="h-4 w-4" />
              Quick Add
            </button>
          )}
        </div>
      </div>

      {/* Product Content Details */}
      <div className="flex flex-col flex-1 p-4">
        {/* Category */}
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          {product.category}
        </span>

        {/* Product Title */}
        <Link href={`/products/${product.id}`} className="mt-1 flex-1">
          <h3 className="font-display font-semibold text-sm leading-tight text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>

        {/* Star Rating Info */}
        <div className="mt-2.5 flex items-center gap-1">
          <div className="flex items-center text-amber-500">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < Math.floor(product.rating)
                    ? "fill-current"
                    : "text-zinc-300 dark:text-zinc-700"
                }`}
              />
            ))}
          </div>
          <span className="text-[11px] font-semibold text-muted-foreground">
            {product.rating} ({product.reviewsCount})
          </span>
        </div>

        {/* Price Tag Info */}
        <div className="mt-3 flex items-center justify-between">
          <span className="font-display text-base font-bold text-foreground">
            ${product.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

    </div>
  );
};
