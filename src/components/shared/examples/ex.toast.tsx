"use client"

import { Button } from "@/components/ui/button"
import { ToastAction, ToastDescription } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"

export function ToastDemo() {
  const { toast } = useToast()

  return (
    <Button
      variant="outline"
      onClick={() => {
        toast({
          description: <ToastDescription>"Friday, February 10, 2023 at 5:57 PM"</ToastDescription>,
          action: (
            <ToastAction altText="Goto schedule to undo">Undo</ToastAction>
            
          ),
        })
      }}
    >
      Add to calendar
    </Button>
  )
}
