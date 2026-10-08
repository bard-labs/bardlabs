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
                    tags: string[] | null
                    title: string
                }
                Insert: {
                    created_at?: string
                    description?: string | null
                    id?: string
                    images?: Json | null
                    link?: string | null
                    tags?: string[] | null
                    title: string
                }
                Update: {
                    created_at?: string
                    description?: string | null
                    id?: string
                    images?: Json | null
                    link?: string | null
                    tags?: string[] | null
                    title?: string
                }
                Relationships: []
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
