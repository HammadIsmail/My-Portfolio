import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Trash2, Upload, Search, Loader2, Image as ImageIcon, Link, Copy, Check, Calendar, FileImage, Maximize2, Crop, RotateCcw, Download, CheckSquare, Square } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import ReactCrop, { type Crop as CropType, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface MediaItem {
  id: string;
  url: string;
  name: string;
  created_at: string;
}

interface ImageMetadata {
  width: number;
  height: number;
  fileSize?: string;
}

const MediaLibraryTab = () => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);
  const [imageMetadata, setImageMetadata] = useState<ImageMetadata | null>(null);
  
  // Bulk selection state
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Crop/resize state
  const [isCropMode, setIsCropMode] = useState(false);
  const [crop, setCrop] = useState<CropType>();
  const [resizeScale, setResizeScale] = useState(100);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<number | undefined>(undefined);
  
  // Filter state
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const cropImageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    loadMedia();
  }, []);

  // Load image metadata when preview opens
  useEffect(() => {
    if (previewItem) {
      const img = new Image();
      img.onload = () => {
        setImageMetadata({
          width: img.naturalWidth,
          height: img.naturalHeight,
        });
      };
      img.src = previewItem.url;

      // Try to get file size for storage images
      if (previewItem.url.includes('blog-images')) {
        const path = previewItem.url.split('blog-images/')[1];
        if (path) {
          supabase.storage
            .from('blog-images')
            .list(path.substring(0, path.lastIndexOf('/')), {
              search: path.substring(path.lastIndexOf('/') + 1),
            })
            .then(({ data }) => {
              if (data && data.length > 0) {
                const size = data[0].metadata?.size;
                if (size) {
                  setImageMetadata(prev => ({
                    ...prev!,
                    fileSize: formatFileSize(size),
                  }));
                }
              }
            });
        }
      }
    } else {
      setImageMetadata(null);
      setIsCropMode(false);
      setCrop(undefined);
      setResizeScale(100);
      setAspectRatio(undefined);
      setBrightness(100);
      setContrast(100);
      setSaturation(100);
    }
  }, [previewItem]);

  // Reset crop mode when closing preview
  useEffect(() => {
    if (!previewItem) {
      setIsCropMode(false);
    }
  }, [previewItem]);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const loadMedia = async () => {
    setIsLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setIsLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('media_library')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setMediaItems(data);
    }
    setIsLoading(false);
  };

  const uploadFiles = async (files: FileList | File[]) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("You must be logged in to upload images");
      return;
    }

    setIsUploading(true);

    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image file`);
        continue;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 5MB)`);
        continue;
      }

      try {
        const fileExt = file.name.split(".").pop();
        const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("blog-images")
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: publicUrl } = supabase.storage
          .from("blog-images")
          .getPublicUrl(uploadData.path);

        const { error: dbError } = await supabase
          .from('media_library')
          .insert({
            user_id: user.id,
            url: publicUrl.publicUrl,
            name: file.name,
          });

        if (dbError) throw dbError;

        toast.success(`${file.name} uploaded successfully`);
      } catch (error: any) {
        console.error("Upload error:", error);
        toast.error(`Failed to upload ${file.name}: ${error.message}`);
      }
    }

    setIsUploading(false);
    loadMedia();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    await uploadFiles(files);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Drag and drop handlers
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (dropZoneRef.current && !dropZoneRef.current.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      await uploadFiles(files);
    }
  }, []);

  const addImageByUrl = async () => {
    if (!newImageUrl) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("You must be logged in");
      return;
    }

    const { error } = await supabase
      .from('media_library')
      .insert({
        user_id: user.id,
        url: newImageUrl,
        name: newImageUrl.split('/').pop() || 'External Image',
      });

    if (error) {
      toast.error('Failed to add image: ' + error.message);
    } else {
      toast.success('Image added to library');
      setNewImageUrl('');
      loadMedia();
    }
  };

  const deleteImage = async (item: MediaItem) => {
    if (item.url.includes('blog-images')) {
      const path = item.url.split('blog-images/')[1];
      if (path) {
        await supabase.storage.from('blog-images').remove([path]);
      }
    }

    const { error } = await supabase
      .from('media_library')
      .delete()
      .eq('id', item.id);

    if (error) {
      toast.error('Failed to delete image');
    } else {
      toast.success('Image removed from library');
      setMediaItems(mediaItems.filter(m => m.id !== item.id));
      if (previewItem?.id === item.id) {
        setPreviewItem(null);
      }
    }
  };

  // Bulk selection handlers
  const toggleSelectItem = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
    if (newSelected.size === 0) {
      setIsSelectionMode(false);
    }
  };

  const toggleSelectAll = () => {
    if (selectedItems.size === filteredItems.length) {
      setSelectedItems(new Set());
      setIsSelectionMode(false);
    } else {
      setSelectedItems(new Set(filteredItems.map(item => item.id)));
    }
  };

  const deleteSelectedItems = async () => {
    if (selectedItems.size === 0) return;
    
    setIsDeleting(true);
    const itemsToDelete = mediaItems.filter(item => selectedItems.has(item.id));
    
    for (const item of itemsToDelete) {
      if (item.url.includes('blog-images')) {
        const path = item.url.split('blog-images/')[1];
        if (path) {
          await supabase.storage.from('blog-images').remove([path]);
        }
      }

      await supabase.from('media_library').delete().eq('id', item.id);
    }

    toast.success(`${itemsToDelete.length} image${itemsToDelete.length !== 1 ? 's' : ''} deleted`);
    setSelectedItems(new Set());
    setIsSelectionMode(false);
    setIsDeleting(false);
    loadMedia();
  };

  const cancelSelection = () => {
    setSelectedItems(new Set());
    setIsSelectionMode(false);
  };

  const copyToClipboard = async (url: string, id: string) => {
    await navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success('URL copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Aspect ratio presets
  const aspectRatioPresets = [
    { label: 'Free', value: undefined },
    { label: '16:9', value: 16 / 9 },
    { label: '4:3', value: 4 / 3 },
    { label: '1:1', value: 1 },
    { label: '3:4', value: 3 / 4 },
    { label: '9:16', value: 9 / 16 },
    { label: '2:1', value: 2 },
    { label: '21:9', value: 21 / 9 },
  ];

  // Crop/resize handlers
  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const ratio = aspectRatio || 16 / 9;
    const crop = centerCrop(
      makeAspectCrop({ unit: '%', width: 90 }, ratio, width, height),
      width,
      height
    );
    setCrop(crop);
  };

  const handleAspectRatioChange = (ratio: number | undefined) => {
    setAspectRatio(ratio);
    if (cropImageRef.current && isCropMode) {
      const { width, height } = cropImageRef.current;
      if (ratio) {
        const crop = centerCrop(
          makeAspectCrop({ unit: '%', width: 80 }, ratio, width, height),
          width,
          height
        );
        setCrop(crop);
      }
    }
  };

  const resetFilters = () => {
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
  };

  const hasFilterChanges = brightness !== 100 || contrast !== 100 || saturation !== 100;
  
  const getFilterStyle = () => ({
    filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`,
  });

  const getCroppedImage = async (): Promise<Blob | null> => {
    if (!cropImageRef.current || !previewItem) return null;

    const image = cropImageRef.current;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    let outputWidth: number;
    let outputHeight: number;
    let sourceX = 0;
    let sourceY = 0;
    let sourceWidth = image.naturalWidth;
    let sourceHeight = image.naturalHeight;

    if (isCropMode && crop) {
      sourceX = (crop.x * scaleX);
      sourceY = (crop.y * scaleY);
      sourceWidth = crop.width * scaleX;
      sourceHeight = crop.height * scaleY;
    }

    outputWidth = sourceWidth * (resizeScale / 100);
    outputHeight = sourceHeight * (resizeScale / 100);

    canvas.width = outputWidth;
    canvas.height = outputHeight;

    // Apply filters
    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;

    ctx.drawImage(
      image,
      sourceX, sourceY, sourceWidth, sourceHeight,
      0, 0, outputWidth, outputHeight
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.9);
    });
  };

  const saveEditedImage = async () => {
    if (!previewItem) return;
    
    setIsSavingEdit(true);
    
    try {
      const blob = await getCroppedImage();
      if (!blob) throw new Error('Failed to process image');

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const fileExt = 'jpg';
      const fileName = `${user.id}/${Date.now()}-edited.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(fileName, blob);

      if (uploadError) throw uploadError;

      const { data: publicUrl } = supabase.storage
        .from('blog-images')
        .getPublicUrl(uploadData.path);

      const { error: dbError } = await supabase
        .from('media_library')
        .insert({
          user_id: user.id,
          url: publicUrl.publicUrl,
          name: `${previewItem.name.replace(/\.[^/.]+$/, '')}-edited.jpg`,
        });

      if (dbError) throw dbError;

      toast.success('Edited image saved to library');
      setPreviewItem(null);
      loadMedia();
    } catch (error: any) {
      console.error('Save error:', error);
      toast.error(`Failed to save: ${error.message}`);
    } finally {
      setIsSavingEdit(false);
    }
  };

  const downloadEditedImage = async () => {
    if (!previewItem) return;

    try {
      const blob = await getCroppedImage();
      if (!blob) throw new Error('Failed to process image');

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${previewItem.name.replace(/\.[^/.]+$/, '')}-edited.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Image downloaded');
    } catch (error: any) {
      toast.error(`Failed to download: ${error.message}`);
    }
  };

  const filteredItems = mediaItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Media Library</CardTitle>
              <CardDescription>
                Upload and manage images for your blog posts. {mediaItems.length} image{mediaItems.length !== 1 ? 's' : ''} in library.
              </CardDescription>
            </div>
            {filteredItems.length > 0 && (
              <div className="flex items-center gap-2">
                {isSelectionMode ? (
                  <>
                    <span className="text-sm text-muted-foreground">
                      {selectedItems.size} selected
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={toggleSelectAll}
                    >
                      {selectedItems.size === filteredItems.length ? (
                        <>
                          <Square className="h-4 w-4 mr-2" />
                          Deselect All
                        </>
                      ) : (
                        <>
                          <CheckSquare className="h-4 w-4 mr-2" />
                          Select All
                        </>
                      )}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={deleteSelectedItems}
                      disabled={selectedItems.size === 0 || isDeleting}
                    >
                      {isDeleting ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4 mr-2" />
                      )}
                      Delete ({selectedItems.size})
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={cancelSelection}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsSelectionMode(true)}
                  >
                    <CheckSquare className="h-4 w-4 mr-2" />
                    Select
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Upload Section */}
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">
                <Upload className="h-4 w-4 mr-2" />
                Upload Files
              </TabsTrigger>
              <TabsTrigger value="url">
                <Link className="h-4 w-4 mr-2" />
                Add by URL
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="upload" className="mt-4">
              <div
                ref={dropZoneRef}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer ${
                  isDragging 
                    ? 'border-primary bg-primary/10 scale-[1.02]' 
                    : 'hover:border-primary/50'
                }`}
                onClick={() => fileInputRef.current?.click()}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                {isUploading ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Uploading...</p>
                  </div>
                ) : isDragging ? (
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="h-10 w-10 mx-auto text-primary animate-bounce" />
                    <p className="text-sm font-medium text-primary">Drop images here</p>
                  </div>
                ) : (
                  <>
                    <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-sm font-medium">Click to upload or drag and drop</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG, JPG, GIF up to 5MB (multiple files supported)
                    </p>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="url" className="mt-4">
              <div className="flex gap-2">
                <Input
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
                <Button onClick={addImageByUrl} disabled={!newImageUrl}>
                  <Link className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search images by name..."
              className="pl-10"
            />
          </div>

          {/* Image Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground border rounded-lg">
              <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="font-medium">{searchQuery ? 'No images found' : 'No images yet'}</p>
              <p className="text-sm">{searchQuery ? 'Try a different search term' : 'Upload images to get started'}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className={`group relative border rounded-lg overflow-hidden hover:shadow-md transition-all cursor-pointer ${
                    selectedItems.has(item.id) ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => isSelectionMode ? toggleSelectItem(item.id) : setPreviewItem(item)}
                >
                  {/* Selection checkbox */}
                  {isSelectionMode && (
                    <div className="absolute top-2 left-2 z-10">
                      <Checkbox
                        checked={selectedItems.has(item.id)}
                        onCheckedChange={() => toggleSelectItem(item.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-background"
                      />
                    </div>
                  )}
                  
                  <div className="aspect-square overflow-hidden bg-muted">
                    <img
                      src={item.url}
                      alt={item.name}
                      className={`w-full h-full object-cover transition-transform duration-200 ${
                        selectedItems.has(item.id) ? 'scale-95' : 'group-hover:scale-105'
                      }`}
                      loading="lazy"
                    />
                  </div>
                  <div className="p-2">
                    <p className="text-xs text-muted-foreground truncate" title={item.name}>
                      {item.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground/70">
                      {new Date(item.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  {!isSelectionMode && (
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewItem(item);
                        }}
                        title="Preview"
                      >
                        <Maximize2 className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(item.url, item.id);
                        }}
                        title="Copy URL"
                      >
                        {copiedId === item.id ? (
                          <Check className="w-3 h-3" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteImage(item);
                        }}
                        title="Delete"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Image Preview Modal with Crop/Resize */}
      <Dialog open={!!previewItem} onOpenChange={(open) => !open && setPreviewItem(null)}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden p-0">
          <DialogHeader className="p-4 pb-0">
            <DialogTitle className="flex items-center gap-2 pr-8">
              <FileImage className="h-5 w-5" />
              <span className="truncate">{previewItem?.name}</span>
            </DialogTitle>
          </DialogHeader>
          
          {previewItem && (
            <div className="flex flex-col md:flex-row gap-4 p-4">
              {/* Image / Crop Area */}
              <div className="flex-1 min-h-0 flex items-center justify-center bg-muted/50 rounded-lg overflow-hidden">
                {isCropMode ? (
                  <ReactCrop
                    crop={crop}
                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                    aspect={aspectRatio}
                    className="max-h-[60vh]"
                  >
                    <img
                      ref={cropImageRef}
                      src={previewItem.url}
                      alt={previewItem.name}
                      onLoad={onImageLoad}
                      className="max-w-full max-h-[60vh] object-contain"
                      style={getFilterStyle()}
                      crossOrigin="anonymous"
                    />
                  </ReactCrop>
                ) : (
                  <img
                    ref={cropImageRef}
                    src={previewItem.url}
                    alt={previewItem.name}
                    className="max-w-full max-h-[60vh] object-contain"
                    style={getFilterStyle()}
                    crossOrigin="anonymous"
                  />
                )}
              </div>
              
              {/* Sidebar */}
              <div className="md:w-72 space-y-4">
                {/* Metadata */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-muted-foreground text-xs">Upload Date</p>
                      <p className="font-medium">
                        {new Date(previewItem.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  
                  {imageMetadata && (
                    <>
                      <div className="flex items-center gap-2 text-sm">
                        <ImageIcon className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-muted-foreground text-xs">Dimensions</p>
                          <p className="font-medium">{imageMetadata.width} × {imageMetadata.height} px</p>
                        </div>
                      </div>
                      
                      {imageMetadata.fileSize && (
                        <div className="flex items-center gap-2 text-sm">
                          <FileImage className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-muted-foreground text-xs">File Size</p>
                            <p className="font-medium">{imageMetadata.fileSize}</p>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Edit Tools */}
                <div className="pt-4 border-t space-y-4">
                  <h4 className="text-sm font-medium">Edit Image</h4>
                  
                  {/* Crop Toggle */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant={isCropMode ? "default" : "outline"}
                      size="sm"
                      onClick={() => setIsCropMode(!isCropMode)}
                      className="flex-1"
                    >
                      <Crop className="h-4 w-4 mr-2" />
                      {isCropMode ? 'Cropping' : 'Crop'}
                    </Button>
                    {isCropMode && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setIsCropMode(false);
                          setCrop(undefined);
                          setAspectRatio(undefined);
                        }}
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  {/* Aspect Ratio Presets */}
                  {isCropMode && (
                    <div className="space-y-2">
                      <Label className="text-xs">Aspect Ratio</Label>
                      <div className="flex flex-wrap gap-1">
                        {aspectRatioPresets.map((preset) => (
                          <Button
                            key={preset.label}
                            variant={aspectRatio === preset.value ? "default" : "outline"}
                            size="sm"
                            className="h-7 px-2 text-xs"
                            onClick={() => handleAspectRatioChange(preset.value)}
                          >
                            {preset.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Resize Slider */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs">Resize</Label>
                      <span className="text-xs text-muted-foreground">{resizeScale}%</span>
                    </div>
                    <Slider
                      value={[resizeScale]}
                      onValueChange={([value]) => setResizeScale(value)}
                      min={10}
                      max={100}
                      step={5}
                    />
                    {imageMetadata && (
                      <p className="text-xs text-muted-foreground">
                        Output: {Math.round(imageMetadata.width * resizeScale / 100)} × {Math.round(imageMetadata.height * resizeScale / 100)} px
                      </p>
                    )}
                  </div>

                  {/* Filters Section */}
                  <div className="space-y-3 pt-2 border-t">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-medium">Filters</Label>
                      {hasFilterChanges && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-xs"
                          onClick={resetFilters}
                        >
                          <RotateCcw className="h-3 w-3 mr-1" />
                          Reset
                        </Button>
                      )}
                    </div>
                    
                    {/* Brightness */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs text-muted-foreground">Brightness</Label>
                        <span className="text-xs text-muted-foreground">{brightness}%</span>
                      </div>
                      <Slider
                        value={[brightness]}
                        onValueChange={([value]) => setBrightness(value)}
                        min={0}
                        max={200}
                        step={5}
                      />
                    </div>
                    
                    {/* Contrast */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs text-muted-foreground">Contrast</Label>
                        <span className="text-xs text-muted-foreground">{contrast}%</span>
                      </div>
                      <Slider
                        value={[contrast]}
                        onValueChange={([value]) => setContrast(value)}
                        min={0}
                        max={200}
                        step={5}
                      />
                    </div>
                    
                    {/* Saturation */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs text-muted-foreground">Saturation</Label>
                        <span className="text-xs text-muted-foreground">{saturation}%</span>
                      </div>
                      <Slider
                        value={[saturation]}
                        onValueChange={([value]) => setSaturation(value)}
                        min={0}
                        max={200}
                        step={5}
                      />
                    </div>
                  </div>

                  {/* Save/Download buttons */}
                  {(isCropMode || resizeScale !== 100 || hasFilterChanges) && (
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={saveEditedImage}
                        disabled={isSavingEdit}
                      >
                        {isSavingEdit ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Upload className="h-4 w-4 mr-2" />
                        )}
                        Save to Library
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={downloadEditedImage}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
                
                {/* Actions */}
                <div className="flex flex-col gap-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => copyToClipboard(previewItem.url, previewItem.id)}
                  >
                    {copiedId === previewItem.id ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy URL
                      </>
                    )}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="w-full"
                    onClick={() => deleteImage(previewItem)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Image
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MediaLibraryTab;