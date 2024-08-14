export type Task = {
    id: number
    user_id: string
    task_name: string
    task_description: string
    isCompleted: boolean
    created_at: Date | null
    module_id: number | null
    category_id: number | null
    due_date: Date | null
    priority_id: number | null
}

export type Priority = {
    id: number
    priority: string
}

export type Module = {
    id: number
    module_title: string
    colour: string
    module_description: string
    user_id: string
}

export type Category = {
    id: number
    category_name: string
    user_id: string
}

// export type ModuleCat = {
//     id: number
//     module_id: number
//     category_id: number | null
//     task_id: number
//     user_id: string
// }

// export type ModuleCatTask = {
//     module_id: number
//     category_id: number | null
//     task: Task
// }

// export type TaskCat = Omit<Task, 'module_id' | 'category_id'> & ModuleCatTask

export type Note = {
    id: number
    note_title: string
    note_text: string
    module_id: number
    user_id: string

}

export type NoteMod = Note & {
    modules: Module[];
}

export type Badge = {
    id: number
    badge_name: string
    badge_description: string
    badge_criteria: string
    badge_url: string
    signedUrl?: string
}

export type UserBadge = {
    id: number
    badge_id: number
    user_id: string
    earned_at: Date
}
