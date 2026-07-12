"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface MediaItem {
  id: string;
  url: string;
  name: string;
  addedAt: string;
}

interface MediaLibraryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (url: string) => void;
}

export default function MediaLibrary({ open, onOpenChange, onSelect }: MediaLibraryProps) {
  const [items, setItems] = useState<MediaItem[]>([]);

  useEffect(() => {
    if (open) {
      const stored = JSON.parse(localStorage.getItem("mediaLibrary") || "[]");
      setItems(stored);
    }
  }, [open]);

  const handleDelete = (id: string) => {
    const updated = items.filter((item) => item.id !== id);
    setItems(updated);
    localStorage.setItem("mediaLibrary", JSON.stringify(updated));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Media Library</DialogTitle>
        </DialogHeader>
        {items.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">
            No images in library yet. Drag image URLs into the editor to save them here.
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto py-2">
            {items.map((item) => (
              <div key={item.id} className="relative group rounded-lg overflow-hidden border border-border">
                <img
                  src={item.url}
                  alt={item.name}
                  className="w-full aspect-square object-cover cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => {
                    onSelect(item.url);
                    onOpenChange(false);
                  }}
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
