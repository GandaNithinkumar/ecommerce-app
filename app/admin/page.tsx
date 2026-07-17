"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useStore, Product } from "../context/store-context";
import { Plus, Edit3, Trash2, LineChart, ShoppingBag, Box, ArrowUpRight, DollarSign, X, Check, RefreshCw } from "lucide-react";

export default function AdminPage() {
  const { products, orders, addProduct, updateProduct, deleteProduct } = useStore();
  const [activeTab, setActiveTab] = useState<"analytics" | "inventory">("analytics");

  // Product form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formState, setFormState] = useState({
    name: "",
    description: "",
    price: "",
    category: "Audio",
    image: "",
    inStock: true,
    specDrivers: "",
    specBattery: "",
    specConn: "",
    specWeight: "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Stats Calculations
  const defaultSalesVolume = 12480.0;
  const simulatedSales = orders.reduce((acc, order) => acc + order.total, 0);
  const totalSales = defaultSalesVolume + simulatedSales;

  const defaultOrderCount = 42;
  const totalOrders = defaultOrderCount + orders.length;

  const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;
  const activeProductsCount = products.length;

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormState({
      name: "",
      description: "",
      price: "",
      category: "Audio",
      image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=60",
      inStock: true,
      specDrivers: "40mm Drivers",
      specBattery: "Up to 30 hours",
      specConn: "Bluetooth 5.2",
      specWeight: "250g",
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormState({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      image: product.image,
      inStock: product.inStock,
      specDrivers: product.specs["Drivers"] || product.specs["Display"] || product.specs["Switches"] || "",
      specBattery: product.specs["Battery Life"] || product.specs["Layout"] || "",
      specConn: product.specs["Connectivity"] || product.specs["Sensors"] || "",
      specWeight: product.specs["Weight"] || product.specs["Water Resistance"] || "",
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!formState.name.trim()) errs.name = "Name is required";
    if (!formState.description.trim()) errs.description = "Description is required";
    if (!formState.price.trim() || isNaN(Number(formState.price)) || Number(formState.price) <= 0) {
      errs.price = "Enter a valid positive price";
    }
    if (!formState.image.trim()) errs.image = "Image URL is required";

    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }

    const specifications: { [key: string]: string } = {};
    if (formState.category === "Audio") {
      specifications["Drivers"] = formState.specDrivers || "Dynamic Drivers";
      specifications["Battery Life"] = formState.specBattery || "30 Hours";
      specifications["Connectivity"] = formState.specConn || "Bluetooth 5.3";
      specifications["Weight"] = formState.specWeight || "290g";
    } else if (formState.category === "Wearables") {
      specifications["Display"] = formState.specDrivers || "AMOLED Screen";
      specifications["Sensors"] = formState.specConn || "Heart Rate, SpO2";
      specifications["Battery Life"] = formState.specBattery || "7 Days";
      specifications["Water Resistance"] = formState.specWeight || "5ATM";
    } else {
      specifications["Connectivity"] = formState.specConn || "Wireless/Wired";
      specifications["Material"] = formState.specDrivers || "Premium Finish";
      specifications["Details"] = formState.specBattery || "Aether Spec";
    }

    if (editingProduct) {
      updateProduct({
        ...editingProduct,
        name: formState.name,
        description: formState.description,
        price: Number(formState.price),
        category: formState.category,
        image: formState.image,
        inStock: formState.inStock,
        specs: specifications,
      });
    } else {
      addProduct({
        name: formState.name,
        description: formState.description,
        price: Number(formState.price),
        category: formState.category,
        image: formState.image,
        rating: 4.5,
        reviewsCount: 1,
        inStock: formState.inStock,
        specs: specifications,
      });
    }

    setIsModalOpen(false);
  };

  const handleToggleStock = (product: Product) => {
    updateProduct({ ...product, inStock: !product.inStock });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Top dashboard header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-6 mb-8">
        <div>
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Admin Control Panel</span>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground mt-1">
            Store Command Center
          </h1>
        </div>

        {/* Dashboard/Inventory toggle tabs */}
        <div className="flex items-center gap-2 rounded-xl bg-secondary p-1 border border-border">
          <button
            onClick={() => setActiveTab("analytics")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === "analytics"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <LineChart className="h-4 w-4" />
            Analytics
          </button>
          <button
            onClick={() => setActiveTab("inventory")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === "inventory"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Box className="h-4 w-4" />
            Inventory ({products.length})
          </button>
        </div>
      </div>

      {activeTab === "analytics" ? (
        /* ANALYTICS SECTION */
        <div className="space-y-8 animate-fadeIn">
          {/* Dashboard KPI cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Sales Volume */}
            <div className="p-6 rounded-2xl bg-card border border-border flex flex-col justify-between shadow-sm relative overflow-hidden group">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-muted-foreground">Total Sales</span>
                <span className="rounded-lg bg-green-500/10 text-green-500 text-[10px] font-bold px-2 py-0.5 flex items-center gap-0.5">
                  <ArrowUpRight className="h-3 w-3" /> +12.4%
                </span>
              </div>
              <div className="mt-4">
                <span className="font-display text-2xl font-bold text-foreground">
                  ${totalSales.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
                <span className="text-[10px] text-muted-foreground block mt-1">Includes demo seeding</span>
              </div>
              <DollarSign className="absolute right-4 bottom-4 h-12 w-12 text-zinc-100 dark:text-zinc-900 group-hover:scale-110 transition-transform -z-10" />
            </div>

            {/* Orders */}
            <div className="p-6 rounded-2xl bg-card border border-border flex flex-col justify-between shadow-sm relative overflow-hidden group">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-muted-foreground">Total Orders</span>
                <span className="rounded-lg bg-indigo-500/10 text-indigo-500 text-[10px] font-bold px-2 py-0.5 flex items-center gap-0.5">
                  <ArrowUpRight className="h-3 w-3" /> +8.2%
                </span>
              </div>
              <div className="mt-4">
                <span className="font-display text-2xl font-bold text-foreground">{totalOrders}</span>
                <span className="text-[10px] text-muted-foreground block mt-1">Simulated customer counts</span>
              </div>
              <ShoppingBag className="absolute right-4 bottom-4 h-12 w-12 text-zinc-100 dark:text-zinc-900 group-hover:scale-110 transition-transform -z-10" />
            </div>

            {/* Average Order Value */}
            <div className="p-6 rounded-2xl bg-card border border-border flex flex-col justify-between shadow-sm relative overflow-hidden group">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-muted-foreground">Avg. Ticket Value</span>
                <span className="rounded-lg bg-emerald-500/10 text-emerald-500 text-[10px] font-bold px-2 py-0.5 flex items-center gap-0.5">
                  Stable
                </span>
              </div>
              <div className="mt-4">
                <span className="font-display text-2xl font-bold text-foreground">
                  ${avgOrderValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
                <span className="text-[10px] text-muted-foreground block mt-1">Averaged across checkout history</span>
              </div>
              <RefreshCw className="absolute right-4 bottom-4 h-12 w-12 text-zinc-100 dark:text-zinc-900 group-hover:scale-110 transition-transform -z-10" />
            </div>

            {/* Catalog catalog items */}
            <div className="p-6 rounded-2xl bg-card border border-border flex flex-col justify-between shadow-sm relative overflow-hidden group">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-muted-foreground">Active Catalog</span>
                <span className="rounded-lg bg-zinc-500/10 text-muted-foreground text-[10px] font-bold px-2 py-0.5">
                  Listed
                </span>
              </div>
              <div className="mt-4">
                <span className="font-display text-2xl font-bold text-foreground">{activeProductsCount}</span>
                <span className="text-[10px] text-muted-foreground block mt-1">Unique products active</span>
              </div>
              <Box className="absolute right-4 bottom-4 h-12 w-12 text-zinc-100 dark:text-zinc-900 group-hover:scale-110 transition-transform -z-10" />
            </div>
          </div>

          {/* Premium Animated inline SVG Chart */}
          <div className="p-6 rounded-3xl bg-card border border-border shadow-sm">
            <h3 className="font-display text-sm font-bold text-foreground mb-6">Sales Performance Over Time</h3>
            <div className="w-full h-64 relative bg-secondary/10 rounded-2xl border border-border/30 overflow-hidden flex items-end">
              <svg className="w-full h-full p-2" viewBox="0 0 600 200" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgb(9,9,11)" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="rgb(9,9,11)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {/* Curved Sales Line */}
                <path
                  d="M 0 160 Q 100 130, 150 90 T 300 120 T 450 60 T 600 30 L 600 200 L 0 200 Z"
                  fill="url(#chartGradient)"
                  className="transition-all duration-1000"
                />
                <path
                  d="M 0 160 Q 100 130, 150 90 T 300 120 T 450 60 T 600 30"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  className="text-primary transition-all duration-1000"
                  strokeLinecap="round"
                />
                {/* Visual points */}
                <circle cx="150" cy="90" r="5" className="fill-primary" />
                <circle cx="300" cy="120" r="5" className="fill-primary" />
                <circle cx="450" cy="60" r="5" className="fill-primary" />
                <circle cx="600" cy="30" r="5" className="fill-primary" />
              </svg>

              {/* Chart Overlay Tooltips */}
              <div className="absolute top-4 left-6 flex items-center gap-6 text-[10px] font-bold text-muted-foreground">
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-primary" /> Sales Volume</span>
                <span>Interval: Last 6 Months</span>
              </div>
            </div>
          </div>

          {/* Orders History List */}
          <div className="p-6 rounded-3xl bg-card border border-border shadow-sm">
            <h3 className="font-display text-sm font-bold text-foreground mb-4">Simulated Recent Orders</h3>
            {orders.length === 0 ? (
              <div className="py-8 text-center text-xs text-muted-foreground">
                No purchases completed yet. Complete a checkout to populate this table.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground font-bold">
                      <th className="py-3 px-2">Order ID</th>
                      <th className="py-3 px-2">Date</th>
                      <th className="py-3 px-2">Recipient</th>
                      <th className="py-3 px-2">Items Count</th>
                      <th className="py-3 px-2">Total Paid</th>
                      <th className="py-3 px-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b border-border/40 hover:bg-secondary/20 transition-colors">
                        <td className="py-3.5 px-2 font-mono font-bold text-primary">{order.id}</td>
                        <td className="py-3.5 px-2 text-muted-foreground">{order.date}</td>
                        <td className="py-3.5 px-2 font-semibold">{order.shippingAddress.fullName}</td>
                        <td className="py-3.5 px-2">{order.items.reduce((total, i) => total + i.quantity, 0)} Items</td>
                        <td className="py-3.5 px-2 font-bold">${order.total.toFixed(2)}</td>
                        <td className="py-3.5 px-2">
                          <span className="rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-[10px] font-bold px-2 py-0.5">
                            Approved
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* INVENTORY MANAGEMENT TABLE SECTION */
        <div className="space-y-6 animate-fadeIn">
          
          <div className="flex justify-between items-center">
            <h3 className="font-display text-sm font-bold text-foreground">Catalog Item Inventory</h3>
            <button
              onClick={handleOpenAddModal}
              className="flex items-center gap-1.5 h-10 px-4 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:scale-105 active:scale-95 transition-all shadow"
            >
              <Plus className="h-4 w-4" />
              Add Product
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border bg-secondary/30 text-muted-foreground font-bold">
                  <th className="py-4 px-4">Item details</th>
                  <th className="py-4 px-4">Category</th>
                  <th className="py-4 px-4">Price</th>
                  <th className="py-4 px-4">Stock Status</th>
                  <th className="py-4 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-border/40 hover:bg-secondary/10 transition-colors">
                    {/* Item details */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg overflow-hidden bg-secondary border border-border shrink-0">
                          <Image src={product.image} alt={product.name} width={40} height={40} className="h-full w-full object-cover" unoptimized />
                        </div>
                        <div>
                          <span className="font-bold text-foreground block">{product.name}</span>
                          <span className="text-[10px] text-muted-foreground line-clamp-1 max-w-[240px] mt-0.5">
                            {product.description}
                          </span>
                        </div>
                      </div>
                    </td>
                    
                    {/* Category */}
                    <td className="py-4 px-4">
                      <span className="rounded-full bg-secondary border border-border/60 text-[10px] font-semibold text-muted-foreground px-2 py-0.5">
                        {product.category}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-4 px-4 font-bold text-foreground">
                      ${product.price.toFixed(2)}
                    </td>

                    {/* Stock Status toggle */}
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleToggleStock(product)}
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold border transition-colors ${
                          product.inStock
                            ? "bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400 hover:bg-green-500/20"
                            : "bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-500/20"
                        }`}
                      >
                        {product.inStock ? "In Stock" : "Out of Stock"}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(product)}
                          className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                          title="Edit Product"
                        >
                          <Edit3 className="h-4.5 w-4.5" />
                        </button>
                        <button
                          onClick={() => deleteProduct(product.id)}
                          className="p-1.5 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* CREATE / EDIT PRODUCT SLIDEOVER MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300" onClick={() => setIsModalOpen(false)} />
          
          <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
            <div className="w-screen max-w-lg transform bg-card text-foreground shadow-2xl transition-all border-l border-border flex flex-col h-full animate-slideLeft">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-border px-6 py-5">
                <h2 className="font-display text-lg font-bold text-foreground">
                  {editingProduct ? `Edit "${editingProduct.name}"` : "Add New Product"}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Form panel scrollable */}
              <form onSubmit={handleSaveProduct} className="flex-1 overflow-y-auto px-6 py-5 space-y-5 no-scrollbar">
                
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground">Product Name</label>
                  <input
                    type="text"
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    placeholder="e.g. KeyBoard Pro Max"
                    className={`w-full p-2.5 rounded-xl border bg-secondary/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                      formErrors.name ? "border-red-500" : "border-border"
                    }`}
                  />
                  {formErrors.name && <p className="text-[10px] text-red-500">{formErrors.name}</p>}
                </div>

                {/* Category & Price */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground">Category</label>
                    <select
                      value={formState.category}
                      onChange={(e) => setFormState({ ...formState, category: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-border bg-secondary/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="Audio">Audio</option>
                      <option value="Wearables">Wearables</option>
                      <option value="Accessories">Accessories</option>
                      <option value="Smart Home">Smart Home</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground">Price ($)</label>
                    <input
                      type="text"
                      value={formState.price}
                      onChange={(e) => setFormState({ ...formState, price: e.target.value })}
                      placeholder="e.g. 199.99"
                      className={`w-full p-2.5 rounded-xl border bg-secondary/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                        formErrors.price ? "border-red-500" : "border-border"
                      }`}
                    />
                    {formErrors.price && <p className="text-[10px] text-red-500">{formErrors.price}</p>}
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground">Description</label>
                  <textarea
                    value={formState.description}
                    onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                    placeholder="Provide in-depth product sales copy details..."
                    rows={4}
                    className={`w-full p-2.5 rounded-xl border bg-secondary/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                      formErrors.description ? "border-red-500" : "border-border"
                    }`}
                  />
                  {formErrors.description && <p className="text-[10px] text-red-500">{formErrors.description}</p>}
                </div>

                {/* Image URL */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground">Image URL</label>
                  <input
                    type="text"
                    value={formState.image}
                    onChange={(e) => setFormState({ ...formState, image: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className={`w-full p-2.5 rounded-xl border bg-secondary/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                      formErrors.image ? "border-red-500" : "border-border"
                    }`}
                  />
                  {formErrors.image && <p className="text-[10px] text-red-500">{formErrors.image}</p>}
                </div>

                {/* Stock Toggle */}
                <div className="flex items-center justify-between border-t border-border pt-4">
                  <span className="text-xs font-bold text-muted-foreground">Available Stock</span>
                  <button
                    type="button"
                    onClick={() => setFormState({ ...formState, inStock: !formState.inStock })}
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold border transition-colors ${
                      formState.inStock
                        ? "bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400"
                        : "bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400"
                    }`}
                  >
                    {formState.inStock ? "In Stock" : "Out of Stock"}
                  </button>
                </div>

                {/* Specs Sub-Form fields */}
                <div className="space-y-3 border-t border-border pt-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">Specifications Configuration</h3>
                  
                  {formState.category === "Audio" ? (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-muted-foreground">Drivers</label>
                        <input
                          type="text"
                          value={formState.specDrivers}
                          onChange={(e) => setFormState({ ...formState, specDrivers: e.target.value })}
                          className="w-full p-2 rounded-lg border border-border bg-secondary/30 text-xs focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-muted-foreground">Battery Life</label>
                        <input
                          type="text"
                          value={formState.specBattery}
                          onChange={(e) => setFormState({ ...formState, specBattery: e.target.value })}
                          className="w-full p-2 rounded-lg border border-border bg-secondary/30 text-xs focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-muted-foreground">Connectivity</label>
                        <input
                          type="text"
                          value={formState.specConn}
                          onChange={(e) => setFormState({ ...formState, specConn: e.target.value })}
                          className="w-full p-2 rounded-lg border border-border bg-secondary/30 text-xs focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-muted-foreground">Weight</label>
                        <input
                          type="text"
                          value={formState.specWeight}
                          onChange={(e) => setFormState({ ...formState, specWeight: e.target.value })}
                          className="w-full p-2 rounded-lg border border-border bg-secondary/30 text-xs focus:outline-none"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-muted-foreground">Feature/Display</label>
                        <input
                          type="text"
                          value={formState.specDrivers}
                          onChange={(e) => setFormState({ ...formState, specDrivers: e.target.value })}
                          className="w-full p-2 rounded-lg border border-border bg-secondary/30 text-xs focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-muted-foreground">Key Spec/Layout</label>
                        <input
                          type="text"
                          value={formState.specBattery}
                          onChange={(e) => setFormState({ ...formState, specBattery: e.target.value })}
                          className="w-full p-2 rounded-lg border border-border bg-secondary/30 text-xs focus:outline-none"
                        />
                      </div>
                      <div className="col-span-2 space-y-1">
                        <label className="text-[10px] font-bold text-muted-foreground">Connectivity/Sensors</label>
                        <input
                          type="text"
                          value={formState.specConn}
                          onChange={(e) => setFormState({ ...formState, specConn: e.target.value })}
                          className="w-full p-2 rounded-lg border border-border bg-secondary/30 text-xs focus:outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Save controls */}
                <div className="pt-4 flex gap-3 border-t border-border">
                  <button
                    type="submit"
                    className="flex-1 flex h-11 items-center justify-center gap-1.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:scale-[1.01] transition-all"
                  >
                    <Check className="h-4.5 w-4.5" />
                    Save Product
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 flex h-11 items-center justify-center rounded-xl border border-border bg-card text-foreground text-sm font-semibold hover:bg-secondary transition-colors"
                  >
                    Cancel
                  </button>
                </div>

              </form>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
