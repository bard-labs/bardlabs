"use client"

import type React from "react"
import { AiOutlineMail as MailIcon } from "react-icons/ai"

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AiOutlinePlus as Plus,
  AiOutlineSearch as Search,
  AiOutlineLink as Link,
  AiOutlineEye as Eye,
  AiOutlineMessage as MessageSquare,
  AiOutlineInbox as Archive,
  AiOutlineEdit as Edit,
  AiOutlineDelete as Trash2,
  AiOutlineSend as Send,
} from "react-icons/ai"
import { useToast } from "@/hooks/use-toast"
import type { Database } from "@/lib/types/database"

type Outreach = Database["public"]["Tables"]["outreaches"]["Row"]
type OutreachStatus = "pending" | "sent" | "seen" | "responded" | "archived"

export default function OutreachesPage() {
  const [outreaches, setOutreaches] = useState<Outreach[]>([])
  const [filteredOutreaches, setFilteredOutreaches] = useState<Outreach[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<OutreachStatus | "all">("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingOutreach, setEditingOutreach] = useState<Outreach | null>(null)
  const [formData, setFormData] = useState({
    target_name: "",
    contact_link: "",
    channel: "",
    message: "",
    status: "pending" as OutreachStatus,
    response_text: "",
  })

  const supabase = createClient()
  const { toast } = useToast()

  useEffect(() => {
    fetchOutreaches()
  }, [])

  useEffect(() => {
    filterOutreaches()
  }, [outreaches, searchQuery, selectedStatus])

  const fetchOutreaches = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from("outreaches")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) throw error
      setOutreaches(data || [])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch outreaches",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filterOutreaches = () => {
    let filtered = outreaches

    if (selectedStatus !== "all") {
      filtered = filtered.filter((outreach) => outreach.status === selectedStatus)
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (outreach) =>
          outreach.target_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (outreach.contact_link?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
          outreach.channel.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    setFilteredOutreaches(filtered)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      if (editingOutreach) {
        const { error } = await supabase
          .from("outreaches")
          .update({
            target_name: formData.target_name,
            contact_link: formData.contact_link,
            channel: formData.channel,
            message: formData.message,
            status: formData.status,
            response_text: formData.response_text || null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingOutreach.id)

        if (error) throw error
        toast({ title: "Success", description: "Outreach updated successfully" })
      } else {
        const { error } = await supabase.from("outreaches").insert({
          user_id: user.id,
          target_name: formData.target_name,
          contact_link: formData.contact_link,
          channel: formData.channel,
          message: formData.message,
          status: formData.status,
          response_text: formData.response_text || null,
          date: new Date().toISOString(),
        })

        if (error) throw error
        toast({ title: "Success", description: "Outreach created successfully" })
      }

      resetForm()
      setIsDialogOpen(false)
      fetchOutreaches()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save outreach",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this outreach?")) return

    try {
      const { error } = await supabase.from("outreaches").delete().eq("id", id)

      if (error) throw error
      toast({ title: "Success", description: "Outreach deleted successfully" })
      fetchOutreaches()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete outreach",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (outreach: Outreach) => {
    setEditingOutreach(outreach)
    setFormData({
      target_name: outreach.target_name,
      contact_link: outreach.contact_link || "",
      channel: outreach.channel,
      message: outreach.message,
      status: outreach.status,
      response_text: outreach.response_text || "",
    })
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setEditingOutreach(null)
    setFormData({
      target_name: "",
      contact_link: "",
      channel: "",
      message: "",
      status: "pending",
      response_text: "",
    })
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    resetForm()
  }

  const getStatusIcon = (status: OutreachStatus) => {
    switch (status) {
      case "pending":
        return <MailIcon className="h-4 w-4" />
      case "sent":
        return <Send className="h-4 w-4" />
      case "seen":
        return <Eye className="h-4 w-4" />
      case "responded":
        return <MessageSquare className="h-4 w-4" />
      case "archived":
        return <Archive className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: OutreachStatus) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "sent":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "seen":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20"
      case "responded":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "archived":
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  const stats = {
    total: outreaches.length,
    sent: outreaches.filter((o) => o.status === "sent" || o.status === "seen" || o.status === "responded").length,
    seen: outreaches.filter((o) => o.status === "seen" || o.status === "responded").length,
    responded: outreaches.filter((o) => o.status === "responded").length,
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Outreaches</h1>
          <p className="text-muted-foreground">Track and manage your outreach campaigns</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="mr-2 h-4 w-4" />
              Add Outreach
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingOutreach ? "Edit Outreach" : "Add New Outreach"}</DialogTitle>
              <DialogDescription>
                {editingOutreach ? "Update outreach details" : "Create a new outreach attempt"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="target_name">Target Name</Label>
                  <Input
                    id="target_name"
                    placeholder="John Doe"
                    value={formData.target_name}
                    onChange={(e) => setFormData({ ...formData, target_name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_link">Contact Info Link</Label>
                  <Input
                    id="contact_link"
                    placeholder="e.g., https://instagram.com/username, telegram://userid, mailto:john@example.com"
                    value={formData.contact_link}
                    onChange={(e) => setFormData({ ...formData, contact_link: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="channel">Channel</Label>
                  <Input
                    id="channel"
                    placeholder="e.g., Email, LinkedIn, Twitter"
                    value={formData.channel}
                    onChange={(e) => setFormData({ ...formData, channel: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: OutreachStatus) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="sent">Sent</SelectItem>
                      <SelectItem value="seen">Seen</SelectItem>
                      <SelectItem value="responded">Responded</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Your outreach message..."
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                />
              </div>
              {(formData.status === "responded" || editingOutreach?.status === "responded") && (
                <div className="space-y-2">
                  <Label htmlFor="response_text">Response</Label>
                  <Textarea
                    id="response_text"
                    placeholder="Their response..."
                    rows={4}
                    value={formData.response_text}
                    onChange={(e) => setFormData({ ...formData, response_text: e.target.value })}
                  />
                </div>
              )}
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={handleDialogClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : editingOutreach ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Outreaches</CardDescription>
            <CardTitle className="text-3xl">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Sent</CardDescription>
            <CardTitle className="text-3xl">{stats.sent}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Seen</CardDescription>
            <CardTitle className="text-3xl">{stats.seen}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Responded</CardDescription>
            <CardTitle className="text-3xl text-green-500">{stats.responded}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search outreaches..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={selectedStatus === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedStatus("all")}
          >
            All
          </Button>
          <Button
            variant={selectedStatus === "pending" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedStatus("pending")}
          >
            Pending
          </Button>
          <Button
            variant={selectedStatus === "sent" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedStatus("sent")}
          >
            Sent
          </Button>
          <Button
            variant={selectedStatus === "seen" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedStatus("seen")}
          >
            Seen
          </Button>
          <Button
            variant={selectedStatus === "responded" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedStatus("responded")}
          >
            Responded
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading outreaches...</p>
        </div>
      ) : filteredOutreaches.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Link className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No outreaches yet</h3>
            <p className="text-sm text-muted-foreground mb-4">Start tracking your outreach campaigns</p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Outreach
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredOutreaches.map((outreach) => (
            <Card key={outreach.id}>
              <CardHeader>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-lg truncate">{outreach.target_name}</CardTitle>
                      <Badge className={getStatusColor(outreach.status)}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(outreach.status)}
                          <span className="capitalize">{outreach.status}</span>
                        </span>
                      </Badge>
                    </div>
                    <CardDescription className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Link className="h-3 w-3" />
                        <span
                          className="truncate text-blue-500 hover:underline cursor-pointer"
                          onClick={() => {
                            if (outreach.contact_link) {
                              if (outreach.contact_link.startsWith("http")) {
                                window.open(outreach.contact_link, "_blank")
                              } else if (outreach.contact_link.includes("@")) {
                                window.location.href = `mailto:${outreach.contact_link}`
                              } else if (outreach.contact_link.startsWith("telegram://")) {
                                window.open(outreach.contact_link, "_blank")
                              }
                            }
                          }}
                        >
                          {outreach.contact_link || "No contact info"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs">Channel: {outreach.channel}</span>
                        <span className="text-xs">•</span>
                        <span className="text-xs">{new Date(outreach.date).toLocaleDateString()}</span>
                      </div>
                    </CardDescription>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(outreach)}>
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(outreach.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium mb-1">Message:</p>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{outreach.message}</p>
                </div>
                {outreach.response_text && (
                  <div className="border-t pt-3">
                    <p className="text-sm font-medium mb-1 text-green-500">Response:</p>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{outreach.response_text}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
