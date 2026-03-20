import * as React from "react"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "bg-purple-600/20 text-purple-400 border-purple-600/30",
    secondary: "bg-slate-800 text-slate-300 border-slate-700",
    destructive: "bg-red-600/20 text-red-400 border-red-600/30",
    outline: "border border-slate-700 text-slate-300",
    success: "bg-green-600/20 text-green-400 border-green-600/30",
    warning: "bg-yellow-600/20 text-yellow-400 border-yellow-600/30",
  }

  return (
    <div
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 ${
        variants[variant]
      } ${className || ""}`}
      {...props}
    />
  )
}

export { Badge }
