"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Search, Archive, Lightbulb, Trash2, Edit } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Database } from "@/lib/types/database"

type Idea = Database["public"]["Tables"]["ideas"]["Row"]

export default function IdeasPage() {
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [filteredIdeas, setFilteredIdeas] = useState<Idea[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<"active" | "archived" | "all">("active")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingIdea, setEditingIdea] = useState<Idea | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: "",
  })

  const supabase = createClient()
  const { toast } = useToast()

  useEffect(() => {
    fetchIdeas()
  }, [])

  useEffect(() => {
    filterIdeas()
  }, [ideas, searchQuery, selectedStatus])

  const fetchIdeas = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from("ideas")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) throw error
      setIdeas(data || [])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch ideas",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filterIdeas = () => {
    let filtered = ideas

    if (selectedStatus !== "all") {
      filtered = filtered.filter((idea) => idea.status === selectedStatus)
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (idea) =>
          idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          idea.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          idea.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    setFilteredIdeas(filtered)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const tags = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)

      if (editingIdea) {
        const { error } = await supabase
          .from("ideas")
          .update({
            title: formData.title,
            description: formData.description,
            tags,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingIdea.id)

        if (error) throw error
        toast({ title: "Success", description: "Idea updated successfully" })
      } else {
        const { error } = await supabase.from("ideas").insert({
          user_id: user.id,
          title: formData.title,
          description: formData.description,
          tags,
        })

        if (error) throw error
        toast({ title: "Success", description: "Idea created successfully" })
      }

      setFormData({ title: "", description: "", tags: "" })
      setEditingIdea(null)
      setIsDialogOpen(false)
      fetchIdeas()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save idea",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleArchive = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === "active" ? "archived" : "active"
      const { error } = await supabase.from("ideas").update({ status: newStatus }).eq("id", id)

      if (error) throw error
      toast({
        title: "Success",
        description: `Idea ${newStatus === "archived" ? "archived" : "restored"} successfully`,
      })
      fetchIdeas()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update idea",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this idea?")) return

    try {
      const { error } = await supabase.from("ideas").delete().eq("id", id)

      if (error) throw error
      toast({ title: "Success", description: "Idea deleted successfully" })
      fetchIdeas()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete idea",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (idea: Idea) => {
    setEditingIdea(idea)
    setFormData({
      title: idea.title,
      description: idea.description || "",
      tags: idea.tags.join(", "),
    })
    setIsDialogOpen(true)
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    setEditingIdea(null)
    setFormData({ title: "", description: "", tags: "" })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Idea Base</h1>
          <p className="text-muted-foreground">Capture and organize your business ideas</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleDialogClose()}>
              <Plus className="mr-2 h-4 w-4" />
              Add Idea
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingIdea ? "Edit Idea" : "Add New Idea"}</DialogTitle>
              <DialogDescription>
                {editingIdea ? "Update your idea details" : "Capture a new business idea"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter idea title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your idea in detail"
                  rows={6}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  placeholder="e.g., saas, marketing, automation (comma-separated)"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">Separate tags with commas</p>
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={handleDialogClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : editingIdea ? "Update" : "Create"}
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
            placeholder="Search ideas..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={selectedStatus === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedStatus("all")}
          >
            All
          </Button>
          <Button
            variant={selectedStatus === "active" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedStatus("active")}
          >
            Active
          </Button>
          <Button
            variant={selectedStatus === "archived" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedStatus("archived")}
          >
            Archived
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading ideas...</p>
        </div>
      ) : filteredIdeas.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Lightbulb className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No ideas yet</h3>
            <p className="text-sm text-muted-foreground mb-4">Start capturing your business ideas</p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Idea
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredIdeas.map((idea) => (
            <Card key={idea.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg line-clamp-2">{idea.title}</CardTitle>
                  {idea.status === "archived" && (
                    <Badge variant="secondary" className="shrink-0">
                      Archived
                    </Badge>
                  )}
                </div>
                {idea.description && <CardDescription className="line-clamp-3">{idea.description}</CardDescription>}
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between gap-4">
                {idea.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {idea.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(idea)} className="flex-1">
                    <Edit className="mr-1 h-3 w-3" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleArchive(idea.id, idea.status)}
                    className="flex-1"
                  >
                    {idea.status === "active" ? (
                      <>
                        <Archive className="mr-1 h-3 w-3" />
                        Archive
                      </>
                    ) : (
                      <>
                        <Lightbulb className="mr-1 h-3 w-3" />
                        Restore
                      </>
                    )}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(idea.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
