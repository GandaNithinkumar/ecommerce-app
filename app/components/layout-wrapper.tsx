"use client";

import React, { useState, Suspense } from "react";
import { Header } from "./header";
import { CartDrawer } from "./cart-drawer";
import Link from "next/link";
import { Cpu, Heart } from "lucide-react";

export const LayoutWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
      
      {/* Header Navigation */}
      <Suspense fallback={<div className="h-16 border-b border-border bg-card animate-pulse" />}>
        <Header onCartToggle={() => setIsCartOpen(true)} />
      </Suspense>

      {/* Main Content Page Body */}
      <main className="flex-1 w-full relative">{children}</main>

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Premium Footer */}
      <footer className="border-t border-border bg-card py-12 mt-auto">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Column 1: Brand details */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Cpu className="h-4 w-4" />
                </div>
                <span className="font-display text-lg font-bold tracking-wider text-gradient uppercase">
                  Aether
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
                Luxury tech accessories and curated workspace assets designed to build a high-performance, aesthetically pleasing environment for modern professionals.
              </p>
            </div>

            {/* Column 2: Navigation Links */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-4">Explore</h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                    Catalog Shop
                  </Link>
                </li>
                <li>
                  <Link href="/admin" className="text-muted-foreground hover:text-foreground transition-colors">
                    Admin Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/#wishlist" className="text-muted-foreground hover:text-foreground transition-colors">
                    Saved Wishlist
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Custom Details */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-4">Aether System</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Experience simulated micro-transactions, local state persistence, dynamic card layouts, and responsive dark/light modes.
              </p>
            </div>
          </div>

          <div className="border-t border-border/60 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-muted-foreground">
            <span>&copy; {new Date().getFullYear()} Aether Inc. All rights reserved.</span>
            <span className="flex items-center gap-1">
              Built with <Heart className="h-3 w-3 text-red-500 fill-current" /> in Next.js & Tailwind CSS
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
};
