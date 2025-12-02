import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from '@/components/ui/card';
import { Trash2, Upload, Check } from 'lucide-react';
import { toast } from 'sonner';

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

const MediaLibrary = ({ open, onOpenChange, onSelect }: MediaLibraryProps) => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    loadMedia();
  }, [open]);

  const loadMedia = () => {
    const items = JSON.parse(localStorage.getItem('mediaLibrary') || '[]');
    setMediaItems(items);
  };

  const addImage = () => {
    if (!newImageUrl) return;

    const newItem: MediaItem = {
      id: Date.now().toString(),
      url: newImageUrl,
      name: newImageUrl.split('/').pop() || 'Image',
      addedAt: new Date().toISOString(),
    };

    const updatedItems = [newItem, ...mediaItems];
    localStorage.setItem('mediaLibrary', JSON.stringify(updatedItems));
    setMediaItems(updatedItems);
    setNewImageUrl('');
    toast.success('Image added to library');
  };

  const deleteImage = (id: string) => {
    const updatedItems = mediaItems.filter(item => item.id !== id);
    localStorage.setItem('mediaLibrary', JSON.stringify(updatedItems));
    setMediaItems(updatedItems);
    toast.success('Image removed from library');
  };

  const handleSelect = () => {
    if (selectedImage) {
      onSelect(selectedImage);
      onOpenChange(false);
      setSelectedImage(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Media Library</DialogTitle>
          <DialogDescription>
            Select an image from your library or add a new one
          </DialogDescription>
        </DialogHeader>

        {/* Add New Image */}
        <div className="space-y-4 border-b pb-4">
          <Label>Add New Image</Label>
          <div className="flex gap-2">
            <Input
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              placeholder="Enter image URL"
            />
            <Button onClick={addImage} size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Add
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            💡 Tip: Drag and drop images directly into the editor to add them automatically
          </p>
        </div>

        {/* Image Grid */}
        {mediaItems.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Upload className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No images in library yet</p>
            <p className="text-sm">Add images by URL or drag them into the editor</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
              {mediaItems.map((item) => (
                <Card
                  key={item.id}
                  className={`relative group cursor-pointer transition-all ${
                    selectedImage === item.url ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedImage(item.url)}
                >
                  <CardContent className="p-2">
                    <div className="relative aspect-square overflow-hidden rounded">
                      <img
                        src={item.url}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                      {selectedImage === item.url && (
                        <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                          <Check className="w-8 h-8 text-primary-foreground" />
                        </div>
                      )}
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-3 right-3 h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteImage(item.id);
                      }}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleSelect} disabled={!selectedImage}>
                Insert Selected Image
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MediaLibrary;
