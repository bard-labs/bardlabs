"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  AiOutlineFileText as FileText,
  AiOutlineDownload as Download,
  AiOutlineDelete as Trash2,
  AiOutlineUpload as Upload,
} from "react-icons/ai"
import { useToast } from "@/hooks/use-toast"
import type { Database } from "@/lib/types/database"

type SOP = Database["public"]["Tables"]["sops"]["Row"]

export default function SOPsPage() {
  const [sops, setSops] = useState<SOP[]>([])
  const [filteredSops, setFilteredSops] = useState<SOP[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const supabase = createClient()
  const { toast } = useToast()

  useEffect(() => {
    fetchSOPs()
  }, [])

  useEffect(() => {
    filterSOPs()
  }, [sops, searchQuery])

  const fetchSOPs = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from("sops")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) throw error
      setSops(data || [])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch SOPs",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filterSOPs = () => {
    let filtered = sops

    if (searchQuery) {
      filtered = filtered.filter(
        (sop) =>
          sop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          sop.description?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    setFilteredSops(filtered)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.type !== "application/pdf") {
        toast({
          title: "Invalid file type",
          description: "Please select a PDF file",
          variant: "destructive",
        })
        return
      }
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select a file smaller than 10MB",
          variant: "destructive",
        })
        return
      }
      setSelectedFile(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a PDF file to upload",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const fileExt = selectedFile.name.split(".").pop()
      const fileName = `${user.id}/${Date.now()}.${fileExt}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("sops")
        .upload(fileName, selectedFile)

      if (uploadError) throw uploadError

      const {
        data: { publicUrl },
      } = supabase.storage.from("sops").getPublicUrl(fileName)

      const { error: dbError } = await supabase.from("sops").insert({
        user_id: user.id,
        title: formData.title,
        description: formData.description || null,
        file_path: fileName,
        file_size: selectedFile.size,
      })

      if (dbError) throw dbError

      toast({ title: "Success", description: "SOP uploaded successfully" })
      resetForm()
      setIsDialogOpen(false)
      fetchSOPs()
    } catch (error) {
      console.error("Upload error:", error)
      toast({
        title: "Error",
        description: "Failed to upload SOP",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleDownload = async (sop: SOP) => {
    try {
      const { data, error } = await supabase.storage.from("sops").download(sop.file_path)

      if (error) throw error

      const url = URL.createObjectURL(data)
      const a = document.createElement("a")
      a.href = url
      a.download = `${sop.title}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({ title: "Success", description: "SOP downloaded successfully" })
    } catch (error) {
      console.error("Download error:", error)
      toast({
        title: "Error",
        description: "Failed to download SOP",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (sop: SOP) => {
    if (!confirm("Are you sure you want to delete this SOP?")) return

    try {
      const { error: storageError } = await supabase.storage.from("sops").remove([sop.file_path])

      if (storageError) throw storageError

      const { error: dbError } = await supabase.from("sops").delete().eq("id", sop.id)

      if (dbError) throw dbError

      toast({ title: "Success", description: "SOP deleted successfully" })
      fetchSOPs()
    } catch (error) {
      console.error("Delete error:", error)
      toast({
        title: "Error",
        description: "Failed to delete SOP",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
    })
    setSelectedFile(null)
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    resetForm()
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">SOPs</h1>
          <p className="text-muted-foreground">Store and manage your Standard Operating Procedures</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="mr-2 h-4 w-4" />
              Upload SOP
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Upload New SOP</DialogTitle>
              <DialogDescription>Upload a PDF file with your Standard Operating Procedure</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Customer Onboarding Process"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                  id="description"
                  placeholder="Brief description of this SOP"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="file">PDF File</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="file"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    required
                    className="cursor-pointer"
                  />
                </div>
                {selectedFile && (
                  <p className="text-sm text-muted-foreground">
                    Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                  </p>
                )}
                <p className="text-xs text-muted-foreground">Maximum file size: 10MB</p>
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={handleDialogClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isUploading}>
                  {isUploading ? (
                    <>
                      <Upload className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload
                    </>
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search SOPs..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading SOPs...</p>
        </div>
      ) : filteredSops.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No SOPs yet</h3>
            <p className="text-sm text-muted-foreground mb-4">Upload your first Standard Operating Procedure</p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Upload Your First SOP
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSops.map((sop) => (
            <Card key={sop.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base line-clamp-2 mb-1">{sop.title}</CardTitle>
                    {sop.description && (
                      <CardDescription className="line-clamp-2 text-xs">{sop.description}</CardDescription>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between gap-4">
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>Size: {formatFileSize(sop.file_size)}</p>
                  <p>Uploaded: {new Date(sop.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleDownload(sop)} className="flex-1">
                    <Download className="mr-1 h-3 w-3" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(sop)}>
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
