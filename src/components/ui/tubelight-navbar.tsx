import { motion } from "framer-motion"
import { NavLink, useLocation } from "react-router-dom"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  name: string
  url: string
  icon: LucideIcon
  /** Extra paths that should also mark this item as active */
  aliases?: string[]
}

interface NavBarProps {
  items: NavItem[]
  className?: string
}

function matchScore(pathname: string, item: NavItem) {
  const candidates = [item.url, ...(item.aliases ?? [])]
  let score = -1
  for (const c of candidates) {
    if (pathname === c) score = Math.max(score, 1000)
    else if (c !== "/" && pathname.startsWith(c + "/")) score = Math.max(score, c.length)
  }
  return score
}

export function NavBar({ items, className }: NavBarProps) {
  const location = useLocation()

  let activeName = items[0]?.name ?? ""
  let best = -1
  for (const item of items) {
    const s = matchScore(location.pathname, item)
    if (s > best) {
      best = s
      activeName = item.name
    }
  }

  return (
    <div
      className={cn(
        "flex items-end gap-0.5 px-1.5 py-1 rounded-2xl border border-border/60 bg-card/90 backdrop-blur-xl shadow-lg",
        className,
      )}
    >
      {items.map((item) => {
        const Icon = item.icon
        const isActive = activeName === item.name

        return (
          <NavLink
            key={item.name}
            to={item.url}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "relative flex flex-col items-center justify-center gap-0.5 rounded-xl px-2.5 py-2 min-w-[52px] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
              isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {isActive && (
              <motion.div
                layoutId="tubelight-pill"
                className="absolute inset-0 rounded-xl bg-primary/10"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              >
                {/* Tubelight lamp */}
                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-primary">
                  <div className="absolute -top-2 -left-2 w-12 h-6 rounded-full bg-primary/25 blur-md" />
                  <div className="absolute -top-1 left-0 w-8 h-5 rounded-full bg-primary/25 blur-md" />
                  <div className="absolute top-0 left-2 w-4 h-4 rounded-full bg-primary/25 blur-sm" />
                </div>
              </motion.div>
            )}
            <Icon className={cn("relative z-10 transition-all", isActive ? "w-5 h-5" : "w-[18px] h-[18px]")} />
            <span
              className={cn(
                "relative z-10 text-[10px] leading-none font-medium tracking-tight",
                isActive && "font-semibold",
              )}
            >
              {item.name}
            </span>
          </NavLink>
        )
      })}
    </div>
  )
}
