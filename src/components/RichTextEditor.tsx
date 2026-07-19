"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import ImageExtension from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import LinkExtension from '@tiptap/extension-link';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import Highlight from '@tiptap/extension-highlight';
import { Markdown } from 'tiptap-markdown';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, Code,
  List, ListOrdered, Quote, Minus, Undo, Redo,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Image as ImageIcon, Link as LinkIcon, Table as TableIcon,
  Highlighter, Trash2, ImagePlus, Loader2
} from 'lucide-react';
import { useState, useCallback, useMemo } from 'react';
import MediaLibrary from './MediaLibrary';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const RichTextEditor = ({ content, onChange }: RichTextEditorProps) => {
  // ── All hooks MUST be declared before any early return ──
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [mediaLibraryOpen, setMediaLibraryOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [imageAlignment, setImageAlignment] = useState<'left' | 'center' | 'right'>('center');
  const [isDragging, setIsDragging] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingImage(true);
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      const data = await res.json();
      setImageUrl(data.url);
      saveToMediaLibrary(data.url);
      toast.success('Image uploaded successfully');
    } catch (error: any) {
      toast.error('Upload failed: ' + error.message);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const extensions = useMemo(() => [
    StarterKit.configure({
      heading: { levels: [1, 2, 3, 4, 5, 6] },
    }),
    TextAlign.configure({
      types: ['heading', 'paragraph', 'image'],
      alignments: ['left', 'center', 'right', 'justify'],
    }),
    ImageExtension.configure({
      inline: true,
      allowBase64: true,
      HTMLAttributes: { class: 'max-w-full h-auto rounded-lg' },
    }),
    Underline,
    LinkExtension.configure({
      openOnClick: false,
      HTMLAttributes: { class: 'text-primary underline cursor-pointer' },
    }),
    Table.configure({
      resizable: true,
      HTMLAttributes: { class: 'border-collapse table-auto w-full my-4' },
    }),
    TableRow.configure({ HTMLAttributes: { class: 'border border-border' } }),
    TableHeader.configure({ HTMLAttributes: { class: 'border border-border bg-muted p-2 font-bold text-left' } }),
    TableCell.configure({ HTMLAttributes: { class: 'border border-border p-2' } }),
    Highlight.configure({ multicolor: true }),
    Markdown.configure({
      transformPastedText: true,
      transformCopiedText: true,
    }),
  ], []);

  const editor = useEditor({
    immediatelyRender: true,   // client-only component, safe to render immediately
    extensions,
    content,
    onUpdate: ({ editor }) => {
      // Save as HTML so it can be rendered directly on the project page
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[400px] p-6 text-foreground',
      },
      // Force all pastes to be treated as plain text so tiptap-markdown
      // can parse the markdown syntax (## headings, - lists, **bold**, etc.)
      handlePaste: (view, event) => {
        const clipboardData = event.clipboardData;
        if (!clipboardData) return false;

        // If clipboard contains HTML from another webpage (e.g. this chat),
        // extract the plain text version and re-dispatch as a plain paste
        // so tiptap-markdown can parse it correctly.
        const hasHtml = clipboardData.types.includes('text/html');
        const plainText = clipboardData.getData('text/plain');

        if (hasHtml && plainText) {
          // Check if the plain text looks like markdown
          const looksLikeMarkdown = /^#{1,6}\s|^[-*+]\s|^\d+\.\s|\*\*|__|`/.test(plainText.trim());
          if (looksLikeMarkdown) {
            // Prevent the default paste
            event.preventDefault();
            // Insert as plain text — tiptap-markdown's transformPastedText will parse it
            const { tr } = view.state;
            view.dispatch(tr.insertText(plainText));
            return true;
          }
        }

        return false; // Let tiptap handle normal pastes
      },
    },
  });

  const saveToMediaLibrary = useCallback((url: string) => {
    const mediaItems = JSON.parse(localStorage.getItem('mediaLibrary') || '[]');
    const newItem = {
      id: Date.now().toString(),
      url,
      name: url.split('/').pop() || 'Image',
      addedAt: new Date().toISOString(),
    };
    localStorage.setItem('mediaLibrary', JSON.stringify([newItem, ...mediaItems]));
  }, []);

  const handleDrop = useCallback((event: DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
    if (!editor) return;

    const droppedUrl =
      event.dataTransfer?.getData('text/uri-list') ||
      event.dataTransfer?.getData('text/plain');

    if (droppedUrl && (droppedUrl.startsWith('http://') || droppedUrl.startsWith('https://'))) {
      editor.chain().focus().setImage({ src: droppedUrl }).run();
      saveToMediaLibrary(droppedUrl);
      toast.success('Image added to editor and library');
    } else {
      toast.info('Drag an image URL into the editor, not a file.');
    }
  }, [editor, saveToMediaLibrary]);

  const handleDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  // ── Safe early return AFTER all hooks ──
  if (!editor) return null;

  const addImage = () => {
    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
      if (imageAlignment === 'center') editor.chain().focus().setTextAlign('center').run();
      else if (imageAlignment === 'left') editor.chain().focus().setTextAlign('left').run();
      else editor.chain().focus().setTextAlign('right').run();
      setImageUrl('');
      setImageAlignment('center');
      setImageDialogOpen(false);
    }
  };

  const addLink = () => {
    if (linkUrl) {
      if (linkText) {
        editor.chain().focus().insertContent(`<a href="${linkUrl}">${linkText}</a>`).run();
      } else {
        editor.chain().focus().setLink({ href: linkUrl }).run();
      }
      setLinkUrl('');
      setLinkText('');
      setLinkDialogOpen(false);
    }
  };

  const handleMediaLibrarySelect = (url: string) => {
    editor.chain().focus().setImage({ src: url }).run();
    toast.success('Image inserted from library');
  };

  const ToolbarButton = ({
    onClick,
    isActive,
    children,
    title,
  }: {
    onClick: () => void;
    isActive?: boolean;
    children: React.ReactNode;
    title: string;
  }) => (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={onClick}
      className={`h-8 w-8 p-0 ${isActive ? 'bg-muted' : ''}`}
      title={title}
    >
      {children}
    </Button>
  );

  return (
    <div
      className={`border rounded-lg overflow-hidden bg-background transition-all ${isDragging ? 'ring-2 ring-primary ring-offset-2' : ''}`}
      onDrop={handleDrop as any}
      onDragOver={handleDragOver as any}
      onDragLeave={handleDragLeave}
    >
      {/* Toolbar */}
      <div className="border-b bg-muted/30">
        {/* Text Style & Formatting */}
        <div className="flex flex-wrap gap-1 p-2 border-b">
          <Select
            value={
              editor.isActive('heading', { level: 1 }) ? 'h1' :
                editor.isActive('heading', { level: 2 }) ? 'h2' :
                  editor.isActive('heading', { level: 3 }) ? 'h3' :
                    'paragraph'
            }
            onValueChange={(value) => {
              if (value === 'paragraph') {
                editor.chain().focus().setParagraph().run();
              } else {
                const level = parseInt(value.replace('h', '')) as 1 | 2 | 3;
                editor.chain().focus().toggleHeading({ level }).run();
              }
            }}
          >
            <SelectTrigger className="w-[130px] h-8">
              <SelectValue placeholder="Text style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="paragraph">Paragraph</SelectItem>
              <SelectItem value="h1">Heading 1</SelectItem>
              <SelectItem value="h2">Heading 2</SelectItem>
              <SelectItem value="h3">Heading 3</SelectItem>
            </SelectContent>
          </Select>

          <div className="w-px h-6 bg-border mx-1" />

          <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} title="Bold">
            <Bold className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} title="Italic">
            <Italic className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} title="Underline">
            <UnderlineIcon className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')} title="Strikethrough">
            <Strikethrough className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleHighlight({ color: '#fef08a' }).run()} isActive={editor.isActive('highlight')} title="Highlight">
            <Highlighter className="h-4 w-4" />
          </ToolbarButton>

          <div className="w-px h-6 bg-border mx-1" />

          <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('left').run()} isActive={editor.isActive({ textAlign: 'left' })} title="Align Left">
            <AlignLeft className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('center').run()} isActive={editor.isActive({ textAlign: 'center' })} title="Align Center">
            <AlignCenter className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('right').run()} isActive={editor.isActive({ textAlign: 'right' })} title="Align Right">
            <AlignRight className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('justify').run()} isActive={editor.isActive({ textAlign: 'justify' })} title="Justify">
            <AlignJustify className="h-4 w-4" />
          </ToolbarButton>
        </div>

        {/* Lists, Media, Undo/Redo */}
        <div className="flex flex-wrap gap-1 p-2">
          <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} title="Bullet List">
            <List className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} title="Numbered List">
            <ListOrdered className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} title="Quote">
            <Quote className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleCode().run()} isActive={editor.isActive('code')} title="Inline Code">
            <Code className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal Line">
            <Minus className="h-4 w-4" />
          </ToolbarButton>

          <div className="w-px h-6 bg-border mx-1" />

          <ToolbarButton onClick={() => setLinkDialogOpen(true)} isActive={editor.isActive('link')} title="Add Link">
            <LinkIcon className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => setImageDialogOpen(true)} title="Add Image by URL">
            <ImageIcon className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => setMediaLibraryOpen(true)} title="Choose from Media Library">
            <ImagePlus className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} title="Insert Table">
            <TableIcon className="h-4 w-4" />
          </ToolbarButton>

          <div className="w-px h-6 bg-border mx-1" />

          <ToolbarButton onClick={() => editor.chain().focus().undo().run()} title="Undo">
            <Undo className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().redo().run()} title="Redo">
            <Redo className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()} title="Clear Formatting">
            <Trash2 className="h-4 w-4" />
          </ToolbarButton>
        </div>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} className="bg-background" />

      {/* Image Dialog */}
      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Insert Image</DialogTitle>
            <DialogDescription>Upload an image or provide a URL.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Upload Image</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors bg-card relative">
                <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" disabled={isUploadingImage} />
                <ImagePlus className="w-8 h-8 text-muted-foreground mb-2" />
                <span className="text-sm font-medium">Click or drag image here</span>
              </div>
            </div>

            <div className="text-center text-xs text-muted-foreground">OR</div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://example.com/image.jpg" disabled={isUploadingImage} />
            </div>
            <div className="space-y-2">
              <Label>Image Alignment</Label>
              <Select value={imageAlignment} onValueChange={(v) => setImageAlignment(v as 'left' | 'center' | 'right')}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={addImage} className="w-full" disabled={isUploadingImage}>
              {isUploadingImage ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              {isUploadingImage ? 'Uploading...' : 'Insert Image'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Link Dialog */}
      <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Insert Link</DialogTitle>
            <DialogDescription>Add a link to your content</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="linkUrl">URL</Label>
              <Input id="linkUrl" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="https://example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkText">Link Text (optional)</Label>
              <Input id="linkText" value={linkText} onChange={(e) => setLinkText(e.target.value)} placeholder="Click here" />
            </div>
            <Button onClick={addLink} className="w-full">Insert Link</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Media Library */}
      <MediaLibrary open={mediaLibraryOpen} onOpenChange={setMediaLibraryOpen} onSelect={handleMediaLibrarySelect} />
    </div>
  );
};

export default RichTextEditor;
