"use client";

import { usePathname, useRouter } from "next/navigation";
import { useI18n } from "../../i18n";
import { useAuth } from "../lib/context/AuthContext";
import { 
  Store, 
  Heart, 
  Camera, 
  BookOpen, 
  UserCircle 
} from "lucide-react";

interface TabItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  color: string;
}

export default function TabBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useI18n();
  const { user } = useAuth();

  // Don't show tab bar on auth pages or if user is not authenticated
  const hideTabBar = !user || 
    pathname === "/" || 
    pathname === "/register" || 
    pathname.startsWith("/register/") ||
    pathname === "/checkout" ||
    pathname.startsWith("/checkout/");

  if (hideTabBar) {
    return null;
  }

  const tabItems: TabItem[] = [
    {
      icon: <Store size={20} />,
      label: t("navigation.market"),
      href: "/product",
      color: "bg-primary",
    },
    {
      icon: <Heart size={20} />,
      label: t("navigation.menu"),
      href: "/menu",
      color: "bg-primary",
    },
    {
      icon: <Camera size={20} />,
      label: t("navigation.scan"),
      href: "/select",
      color: "bg-primary",
    },
    {
      icon: <BookOpen size={20} />,
      label: t("navigation.book"),
      href: "/book",
      color: "bg-primary",
    },
    {
      icon: <UserCircle size={20} />,
      label: t("navigation.profile"),
      href: "/profile",
      color: "bg-primary",
    },
  ];

  const isActive = (href: string) => {
    if (href === "/market") {
      return pathname === "/market" || pathname === "/product" || pathname.startsWith("/product/");
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <>
      {/* Add padding to main content */}
      <div className="pb-20" />
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe-area-inset-bottom z-50">
        <div className="flex items-center justify-around px-2 py-2">
        {tabItems.map((item, index) => {
          const active = isActive(item.href);
          return (
            <button
              key={index}
              onClick={() => router.push(item.href)}
              className={`flex flex-col items-center justify-center flex-1 py-2 px-1 min-w-0 transition-all duration-200 ${
                active 
                  ? "text-primary" 
                  : "text-neutral/60 hover:text-primary/80"
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 transition-all duration-200 ${
                active 
                  ? `${item.color} text-white shadow-md` 
                  : "bg-gray-100 text-neutral/60"
              }`}>
                {item.icon}
              </div>
            </button>
          );
        })}
        </div>
      </div>
    </>
  );
} 