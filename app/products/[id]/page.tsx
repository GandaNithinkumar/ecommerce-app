"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useStore, Product } from "../../context/store-context";
import { ProductCard } from "../../components/product-card";
import { Star, Heart, ShoppingBag, ArrowLeft, ShieldCheck, Truck, RefreshCw, Check } from "lucide-react";

function ProductDetailInner({ product }: { product: Product }) {
  const { wishlist, toggleWishlist, addToCart } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const isWishlisted = wishlist.includes(product.id);

  const handleAddToCart = () => {
    if (product.inStock) {
      addToCart(product, quantity);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  const { products } = useStore();
  // Find related products (same category, excluding current product)
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Back Button */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground mb-8 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to catalog
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left: Image Panel */}
        <div className="lg:col-span-7">
          <div className="sticky top-28 overflow-hidden rounded-3xl border border-border bg-secondary shadow-lg relative aspect-square w-full">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover object-center hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
              unoptimized
            />
          </div>
        </div>

        {/* Right: Info Panel */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div className="space-y-6">
            
            {/* Category & Stock */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                {product.category}
              </span>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  product.inStock
                    ? "bg-green-500/10 text-green-600 dark:text-green-400"
                    : "bg-red-500/10 text-red-600 dark:text-red-400"
                }`}
              >
                {product.inStock ? "In Stock" : "Out of Stock"}
              </span>
            </div>

            {/* Title */}
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              {product.name}
            </h1>

            {/* Ratings & Reviews */}
            <div className="flex items-center gap-2">
              <div className="flex items-center text-amber-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating)
                        ? "fill-current"
                        : "text-zinc-300 dark:text-zinc-700"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-muted-foreground">
                {product.rating} / 5.0 ({product.reviewsCount} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="border-t border-border pt-4">
              <span className="font-display text-3xl font-bold text-foreground">
                ${product.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </span>
            </div>

            {/* Description */}
            <p className="text-sm leading-relaxed text-muted-foreground">
              {product.description}
            </p>

            {/* Specs Table */}
            <div className="space-y-3 pt-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                Technical Specifications
              </h3>
              <div className="rounded-2xl border border-border overflow-hidden bg-secondary/20">
                {Object.entries(product.specs).map(([key, value], idx) => (
                  <div
                    key={key}
                    className={`grid grid-cols-3 text-xs p-3 border-b border-border/50 last:border-b-0 ${
                      idx % 2 === 0 ? "bg-secondary/40" : "bg-transparent"
                    }`}
                  >
                    <span className="font-bold text-muted-foreground">{key}</span>
                    <span className="col-span-2 text-foreground font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Action Row panel */}
          <div className="mt-8 border-t border-border pt-6 space-y-4">
            
            {product.inStock && (
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-muted-foreground">Quantity:</span>
                <div className="flex items-center rounded-xl border border-border bg-secondary p-1">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-1.5 rounded-lg hover:bg-card text-muted-foreground hover:text-foreground transition-all"
                  >
                    <span className="font-bold text-sm px-1.5">-</span>
                  </button>
                  <span className="px-4 text-sm font-bold text-foreground">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-1.5 rounded-lg hover:bg-card text-muted-foreground hover:text-foreground transition-all"
                  >
                    <span className="font-bold text-sm px-1.5">+</span>
                  </button>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              {product.inStock ? (
                <button
                  onClick={handleAddToCart}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 px-6 text-sm font-semibold transition-all duration-300 shadow-md ${
                    addedToCart
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-primary text-primary-foreground hover:scale-[1.02] active:scale-98"
                  }`}
                >
                  {addedToCart ? (
                    <>
                      <Check className="h-4.5 w-4.5" />
                      Added to Cart!
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="h-4.5 w-4.5" />
                      Add to Cart
                    </>
                  )}
                </button>
              ) : (
                <button
                  disabled
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl py-3 px-6 text-sm font-semibold bg-secondary text-muted-foreground cursor-not-allowed border border-border"
                >
                  Out of Stock
                </button>
              )}

              {/* Wishlist toggle details */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`flex h-12 w-12 items-center justify-center rounded-xl border transition-all duration-200 ${
                  isWishlisted
                    ? "bg-red-500/10 border-red-500 text-red-500"
                    : "border-border hover:bg-secondary text-muted-foreground hover:text-foreground"
                }`}
                aria-label="Add to wishlist"
              >
                <Heart className={`h-5 w-5 ${isWishlisted ? "fill-current" : ""}`} />
              </button>
            </div>

            {/* Values / Perks */}
            <div className="grid grid-cols-3 gap-2 text-center pt-4">
              <div className="flex flex-col items-center p-3 rounded-xl bg-secondary/30 border border-border/40 text-[10px]">
                <Truck className="h-4 w-4 text-indigo-500 mb-1" />
                <span className="font-bold text-foreground">Free Shipping</span>
                <span className="text-muted-foreground mt-0.5">On orders over $150</span>
              </div>
              <div className="flex flex-col items-center p-3 rounded-xl bg-secondary/30 border border-border/40 text-[10px]">
                <ShieldCheck className="h-4 w-4 text-emerald-500 mb-1" />
                <span className="font-bold text-foreground">2 Year Warranty</span>
                <span className="text-muted-foreground mt-0.5">100% Guaranteed</span>
              </div>
              <div className="flex flex-col items-center p-3 rounded-xl bg-secondary/30 border border-border/40 text-[10px]">
                <RefreshCw className="h-4 w-4 text-amber-500 mb-1" />
                <span className="font-bold text-foreground">30-Day Returns</span>
                <span className="text-muted-foreground mt-0.5">Hassle-free swap</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Related Products Grid */}
      {relatedProducts.length > 0 && (
        <section className="mt-24 border-t border-border pt-16">
          <h2 className="font-display text-2xl font-bold tracking-tight text-foreground mb-8">
            You May Also Like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { products } = useStore();
  
  const productId = params?.id as string;
  const product = products.find((p) => p.id === productId);

  // If the product is not found, we redirect
  useEffect(() => {
    if (products.length > 0 && !product) {
      router.push("/");
    }
  }, [product, products, router]);

  if (!product) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" />
          <span className="text-sm font-semibold text-muted-foreground">Loading Product Details...</span>
        </div>
      </div>
    );
  }

  return <ProductDetailInner key={product.id} product={product} />;
}
