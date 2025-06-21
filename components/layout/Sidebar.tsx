"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  TrendingUp, 
  TrendingDown, 
  BarChart2, 
  CalendarClock,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const navItems = [
  {
    name: 'Dashboard',
    href: '/',
    icon: LayoutDashboard
  },
  {
    name: 'Income',
    href: '/income',
    icon: TrendingUp
  },
  {
    name: 'Expenses',
    href: '/expenses',
    icon: TrendingDown
  },
  {
    name: 'Monthly Summary',
    href: '/summary',
    icon: BarChart2
  },
  {
    name: 'Subscriptions',
    href: '/subscriptions',
    icon: CalendarClock
  }
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <>
      {/* Mobile Nav Toggle */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
      >
        {isMobileNavOpen ? <X /> : <Menu />}
      </Button>

      {/* Sidebar - Desktop */}
      <div className="hidden md:flex flex-col w-64 border-r bg-background fixed h-full">
        <div className="p-6">
          <h1 className="text-xl font-bold">Expense Tracker</h1>
        </div>
        <nav className="flex-1 px-4 pb-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link 
                  href={item.href}
                  className={cn(
                    "flex items-center p-3 rounded-md hover:bg-accent transition-colors",
                    pathname === item.href && "bg-accent text-accent-foreground font-medium"
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Mobile Nav */}
      <div 
        className={cn(
          "fixed inset-0 z-40 transform md:hidden bg-background transition-transform duration-300 ease-in-out",
          isMobileNavOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full pt-16">
          <nav className="flex-1 px-4 pb-4">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link 
                    href={item.href}
                    className={cn(
                      "flex items-center p-3 rounded-md hover:bg-accent transition-colors",
                      pathname === item.href && "bg-accent text-accent-foreground font-medium"
                    )}
                    onClick={() => setIsMobileNavOpen(false)}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}