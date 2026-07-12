import connectDB from "@/lib/db";
import Project from "@/models/Project";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import ProjectActions from "@/components/admin/ProjectActions";

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  await connectDB();
  const projects = await Project.find({}).sort({ createdAt: -1 });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Projects Dashboard</h1>
        <Button asChild>
          <Link href="/admin/add-project">
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Project
          </Link>
        </Button>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        {projects.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No projects found. Add one to get started.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="p-4 font-medium text-muted-foreground">Title</th>
                  <th className="p-4 font-medium text-muted-foreground">Status</th>
                  <th className="p-4 font-medium text-muted-foreground">Created</th>
                  <th className="p-4 font-medium text-muted-foreground text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {projects.map((project) => (
                  <tr key={project._id.toString()} className="hover:bg-muted/20 transition-colors">
                    <td className="p-4 font-medium">{project.title}</td>
                    <td className="p-4">
                      {project.featured ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          Featured
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                          Standard
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <ProjectActions projectId={project._id.toString()} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
