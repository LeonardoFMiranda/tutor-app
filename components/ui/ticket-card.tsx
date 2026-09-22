import * as React from "react"
import { cn } from "@/lib/utils"

export interface TicketCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  isSpecial?: boolean
}

export function TicketCard({
  children,
  className,
  isSpecial = false,
  ...props
}: TicketCardProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col md:flex-row bg-card text-card-foreground border border-line shadow-sm overflow-hidden",
        isSpecial ? "bg-[#E3DEC9] border-gold/50" : "bg-card",
        className
      )}
      style={{
        // Using a mask image to create the perforated edge effect on the right side
        // or just a simple dashed border if mask is too complex for all browsers.
        // We'll use CSS repeating linear gradient to create a jagged edge
      }}
      {...props}
    >
      <div className="flex-1 p-6 relative">
        {children}
      </div>
      
      {/* Perforated tear line between main content and the right edge (like a ticket stub) */}
      {!isSpecial && (
        <div className="hidden md:block w-0 border-l-2 border-dashed border-line/60 mx-2 my-4 relative">
          {/* Top and bottom notches */}
          <div className="absolute -top-6 -left-3 w-6 h-6 bg-background rounded-full border border-line border-b-transparent border-l-transparent rotate-45" />
          <div className="absolute -bottom-6 -left-3 w-6 h-6 bg-background rounded-full border border-line border-t-transparent border-r-transparent rotate-45" />
        </div>
      )}
    </div>
  )
}
