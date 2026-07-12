"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, X } from "lucide-react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface SortableImageItemProps {
  id: string;
  url: string;
  onRemove: (id: string) => void;
}

export function SortableImageItem({ id, url, onRemove }: SortableImageItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative flex items-center justify-between p-3 border border-border rounded-md bg-card mb-3 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-center space-x-4">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab hover:bg-muted p-2 rounded-md touch-none"
        >
          <GripVertical className="w-5 h-5 text-muted-foreground" />
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <div className="relative w-40 h-28 rounded-md overflow-hidden bg-muted cursor-pointer hover:opacity-90 transition-opacity ring-1 ring-border">
              <Image src={url} alt="Thumbnail preview" fill className="object-cover" />
            </div>
          </DialogTrigger>
          <DialogContent className="max-w-4xl w-full p-1 bg-transparent border-none shadow-none flex justify-center">
            <div className="relative w-full aspect-video max-h-[85vh] rounded-lg overflow-hidden">
              <Image src={url} alt="Large preview" fill className="object-contain" />
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <button
        type="button"
        onClick={() => onRemove(id)}
        className="p-2 hover:bg-destructive/10 text-destructive rounded-md transition-colors"
        title="Remove image"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}
