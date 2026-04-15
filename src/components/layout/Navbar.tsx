'use client';

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingBag, Menu, Search, User, Heart, MessageCircle, ChevronDown, Shield, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCartStore } from "@/store/cart-store";
import { SearchModal } from "@/components/search/SearchModal";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { openCart } = useCartStore();
  const itemCount = useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));

  useEffect(() => {
    setIsAdmin(localStorage.getItem('ps-admin') === 'true');
  }, [pathname]);

  function handleLogout() {
    localStorage.removeItem('ps-admin');
    setIsAdmin(false);
    router.push('/');
  }

  const categories = [
    { name: "Home", href: "/" },
    { name: "All Categories", href: "/shop" },
    { name: "Whey protein", href: "/shop?category=whey-protein" },
    { name: "Pre-Workout", href: "/shop?category=pre-workout" },
    { name: "Gainer", href: "/shop?category=gainer" },
    { name: "Creatine", href: "/shop?category=creatine" },
    { name: "Fat-Burner", href: "/shop?category=fat-burner" },
  ];

  const essentials = [
    { name: "Multivitamin", href: "/shop?category=multivitamin" },
    { name: "fish-oil/Omega3", href: "/shop?category=fish-oil" },
    { name: "Joint Support", href: "/shop?category=joint-support" },
    { name: "Liver Support", href: "/shop?category=liver-support" },
    { name: "Skin and hair Support", href: "/shop?category=skin-hair-support" },
    { name: "others", href: "/shop?category=others" },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-100">
        {/* Top Tier: Logo, Search, Icons */}
        <div className="container mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <span className="text-xl md:text-2xl font-heading font-extrabold tracking-tight text-foreground">PureScoop</span>
          </Link>

          {/* Search Bar - Center (Hidden on mobile, shown on md) */}
          <div className="hidden md:flex flex-1 max-w-2xl relative group">
            <div className="relative w-full">
              <Input 
                placeholder="Search products..." 
                className="w-full h-11 pl-12 pr-4 rounded-full border-gray-200 bg-gray-50 focus:bg-white focus:ring-primary/20 transition-all text-sm"
                onFocus={() => setSearchOpen(true)}
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
            </div>
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-1 md:gap-3 shrink-0">
            {isAdmin ? (
              <>
                <Link href="/admin">
                  <Button variant="ghost" size="sm" className="hidden sm:flex items-center gap-1.5 rounded-full bg-primary/10 hover:bg-primary/20 text-primary font-bold text-xs px-3">
                    <Shield className="w-4 h-4" />
                    Admin
                  </Button>
                </Link>
                <Button variant="ghost" size="icon" className="hidden sm:flex rounded-full hover:bg-red-50 transition-colors" onClick={handleLogout} title="Logout">
                  <LogOut className="w-4 h-4 text-red-500" />
                </Button>
              </>
            ) : (
              <Link href="/login">
                <Button variant="ghost" size="icon" className="hidden sm:flex rounded-full hover:bg-gray-100 transition-colors">
                  <User className="w-5 h-5 text-gray-600" />
                </Button>
              </Link>
            )}
            <Button variant="ghost" size="icon" className="hidden sm:flex rounded-full hover:bg-gray-100 transition-colors">
              <Heart className="w-5 h-5 text-gray-600" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-full hover:bg-gray-100 transition-colors"
              onClick={openCart}
            >
              <ShoppingBag className="w-5 h-5 text-gray-600" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 ring-2 ring-white">
                  {itemCount}
                </span>
              )}
            </Button>
            <a href="https://wa.me/918130297902" target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="icon" className="rounded-full bg-green-50 hover:bg-green-100 transition-colors">
                <MessageCircle className="w-5 h-5 text-green-600" />
              </Button>
            </a>

            {/* Mobile Menu & Search Icon */}
            <div className="md:hidden flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)}>
                <Search className="w-5 h-5 text-gray-600" />
              </Button>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="w-6 h-6 text-gray-600" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <div className="flex flex-col gap-6 mt-10">
                    {categories.map((link) => (
                      <Link key={link.name} href={link.href} className="text-xl font-bold hover:text-primary transition-colors">
                        {link.name}
                      </Link>
                    ))}
                    {isAdmin && (
                      <div className="pt-4 mt-4 border-t border-gray-100 flex flex-col gap-4">
                        <Link href="/admin" className="text-xl font-bold text-primary flex items-center gap-2">
                          <Shield className="w-5 h-5" />
                          Admin Dashboard
                        </Link>
                        <button onClick={handleLogout} className="text-xl font-bold text-red-500 flex items-center gap-2 w-full text-left">
                          <LogOut className="w-5 h-5" />
                          Sign Out
                        </button>
                      </div>
                    )}
                    <div className="space-y-4">
                       <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Essentials</p>
                       {essentials.map((link) => (
                         <Link key={link.name} href={link.href} className="block text-lg font-medium hover:text-primary transition-colors">
                           {link.name}
                         </Link>
                       ))}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        {/* Bottom Tier: Categories (Desktop Only) */}
        <div className="hidden md:block bg-white border-t border-gray-50">
          <div className="container mx-auto px-6 h-12 flex items-center justify-center">
            <nav className="flex items-center gap-8 lg:gap-12">
              {categories.map((cat) => (
                <Link 
                  key={cat.name} 
                  href={cat.href} 
                  className={`text-[13px] uppercase font-bold tracking-wider transition-colors hover:text-primary ${
                    pathname === cat.href ? "text-primary border-b-2 border-primary py-3.5" : "text-gray-700 py-3.5"
                  }`}
                >
                  {cat.name}
                </Link>
              ))}
              
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1 text-[13px] uppercase font-bold tracking-wider text-gray-700 hover:text-primary outline-none transition-colors py-3.5">
                  Essenstial <ChevronDown className="w-4 h-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 p-3 rounded-2xl border-none bg-white shadow-2xl z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="grid gap-1">
                    {essentials.map((item) => (
                      <DropdownMenuItem key={item.name} asChild className="rounded-xl transition-all duration-200 focus:bg-primary/10 focus:text-primary">
                        <Link href={item.href} className="w-full cursor-pointer py-2.5 px-3 text-sm font-bold flex items-center justify-between group">
                          {item.name}
                          <div className="w-1.5 h-1.5 rounded-full bg-primary scale-0 group-hover:scale-100 transition-transform" />
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>
          </div>
        </div>
      </header>

      {/* Spacer to push content below fixed header */}
      <div className="h-[64px] md:h-[132px]" />

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
