import { LucideIcon } from 'lucide-react'

export interface FileItem {
    name: string
    type: 'file'
    path: string
    icon?: LucideIcon
}

export interface FolderItem {
    name: string
    type: 'folder'
    children: (FileItem | FolderItem)[]
    isOpen?: boolean
} 