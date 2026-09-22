import * as React from "react"
import { cn } from "@/lib/utils"

export interface RedPenCorrectionProps extends React.HTMLAttributes<HTMLSpanElement> {
  original: string
  correction: string
}

export function RedPenCorrection({
  original,
  correction,
  className,
  ...props
}: RedPenCorrectionProps) {
  return (
    <span className={cn("inline-flex flex-col items-center justify-center relative mx-1", className)} {...props}>
      <span 
        className="text-red font-kalam text-lg leading-none absolute -top-5 whitespace-nowrap rotate-[-2deg]"
      >
        {correction}
      </span>
      <span className="text-red/70 line-through decoration-red decoration-2">
        {original}
      </span>
    </span>
  )
}
