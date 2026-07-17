"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useStore, Order } from "../context/store-context";
import { ShieldCheck, ArrowLeft, ArrowRight, CheckCircle2, CreditCard, Truck } from "lucide-react";

export default function CheckoutPage() {
  const { cart, clearCart, addOrder } = useStore();
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Success

  // Form states
  const [shippingForm, setShippingForm] = useState({
    fullName: "",
    email: "",
    address: "",
    city: "",
    zipCode: "",
    country: "United States",
  });

  const [paymentForm, setPaymentForm] = useState({
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Form errors
  const [shippingErrors, setShippingErrors] = useState<Record<string, string>>({});
  const [paymentErrors, setPaymentErrors] = useState<Record<string, string>>({});

  // Summary math
  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const shippingCost = subtotal >= 150 ? 0 : 15.0;
  const estimatedTax = subtotal * 0.08; // 8% simulated tax
  const total = subtotal + shippingCost + estimatedTax;

  const validateShipping = () => {
    const errs: Record<string, string> = {};
    if (!shippingForm.fullName.trim()) errs.fullName = "Full name is required";
    if (!shippingForm.email.trim() || !/\S+@\S+\.\S+/.test(shippingForm.email)) {
      errs.email = "Valid email is required";
    }
    if (!shippingForm.address.trim()) errs.address = "Address is required";
    if (!shippingForm.city.trim()) errs.city = "City is required";
    if (!shippingForm.zipCode.trim()) errs.zipCode = "Zip code is required";
    
    setShippingErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validatePayment = () => {
    const errs: Record<string, string> = {};
    if (!paymentForm.cardName.trim()) errs.cardName = "Cardholder name is required";
    if (paymentForm.cardNumber.replace(/\s/g, "").length < 16) {
      errs.cardNumber = "Enter a valid 16-digit card number";
    }
    if (!/^\d{2}\/\d{2}$/.test(paymentForm.expiry)) {
      errs.expiry = "Use MM/YY format";
    }
    if (paymentForm.cvv.length < 3) {
      errs.cvv = "CVV required";
    }

    setPaymentErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNextStep = () => {
    if (step === 1 && validateShipping()) {
      setStep(2);
    }
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (validatePayment()) {
      // Create order
      const order = addOrder({
        items: cart,
        total: total,
        shippingAddress: {
          fullName: shippingForm.fullName,
          address: shippingForm.address,
          city: shippingForm.city,
          zipCode: shippingForm.zipCode,
          country: shippingForm.country,
        },
      });
      setCompletedOrder(order);
      clearCart();
      setStep(3);
    }
  };

  // Card formatting
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setPaymentForm({ ...paymentForm, cardNumber: formatted.slice(0, 19) });
  };

  if (cart.length === 0 && step !== 3) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
        <div className="rounded-full bg-secondary p-4 mb-4">
          <CreditCard className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="font-display text-xl font-bold text-foreground">Checkout is empty</h2>
        <p className="text-sm text-muted-foreground mt-1 max-w-xs">
          Your cart is empty. Add products before proceeding to checkout.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground hover:scale-105 active:scale-95 transition-all"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Wizard Steps indicator */}
      {step !== 3 && (
        <div className="flex items-center justify-between max-w-md mx-auto mb-12">
          <div className="flex flex-col items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                step >= 1 ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
              }`}
            >
              1
            </div>
            <span className="text-[11px] font-bold text-foreground">Shipping</span>
          </div>
          <div className={`flex-1 h-0.5 mx-4 transition-colors ${step >= 2 ? "bg-primary" : "bg-border"}`} />
          <div className="flex flex-col items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                step >= 2 ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
              }`}
            >
              2
            </div>
            <span className="text-[11px] font-bold text-muted-foreground">Payment</span>
          </div>
        </div>
      )}

      {step === 3 ? (
        /* SUCCESS PAGE */
        <div className="flex flex-col items-center justify-center max-w-xl mx-auto py-12 px-6 rounded-3xl bg-card border border-border text-center shadow-xl animate-scale">
          <CheckCircle2 className="h-16 w-16 text-green-500 mb-6" />
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-gradient">
            Thank you for your order!
          </h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-sm">
            Your payment was simulated successfully. Order ID:{" "}
            <span className="font-bold text-foreground font-mono">{completedOrder?.id}</span>. We&apos;ve sent a mock confirmation to {shippingForm.email}.
          </p>

          <div className="w-full border-t border-border mt-8 pt-6 text-left space-y-3.5 text-xs text-foreground">
            <h3 className="font-bold text-sm">Delivery Information</h3>
            <div className="grid grid-cols-3">
              <span className="text-muted-foreground font-semibold">Recipient:</span>
              <span className="col-span-2 font-medium">{shippingForm.fullName}</span>
            </div>
            <div className="grid grid-cols-3">
              <span className="text-muted-foreground font-semibold">Address:</span>
              <span className="col-span-2 font-medium">
                {shippingForm.address}, {shippingForm.city}, {shippingForm.zipCode}, {shippingForm.country}
              </span>
            </div>
            <div className="grid grid-cols-3">
              <span className="text-muted-foreground font-semibold">Total Paid:</span>
              <span className="col-span-2 font-bold text-sm text-foreground">
                ${total.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex gap-4 w-full mt-8 pt-4 border-t border-border">
            <Link
              href="/"
              className="flex-1 flex h-11 items-center justify-center rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:scale-[1.02] active:scale-98 transition-all"
            >
              Continue Shopping
            </Link>
            <Link
              href="/admin"
              className="flex-1 flex h-11 items-center justify-center rounded-xl border border-border bg-card text-foreground text-sm font-semibold hover:bg-secondary transition-colors"
            >
              View Order in Admin
            </Link>
          </div>
        </div>
      ) : (
        /* CHECKOUT SPLIT VIEW */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Column: Forms */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Shipping Form */}
            {step === 1 && (
              <div className="p-6 rounded-2xl bg-card border border-border space-y-6 shadow-sm animate-fadeIn">
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <h2 className="font-display text-lg font-bold text-foreground">Shipping Details</h2>
                  <Link href="/" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="h-3.5 w-3.5" /> Back
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="col-span-2 space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground">Full Name</label>
                    <input
                      type="text"
                      value={shippingForm.fullName}
                      onChange={(e) => setShippingForm({ ...shippingForm, fullName: e.target.value })}
                      placeholder="e.g. John Doe"
                      className={`w-full p-2.5 rounded-xl border bg-secondary/50 text-sm focus:outline-none transition-all ${
                        shippingErrors.fullName ? "border-red-500" : "border-border"
                      }`}
                    />
                    {shippingErrors.fullName && <p className="text-[10px] text-red-500">{shippingErrors.fullName}</p>}
                  </div>

                  {/* Email */}
                  <div className="col-span-2 space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground">Email Address</label>
                    <input
                      type="email"
                      value={shippingForm.email}
                      onChange={(e) => setShippingForm({ ...shippingForm, email: e.target.value })}
                      placeholder="e.g. john@example.com"
                      className={`w-full p-2.5 rounded-xl border bg-secondary/50 text-sm focus:outline-none transition-all ${
                        shippingErrors.email ? "border-red-500" : "border-border"
                      }`}
                    />
                    {shippingErrors.email && <p className="text-[10px] text-red-500">{shippingErrors.email}</p>}
                  </div>

                  {/* Street Address */}
                  <div className="col-span-2 space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground">Street Address</label>
                    <input
                      type="text"
                      value={shippingForm.address}
                      onChange={(e) => setShippingForm({ ...shippingForm, address: e.target.value })}
                      placeholder="e.g. 123 Luxury Lane"
                      className={`w-full p-2.5 rounded-xl border bg-secondary/50 text-sm focus:outline-none transition-all ${
                        shippingErrors.address ? "border-red-500" : "border-border"
                      }`}
                    />
                    {shippingErrors.address && <p className="text-[10px] text-red-500">{shippingErrors.address}</p>}
                  </div>

                  {/* City */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground">City</label>
                    <input
                      type="text"
                      value={shippingForm.city}
                      onChange={(e) => setShippingForm({ ...shippingForm, city: e.target.value })}
                      placeholder="e.g. San Francisco"
                      className={`w-full p-2.5 rounded-xl border bg-secondary/50 text-sm focus:outline-none transition-all ${
                        shippingErrors.city ? "border-red-500" : "border-border"
                      }`}
                    />
                    {shippingErrors.city && <p className="text-[10px] text-red-500">{shippingErrors.city}</p>}
                  </div>

                  {/* Zip Code */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground">Zip Code</label>
                    <input
                      type="text"
                      value={shippingForm.zipCode}
                      onChange={(e) => setShippingForm({ ...shippingForm, zipCode: e.target.value })}
                      placeholder="e.g. 94103"
                      className={`w-full p-2.5 rounded-xl border bg-secondary/50 text-sm focus:outline-none transition-all ${
                        shippingErrors.zipCode ? "border-red-500" : "border-border"
                      }`}
                    />
                    {shippingErrors.zipCode && <p className="text-[10px] text-red-500">{shippingErrors.zipCode}</p>}
                  </div>
                </div>

                <button
                  onClick={handleNextStep}
                  className="w-full flex h-11 items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:scale-[1.01] transition-all shadow"
                >
                  Continue to Payment
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Payment Form (Credit Card Simulator) */}
            {step === 2 && (
              <div className="p-6 rounded-2xl bg-card border border-border space-y-6 shadow-sm animate-fadeIn">
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <h2 className="font-display text-lg font-bold text-foreground">Secure Payment</h2>
                  <button onClick={() => setStep(1)} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="h-3.5 w-3.5" /> Back to Shipping
                  </button>
                </div>

                {/* VIRTUAL CREDIT CARD GRAPHIC */}
                <div className="relative mx-auto w-full max-w-sm aspect-[1.58/1] rounded-2xl bg-gradient-to-br from-zinc-800 to-black text-white p-6 shadow-2xl flex flex-col justify-between overflow-hidden border border-zinc-700 select-none animate-glow">
                  {/* Subtle reflections */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />
                  
                  {/* Card Header */}
                  <div className="flex justify-between items-start">
                    <div className="h-7 w-9 rounded-md bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center">
                      <div className="h-4 w-6 bg-yellow-500/50 rounded-sm" />
                    </div>
                    <span className="font-display font-bold italic tracking-widest text-[11px] uppercase opacity-75">
                      AETHER CARD
                    </span>
                  </div>

                  {/* Card Number */}
                  <div className="font-mono text-lg sm:text-xl tracking-wider text-center py-2 text-zinc-100">
                    {paymentForm.cardNumber || "•••• •••• •••• ••••"}
                  </div>

                  {/* Card Footer details */}
                  <div className="flex justify-between items-end">
                    <div className="space-y-0.5">
                      <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest block">Card Holder</span>
                      <span className="font-display text-xs font-semibold tracking-wide uppercase truncate block max-w-[180px]">
                        {paymentForm.cardName || "YOUR NAME"}
                      </span>
                    </div>
                    <div className="flex gap-4">
                      <div className="space-y-0.5">
                        <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest block">Expires</span>
                        <span className="font-mono text-xs text-zinc-200">
                          {paymentForm.expiry || "MM/YY"}
                        </span>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest block">CVV</span>
                        <span className="font-mono text-xs text-zinc-200">
                          {paymentForm.cvv || "•••"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Card Name */}
                  <div className="col-span-2 space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground">Cardholder Name</label>
                    <input
                      type="text"
                      value={paymentForm.cardName}
                      onChange={(e) => setPaymentForm({ ...paymentForm, cardName: e.target.value })}
                      placeholder="e.g. John Doe"
                      className={`w-full p-2.5 rounded-xl border bg-secondary/50 text-sm focus:outline-none transition-all ${
                        paymentErrors.cardName ? "border-red-500" : "border-border"
                      }`}
                    />
                    {paymentErrors.cardName && <p className="text-[10px] text-red-500">{paymentErrors.cardName}</p>}
                  </div>

                  {/* Card Number */}
                  <div className="col-span-2 space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground">Card Number</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={paymentForm.cardNumber}
                        onChange={handleCardNumberChange}
                        placeholder="0000 0000 0000 0000"
                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl border bg-secondary/50 text-sm focus:outline-none transition-all ${
                          paymentErrors.cardNumber ? "border-red-500" : "border-border"
                        }`}
                      />
                      <CreditCard className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                    </div>
                    {paymentErrors.cardNumber && <p className="text-[10px] text-red-500">{paymentErrors.cardNumber}</p>}
                  </div>

                  {/* Expiration Date */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground">Expiry Date</label>
                    <input
                      type="text"
                      value={paymentForm.expiry}
                      onChange={(e) => setPaymentForm({ ...paymentForm, expiry: e.target.value })}
                      placeholder="MM/YY"
                      maxLength={5}
                      className={`w-full p-2.5 rounded-xl border bg-secondary/50 text-sm focus:outline-none transition-all ${
                        paymentErrors.expiry ? "border-red-500" : "border-border"
                      }`}
                    />
                    {paymentErrors.expiry && <p className="text-[10px] text-red-500">{paymentErrors.expiry}</p>}
                  </div>

                  {/* CVV */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground">Security Code (CVV)</label>
                    <input
                      type="password"
                      value={paymentForm.cvv}
                      onChange={(e) => setPaymentForm({ ...paymentForm, cvv: e.target.value.replace(/\D/g, "") })}
                      placeholder="•••"
                      maxLength={4}
                      className={`w-full p-2.5 rounded-xl border bg-secondary/50 text-sm focus:outline-none transition-all ${
                        paymentErrors.cvv ? "border-red-500" : "border-border"
                      }`}
                    />
                    {paymentErrors.cvv && <p className="text-[10px] text-red-500">{paymentErrors.cvv}</p>}
                  </div>

                  <button
                    type="submit"
                    className="col-span-2 w-full flex h-11 items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:scale-[1.01] active:scale-99 transition-all shadow-md"
                  >
                    Simulate Payment & Place Order (${total.toFixed(2)})
                  </button>
                </form>
              </div>
            )}

            {/* Quality Check badge */}
            <div className="flex gap-4 p-4 rounded-xl bg-secondary/40 border border-border/80 text-xs">
              <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0" />
              <div>
                <span className="font-bold text-foreground block">Protected Transaction</span>
                <span className="text-muted-foreground mt-0.5 block">
                  This checkout is fully simulated. No money or sensitive financial details are processed or saved.
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5">
            <div className="p-6 rounded-2xl bg-secondary/20 border border-border space-y-6 shadow-sm sticky top-28">
              <h2 className="font-display text-lg font-bold text-foreground border-b border-border pb-4">
                Order Summary
              </h2>

              {/* Items List */}
              <div className="max-h-[300px] overflow-y-auto space-y-4 no-scrollbar pr-1">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex gap-3 text-xs text-foreground items-center justify-between border-b border-border/40 pb-3 last:border-0 last:pb-0">
                    <div className="flex gap-3 items-center">
                      <div className="h-12 w-12 rounded-lg overflow-hidden bg-secondary border border-border shrink-0 relative">
                        <Image src={item.product.image} alt={item.product.name} fill className="object-cover" unoptimized />
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold block truncate max-w-[160px]">{item.product.name}</span>
                        <span className="text-muted-foreground block text-[10px]">Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <span className="font-bold">${(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Price Details breakdown */}
              <div className="border-t border-border pt-4 space-y-2 text-xs font-semibold text-foreground">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{shippingCost === 0 ? "Free" : `$${shippingCost.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estimated Tax (8%)</span>
                  <span>${estimatedTax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold border-t border-border pt-3">
                  <span>Grand Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Shipping info disclaimer */}
              <div className="flex flex-col gap-2 p-3.5 rounded-xl bg-card border border-border/60 text-[10px]">
                <div className="flex gap-1.5 items-center text-muted-foreground">
                  <Truck className="h-3.5 w-3.5 text-primary" />
                  <span className="font-bold text-foreground">Shipping Mode: Fast & Tracked</span>
                </div>
                <p className="text-muted-foreground leading-normal">
                  Standard delivery times apply. Free shipping threshold: $150.
                </p>
              </div>

            </div>
          </div>

        </div>
      )}

    </div>
  );
}
