import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { NavLink, useLocation } from "react-router-dom"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  name: string
  url: string
  icon: LucideIcon
}

interface NavBarProps {
  items: NavItem[]
  className?: string
}

export function NavBar({ items, className }: NavBarProps) {
  const location = useLocation()
  const [activeTab, setActiveTab] = useState(items[0]?.name ?? "")
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const current = items.find((item) => item.url === location.pathname)
    if (current) {
      setActiveTab(current.name)
    }
  }, [location.pathname, items])

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div
      className={cn(
        "flex items-center gap-1 p-1.5 bg-muted/60 backdrop-blur-xl border border-border/60 rounded-full shadow-sm",
        className,
      )}
    >
      {items.map((item) => {
        const Icon = item.icon
        const isActive = activeTab === item.name

        return (
          <NavLink
            key={item.name}
            to={item.url}
            onClick={() => setActiveTab(item.name)}
            className={cn(
              "relative cursor-pointer text-sm font-semibold px-4 py-2 rounded-full transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
              "text-foreground/70 hover:text-foreground",
              isActive && "text-primary",
            )}
          >
            {isActive && (
              <motion.div
                layoutId="tubelight-indicator"
                className="absolute inset-0 bg-background rounded-full shadow-md"
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <Icon className="w-4 h-4" />
              {!isMobile && <span>{item.name}</span>}
            </span>
            {isActive && (
              <motion.div
                layoutId="tubelight-glow"
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full blur-[3px]"
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                }}
              />
            )}
          </NavLink>
        )
      })}
    </div>
  )
}
