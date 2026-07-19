"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function HackathonActions({ hackathonId }: { hackathonId: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/hackathons/${hackathonId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete hackathon");
      }

      toast({
        title: "Hackathon deleted",
        description: "The hackathon post and its images have been successfully removed.",
      });
      
      router.refresh();
    } catch (error: any) {
      toast({
        title: "Error deleting hackathon",
        description: error.message,
        variant: "destructive",
      });
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex justify-end space-x-2">
      <Button variant="outline" size="icon" asChild>
        <Link href={`/admin/edit-hackathon/${hackathonId}`}>
          <Pencil className="w-4 h-4" />
          <span className="sr-only">Edit</span>
        </Link>
      </Button>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            disabled={isDeleting}
          >
            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            <span className="sr-only">Delete</span>
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              hackathon and remove all associated media from Cloudinary.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete Hackathon
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
