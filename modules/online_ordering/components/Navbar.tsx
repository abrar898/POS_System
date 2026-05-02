import React from "react";
import Link from "next/link";
import { Menu, X, MapPin, ChevronDown, User, ShoppingBag } from "lucide-react";
import { COLORS } from "../constants";
import { useCart } from "@/context/cart-context";

interface NavbarProps {
  initialScreen: string;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (val: boolean) => void;
  grandTotal: number;
}

export function Navbar({ initialScreen, isMobileMenuOpen, setIsMobileMenuOpen, grandTotal }: NavbarProps) {
  const { lastOrderId } = useCart();
  const trackLink = lastOrderId ? `/orders/${lastOrderId.replace('#','')}/track` : "/orders/track";
  return (
    <>
      <nav className="h-16 px-4 md:px-8 flex items-center justify-between border-b border-gray-100 sticky top-0 bg-white z-[60]">
        <div className="flex items-center gap-4 md:gap-12">
          <button 
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <Link href="/" className="flex items-center gap-2 cursor-pointer">
            <img src="/cheezious_logo.jpeg" alt="Cheezious Logo" className="h-10 w-auto object-contain rounded-lg" />
          </Link>
          <div className="hidden md:flex items-center gap-8 text-[15px] font-bold">
            <Link href="/home" className={`${initialScreen === "menu" ? "text-[#811920] border-b-2 border-[#811920]" : "text-gray-900"} pb-0.5 transition-all`}>Home</Link>
            <Link href="/home" className="text-gray-900 hover:text-[#811920] transition-all">Menu</Link>
            {lastOrderId && <Link href={trackLink} className="text-gray-900 hover:text-[#811920] transition-colors">Track Order</Link>}
            <Link href="/deals" className={`${initialScreen === "deals" ? "text-[#811920] border-b-2 border-[#811920]" : "text-gray-900"} pb-0.5 transition-all`}>Deals</Link>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-6">
          <div className="hidden sm:flex items-center gap-2 text-sm font-bold text-gray-700">
            <MapPin size={16} className="text-[#811920]" />
            <span className="max-w-[80px] truncate">Islamabad</span>
            <ChevronDown size={14} />
          </div>
          <button className="flex items-center gap-2 text-sm font-bold text-gray-700">
            <User size={18} className="text-[#811920]" />
            <span className="hidden sm:inline">Sign In</span>
          </button>
          <Link href="/cart" className="bg-gray-50 border border-gray-100 rounded-lg px-2 md:px-3 py-1.5 flex items-center gap-2 cursor-pointer hover:bg-gray-100 transition-all">
            <ShoppingBag size={18} className="text-gray-400" />
            <span className="text-xs font-bold text-[#811920]">Rs {grandTotal}</span>
          </Link>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[55] bg-black/20 backdrop-blur-sm md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="absolute top-16 left-0 right-0 bg-white border-b border-gray-100 p-6 flex flex-col gap-4 animate-in slide-in-from-top duration-300">
            <Link href="/home" className="text-lg font-black text-gray-900">Home</Link>
            <Link href="/home" className="text-lg font-black text-gray-900">Menu</Link>
            {lastOrderId && <Link href={trackLink} className="text-lg font-black text-gray-900">Track Order</Link>}
            <Link href="/deals" className="text-lg font-black text-gray-900">Deals</Link>
            <div className="h-px bg-gray-100 my-2" />
            <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
              <MapPin size={18} className="text-[#811920]" />
              <span>Islamabad</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
