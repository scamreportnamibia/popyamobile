import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-[#6C63FF] to-[#8B5CF6] text-white shadow-md hover:shadow-lg hover:translate-y-[-2px] active:translate-y-[0px]",
        destructive:
          "bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-md hover:shadow-lg hover:translate-y-[-2px] active:translate-y-[0px]",
        outline:
          "border-2 border-input bg-background hover:bg-accent hover:text-accent-foreground hover:border-[#6C63FF]/30",
        secondary:
          "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 shadow-sm hover:shadow hover:translate-y-[-2px] active:translate-y-[0px]",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        menu: "bg-white/90 backdrop-blur-sm border border-gray-200 shadow-lg hover:shadow-xl hover:translate-y-[-2px] active:translate-y-[0px] text-gray-800 hover:bg-gradient-to-r hover:from-[#6C63FF]/5 hover:to-[#8B5CF6]/5",
      },
      size: {
        default: "h-11 px-5 py-2.5",
        sm: "h-9 rounded-md px-3",
        lg: "h-12 rounded-md px-8",
        icon: "h-11 w-11",
        pill: "h-10 px-6 rounded-full",
        menuItem: "h-14 px-4 rounded-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }
