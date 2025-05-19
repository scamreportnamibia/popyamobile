import type React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Plus } from "lucide-react"

interface FloatingActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode
}

export function FloatingActionButton({ icon = <Plus />, className, ...props }: FloatingActionButtonProps) {
  return (
    <Button
      variant="default"
      size="icon"
      className={cn(
        "fixed bottom-20 right-4 z-50 rounded-full w-14 h-14 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110",
        className,
      )}
      {...props}
    >
      {icon}
    </Button>
  )
}
