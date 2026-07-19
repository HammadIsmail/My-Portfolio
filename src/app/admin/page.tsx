import connectDB from "@/lib/db";
import Project from "@/models/Project";
import Hackathon from "@/models/Hackathon";
import Blog from "@/models/Blog";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import ProjectActions from "@/components/admin/ProjectActions";
import HackathonActions from "@/components/admin/HackathonActions";
import BlogActions from "@/components/admin/BlogActions";

export const dynamic = 'force-dynamic';

interface SearchParams {
  tab?: string;
}

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  await connectDB();
  const resolvedSearchParams = await searchParams;
  const activeTab = resolvedSearchParams.tab || "projects";

  const [projects, hackathons, blogs] = await Promise.all([
    Project.find({}).sort({ createdAt: -1 }),
    Hackathon.find({}).sort({ createdAt: -1 }),
    Blog.find({}).sort({ createdAt: -1 }),
  ]);

  return (
    <div className="space-y-8">
      {/* Title & Tabs */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-serif">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your portfolio projects, hackathons, and blogs.</p>
        </div>

        {/* Tab Switcher Links */}
        <div className="flex rounded-lg border border-border bg-card p-1 self-start">
          <Button
            asChild
            variant={activeTab === "projects" ? "default" : "ghost"}
            size="sm"
            className="rounded-md"
          >
            <Link href="/admin?tab=projects">Projects</Link>
          </Button>
          <Button
            asChild
            variant={activeTab === "hackathons" ? "default" : "ghost"}
            size="sm"
            className="rounded-md"
          >
            <Link href="/admin?tab=hackathons">Hackathons</Link>
          </Button>
          <Button
            asChild
            variant={activeTab === "blogs" ? "default" : "ghost"}
            size="sm"
            className="rounded-md"
          >
            <Link href="/admin?tab=blogs">Blogs</Link>
          </Button>
        </div>
      </div>

      {/* Projects Tab */}
      {activeTab === "projects" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Projects ({projects.length})</h2>
            <Button asChild size="sm">
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
      )}

      {/* Hackathons Tab */}
      {activeTab === "hackathons" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Hackathons ({hackathons.length})</h2>
            <Button asChild size="sm">
              <Link href="/admin/add-hackathon">
                <PlusCircle className="w-4 h-4 mr-2" />
                Add Hackathon
              </Link>
            </Button>
          </div>

          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
            {hackathons.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No hackathons found. Add one to get started.
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
                    {hackathons.map((hackathon) => (
                      <tr key={hackathon._id.toString()} className="hover:bg-muted/20 transition-colors">
                        <td className="p-4 font-medium">{hackathon.title}</td>
                        <td className="p-4">
                          {hackathon.featured ? (
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
                          {new Date(hackathon.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-right">
                          <HackathonActions hackathonId={hackathon._id.toString()} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Blogs Tab */}
      {activeTab === "blogs" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Blog Posts ({blogs.length})</h2>
            <Button asChild size="sm">
              <Link href="/admin/add-blog">
                <PlusCircle className="w-4 h-4 mr-2" />
                Add Blog Post
              </Link>
            </Button>
          </div>

          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
            {blogs.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No blog posts found. Add one to get started.
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
                    {blogs.map((blog) => (
                      <tr key={blog._id.toString()} className="hover:bg-muted/20 transition-colors">
                        <td className="p-4 font-medium">{blog.title}</td>
                        <td className="p-4">
                          {blog.featured ? (
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
                          {new Date(blog.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-right">
                          <BlogActions blogId={blog._id.toString()} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
