"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AiOutlinePlus as Plus,
  AiOutlineSearch as Search,
  AiOutlineFolderOpen as FolderOpen,
  AiOutlineEdit as Edit,
  AiOutlineDelete as Trash2,
  AiOutlineAim as Target,
  AiOutlineCheckCircle as CheckCircle2,
  AiOutlineSmallDash as Circle,
} from "react-icons/ai"
import { useToast } from "@/hooks/use-toast"
import type { Database } from "@/lib/types/database"

type Project = Database["public"]["Tables"]["projects"]["Row"]
type ProjectStatus = "active" | "inactive"

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<ProjectStatus | "all">("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    goals: "",
    tasks: "",
  })

  const supabase = createClient()
  const { toast } = useToast()

  useEffect(() => {
    fetchProjects()
  }, [])

  useEffect(() => {
    filterProjects()
  }, [projects, searchQuery, selectedStatus])

  const fetchProjects = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) throw error
      setProjects(data || [])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch projects",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filterProjects = () => {
    let filtered = projects

    if (selectedStatus !== "all") {
      filtered = filtered.filter((project) => project.status === selectedStatus)
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (project) =>
          project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.description?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    setFilteredProjects(filtered)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const goals = formData.goals
        .split("\n")
        .map((g) => g.trim())
        .filter(Boolean)
      const tasks = formData.tasks
        .split("\n")
        .map((t) => t.trim())
        .filter(Boolean)

      if (editingProject) {
        const { error } = await supabase
          .from("projects")
          .update({
            title: formData.name,
            description: formData.description,
            goals,
            tasks,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingProject.id)

        if (error) throw error
        toast({ title: "Success", description: "Project updated successfully" })
      } else {
        const { error } = await supabase.from("projects").insert({
          user_id: user.id,
          title: formData.name,
          description: formData.description,
          goals,
          tasks,
        })

        if (error) throw error
        toast({ title: "Success", description: "Project created successfully" })
      }

      resetForm()
      setIsDialogOpen(false)
      fetchProjects()
    } catch (error) {
      console.error("Error saving project:", error)
      toast({
        title: "Error",
        description: "Failed to save project",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return

    try {
      const { error } = await supabase.from("projects").delete().eq("id", id)

      if (error) throw error
      toast({ title: "Success", description: "Project deleted successfully" })
      fetchProjects()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (project: Project) => {
    setEditingProject(project)
    setFormData({
      name: project.title,
      description: project.description || "",
      goals: project.goals.join("\n"),
      tasks: Array.isArray(project.tasks) ? project.tasks.join("\n") : "",
    })
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setEditingProject(null)
    setFormData({
      name: "",
      description: "",
      goals: "",
      tasks: "",
    })
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    resetForm()
  }

  const calculateProgress = (tasks: string[]) => {
    if (tasks.length === 0) return 0
    const completed = tasks.filter((task) => task.startsWith("[x]") || task.startsWith("[X]")).length
    return Math.round((completed / tasks.length) * 100)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">Manage your active and planned projects</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="mr-2 h-4 w-4" />
              Add Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProject ? "Edit Project" : "Add New Project"}</DialogTitle>
              <DialogDescription>
                {editingProject ? "Update project details" : "Create a new project"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Project Name</Label>
                <Input
                  id="name"
                  placeholder="My Awesome Project"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your project..."
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="goals">Goals</Label>
                <Textarea
                  id="goals"
                  placeholder="Enter goals (one per line)"
                  rows={4}
                  value={formData.goals}
                  onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">One goal per line</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tasks">Tasks</Label>
                <Textarea
                  id="tasks"
                  placeholder="Enter tasks (one per line, use [x] for completed)"
                  rows={6}
                  value={formData.tasks}
                  onChange={(e) => setFormData({ ...formData, tasks: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">One task per line. Use [x] to mark as completed</p>
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={handleDialogClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : editingProject ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading projects...</p>
        </div>
      ) : filteredProjects.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FolderOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
            <p className="text-sm text-muted-foreground mb-4">Start organizing your work into projects</p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Project
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {filteredProjects.map((project) => {
            const tasksArray = Array.isArray(project.tasks) ? project.tasks : []
            const progress = calculateProgress(tasksArray)
            return (
              <Card key={project.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-xl mb-2">{project.title}</CardTitle>
                      <div className="flex items-center gap-2 mb-2">
                        {tasksArray.length > 0 && (
                          <span className="text-xs text-muted-foreground">{progress}% complete</span>
                        )}
                      </div>
                      {project.description && (
                        <CardDescription className="line-clamp-2">{project.description}</CardDescription>
                      )}
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(project)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(project.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  {tasksArray.length > 0 && <Progress value={progress} className="h-2" />}
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                  {project.goals.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="h-4 w-4 text-muted-foreground" />
                        <h4 className="text-sm font-semibold">Goals</h4>
                      </div>
                      <ul className="space-y-1 ml-6">
                        {project.goals.map((goal, index) => (
                          <li key={index} className="text-sm text-muted-foreground list-disc">
                            {goal}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {tasksArray.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Tasks</h4>
                      <ul className="space-y-1.5">
                        {tasksArray.slice(0, 5).map((task, index) => {
                          const isCompleted = task.startsWith("[x]") || task.startsWith("[X]")
                          const taskText = task.replace(/^\[[ xX]\]\s*/, "")
                          return (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              {isCompleted ? (
                                <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                              ) : (
                                <Circle className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                              )}
                              <span className={isCompleted ? "line-through text-muted-foreground" : ""}>
                                {taskText}
                              </span>
                            </li>
                          )
                        })}
                        {tasksArray.length > 5 && (
                          <li className="text-xs text-muted-foreground ml-6">+{tasksArray.length - 5} more tasks</li>
                        )}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
