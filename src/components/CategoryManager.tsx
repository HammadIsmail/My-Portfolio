import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Plus, Save, X } from 'lucide-react';
import { toast } from 'sonner';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  createdAt: string;
}

const CategoryManager = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = () => {
    const stored = JSON.parse(localStorage.getItem('blogCategories') || '[]');
    setCategories(stored);
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: generateSlug(name),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    if (!formData.slug.trim()) {
      toast.error('Category slug is required');
      return;
    }

    // Check for duplicate slug
    const isDuplicate = categories.some(
      cat => cat.slug === formData.slug && cat.id !== isEditing
    );

    if (isDuplicate) {
      toast.error('A category with this slug already exists');
      return;
    }

    if (isEditing) {
      // Update existing category
      const updated = categories.map(cat =>
        cat.id === isEditing
          ? { ...cat, ...formData }
          : cat
      );
      setCategories(updated);
      localStorage.setItem('blogCategories', JSON.stringify(updated));
      toast.success('Category updated successfully');
    } else {
      // Create new category
      const newCategory: Category = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString(),
      };
      const updated = [...categories, newCategory];
      setCategories(updated);
      localStorage.setItem('blogCategories', JSON.stringify(updated));
      toast.success('Category created successfully');
    }

    resetForm();
  };

  const handleEdit = (category: Category) => {
    setIsEditing(category.id);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description,
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) {
      return;
    }

    const updated = categories.filter(cat => cat.id !== id);
    setCategories(updated);
    localStorage.setItem('blogCategories', JSON.stringify(updated));
    toast.success('Category deleted successfully');
  };

  const resetForm = () => {
    setFormData({ name: '', slug: '', description: '' });
    setIsEditing(null);
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      {!showForm && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Categories</CardTitle>
                <CardDescription>Manage your blog post categories</CardDescription>
              </div>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                New Category
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {categories.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No categories yet. Create your first category!
              </p>
            ) : (
              <div className="space-y-3">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold">{category.name}</h3>
                        <Badge variant="outline" className="text-xs">
                          /{category.slug}
                        </Badge>
                      </div>
                      {category.description && (
                        <p className="text-sm text-muted-foreground">
                          {category.description}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(category)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(category.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {showForm && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>
                  {isEditing ? 'Edit' : 'Create'} Category
                </CardTitle>
                <CardDescription>
                  {isEditing ? 'Update' : 'Add a new'} blog category
                </CardDescription>
              </div>
              <Button variant="ghost" onClick={resetForm}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category-name">Category Name *</Label>
                <Input
                  id="category-name"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g., Web Development"
                  required
                  maxLength={50}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category-slug">URL Slug *</Label>
                <Input
                  id="category-slug"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  placeholder="e.g., web-development"
                  required
                  maxLength={50}
                  pattern="[a-z0-9-]+"
                  title="Only lowercase letters, numbers, and hyphens"
                />
                <p className="text-xs text-muted-foreground">
                  Used in URLs. Only lowercase letters, numbers, and hyphens.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category-description">Description</Label>
                <Input
                  id="category-description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Brief description (optional)"
                  maxLength={200}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  <Save className="w-4 h-4 mr-2" />
                  {isEditing ? 'Update' : 'Create'} Category
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CategoryManager;
