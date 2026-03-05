"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"

interface AddExpenseDialogProps {
  onAdd: (label: string) => void
}

export function AddExpenseDialog({ onAdd }: AddExpenseDialogProps) {
  const [label, setLabel] = useState("")
  const [open, setOpen] = useState(false)

  const handleAdd = () => {
    const trimmed = label.trim()
    if (trimmed) {
      onAdd(trimmed)
      setLabel("")
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full gap-2 border-dashed border-primary/30 text-primary hover:bg-accent hover:text-primary"
        >
          <Plus className="h-4 w-4" />
          항목 추가
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-foreground">새 경비 항목 추가</DialogTitle>
          <DialogDescription>추가할 경비 항목의 이름을 입력하세요.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 pt-2">
          <Input
            placeholder="예: 쇼핑비, 비자비, 보험료..."
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd()
            }}
            className="text-foreground"
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <DialogClose asChild>
              <Button variant="ghost" className="text-muted-foreground">취소</Button>
            </DialogClose>
            <Button onClick={handleAdd} disabled={!label.trim()}>
              추가하기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
