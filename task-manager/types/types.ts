export type Task = {
    id: number
    user_id: string
    task_name: string
    task_description: string
    isCompleted: boolean
    created_at: Date | null
    module_id: number | null
    due_date: Date
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

export type ModuleCat = {
    id: number
    module_id: number
    category_id: number
    task_id: number
    user_id: string
}

export type TaskCat = Task & {
    category_id: Category['id']
}

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
