export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    public: {
        Tables: {
            brain_nodes: {
                Row: {
                    category_id: string | null
                    created_at: string | null
                    description: string | null
                    id: string
                    label: string
                    parent_id: string | null
                    position: Json | null
                }
                Insert: {
                    category_id?: string | null
                    created_at?: string | null
                    description?: string | null
                    id?: string
                    label: string
                    parent_id?: string | null
                    position?: Json | null
                }
                Update: {
                    category_id?: string | null
                    created_at?: string | null
                    description?: string | null
                    id?: string
                    label?: string
                    parent_id?: string | null
                    position?: Json | null
                }
                Relationships: [
                    {
                        foreignKeyName: "brain_nodes_category_id_fkey"
                        columns: ["category_id"]
                        isOneToOne: false
                        referencedRelation: "categories"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "brain_nodes_parent_id_fkey"
                        columns: ["parent_id"]
                        isOneToOne: false
                        referencedRelation: "brain_nodes"
                        referencedColumns: ["id"]
                    },
                ]
            }
            categories: {
                Row: {
                    color: string
                    created_at: string | null
                    id: string
                    name: string
                    type: string
                }
                Insert: {
                    color: string
                    created_at?: string | null
                    id?: string
                    name: string
                    type: string
                }
                Update: {
                    color?: string
                    created_at?: string | null
                    id?: string
                    name?: string
                    type?: string
                }
                Relationships: []
            }
            logs: {
                Row: {
                    content: string
                    created_at: string
                    id: string
                }
                Insert: {
                    content: string
                    created_at?: string
                    id?: string
                }
                Update: {
                    content?: string
                    created_at?: string
                    id?: string
                }
                Relationships: []
            }
            projects: {
                Row: {
                    created_at: string
                    description: string | null
                    id: string
                    images: Json | null
                    link: string | null
                    status: string
                    tags: string[] | null
                    title: string
                }
                Insert: {
                    created_at?: string
                    description?: string | null
                    id?: string
                    images?: Json | null
                    link?: string | null
                    status?: string
                    tags?: string[] | null
                    title: string
                }
                Update: {
                    created_at?: string
                    description?: string | null
                    id?: string
                    images?: Json | null
                    link?: string | null
                    status?: string
                    tags?: string[] | null
                    title?: string
                }
                Relationships: []
            }
            lab_disciplines: {
                Row: {
                    id: string
                    title: string
                    subtitle: string
                    summary: string
                    sort_order: number
                    created_at: string
                }
                Insert: {
                    id: string
                    title: string
                    subtitle: string
                    summary: string
                    sort_order?: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    subtitle?: string
                    summary?: string
                    sort_order?: number
                    created_at?: string
                }
                Relationships: []
            }
            site_overview: {
                Row: {
                    id: string
                    goal: string
                    summary: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    goal: string
                    summary?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    goal?: string
                    summary?: string
                    updated_at?: string
                }
                Relationships: []
            }
            site_links: {
                Row: {
                    id: string
                    label: string
                    url: string
                    kind: string
                    sort_order: number
                    created_at: string
                }
                Insert: {
                    id: string
                    label: string
                    url: string
                    kind?: string
                    sort_order?: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    label?: string
                    url?: string
                    kind?: string
                    sort_order?: number
                    created_at?: string
                }
                Relationships: []
            }
            site_features: {
                Row: {
                    id: string
                    label: string
                    path: string
                    enabled: boolean
                    sort_order: number
                    updated_at: string
                }
                Insert: {
                    id: string
                    label: string
                    path: string
                    enabled?: boolean
                    sort_order?: number
                    updated_at?: string
                }
                Update: {
                    id?: string
                    label?: string
                    path?: string
                    enabled?: boolean
                    sort_order?: number
                    updated_at?: string
                }
                Relationships: []
            }
            project_disciplines: {
                Row: {
                    project_id: string
                    discipline_id: string
                }
                Insert: {
                    project_id: string
                    discipline_id: string
                }
                Update: {
                    project_id?: string
                    discipline_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "project_disciplines_project_id_fkey"
                        columns: ["project_id"]
                        isOneToOne: false
                        referencedRelation: "projects"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "project_disciplines_discipline_id_fkey"
                        columns: ["discipline_id"]
                        isOneToOne: false
                        referencedRelation: "lab_disciplines"
                        referencedColumns: ["id"]
                    },
                ]
            }
            lab_nodes: {
                Row: {
                    id: string
                    parent_id: string | null
                    kind: string
                    title: string
                    summary: string | null
                    href: string | null
                    ref_id: string | null
                    sort_order: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    parent_id?: string | null
                    kind: string
                    title: string
                    summary?: string | null
                    href?: string | null
                    ref_id?: string | null
                    sort_order?: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    parent_id?: string | null
                    kind?: string
                    title?: string
                    summary?: string | null
                    href?: string | null
                    ref_id?: string | null
                    sort_order?: number
                    created_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "lab_nodes_parent_id_fkey"
                        columns: ["parent_id"]
                        isOneToOne: false
                        referencedRelation: "lab_nodes"
                        referencedColumns: ["id"]
                    },
                ]
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}
