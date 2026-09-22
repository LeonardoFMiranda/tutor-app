import * as React from "react"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

export interface StampBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  text?: string
  icon?: LucideIcon
  color?: "red" | "navy" | "green" | "gold"
  rotation?: string
  size?: "sm" | "md" | "lg"
}

export function StampBadge({
  text,
  icon: Icon,
  color = "red",
  rotation = "-rotate-3",
  size = "md",
  className,
  ...props
}: StampBadgeProps) {
  const colorMap = {
    red: "text-red border-red",
    navy: "text-navy border-navy",
    green: "text-green border-green",
    gold: "text-gold border-gold",
  }

  const bgMap = {
    red: "bg-red/5",
    navy: "bg-navy/5",
    green: "bg-green/5",
    gold: "bg-gold/5",
  }

  const sizeMap = {
    sm: "w-10 h-10 text-[10px]",
    md: "w-16 h-16 text-xs",
    lg: "w-24 h-24 text-sm",
  }

  const iconSizeMap = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  }

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-full border-2 border-dashed opacity-90 mix-blend-multiply select-none flex-shrink-0",
        "font-special uppercase font-bold tracking-widest text-center leading-tight",
        colorMap[color],
        bgMap[color],
        sizeMap[size],
        rotation,
        className
      )}
      style={{
        boxShadow: "inset 0 0 4px currentColor",
      }}
      {...props}
    >
      <div className="flex flex-col items-center justify-center p-1">
        {Icon && <Icon className={cn(text ? "mb-0.5" : "", iconSizeMap[size])} />}
        {text && <span>{text}</span>}
      </div>
    </div>
  )
}
