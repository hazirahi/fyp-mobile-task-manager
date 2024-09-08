import { createContext, PropsWithChildren, useContext, useState } from "react";

import { supabase } from "@/config/initSupabase";
import { useAuth } from '@/provider/AuthProvider';
import { useBadgeList } from "./BadgeProvider";

import { Task, Module, Category, Note, NoteMod, Priority } from "@/types/types";

type TaskListItem = {
    tasks: Task[];
    priorities: Priority[];
    modules: Module[];
    categories: Category[];
    notes: NoteMod[];
    getPriority: () => void;
    getModule: () => void;
    getCategory: () => void;
    getTasks: () => void;
    getTasksByCategory: () => void;
    getNotes: () => void;
    addModule: (
        module_title: Module['module_title'],
        module_description: Module['module_description'],
        colour: Module['colour']
    ) => void;
    addCategory: (
        category_name: Category['category_name'],
        module_id: Module['id']
    ) => void;
    addTask: (
        task_name: Task['task_name'],
        task_description: Task['task_description'],
        module_id: Task['module_id'],
        category_id: Task['category_id'],
        start_date: Task['due_date'],
        priority: Task['priority_id']
    ) => void;
    addNote: (
        note_title: Note['note_title'],
        note_text: Note['note_text'],
        module_id: Note['module_id']
    ) => void;
    onCheckPressed: (task: Task) => void;
    onDelete: (task: Task) => void;
    onTaskPressed: (task: Task) => void;
    updateCategory: (category: Category) => void;
};

const TaskListContext = createContext<TaskListItem>({
    tasks: [],
    priorities: [],
    modules: [],
    categories: [],
    notes: [],
    getPriority: () => {},
    getModule: () => {},
    getCategory: () => {},
    getTasks: () => {},
    getTasksByCategory: () => {},
    getNotes: () => {},
    addModule: () => {},
    addCategory: () => {},
    addTask: () => {},
    addNote: () => {},
    onCheckPressed: () => {},
    onDelete: () => {},
    onTaskPressed: () => {},
    updateCategory: () => {}
});

const TaskListProvider = ({ children }: PropsWithChildren) => {
    const { user } = useAuth();
    const { awardBadge, hasEarnedBadge } = useBadgeList();

    const [taskList, setTaskList] = useState<Task[]>([]);
    const [catTaskList, setCatTaskList] = useState<Task[]>([]);
    const [priorityList, setPriorityList] = useState<Priority[]>([]);
    const [moduleList, setModuleList] = useState<Module[]>([]);
    const [categoryList, setCategoryList] = useState<Category[]>([]);
    const [noteList, setNoteList] = useState<NoteMod[]>([]);

    // get priorities
    const getPriority = async () => {
        const { data: priorityList, error } = await supabase
            .from('priorities')
            .select('*')
        if (error)
            console.log(error.message)
        else
            setPriorityList(priorityList!);
    }

    // get all modules
    const getModule = async () => {
        const { data: moduleList } = await supabase
            .from('modules')
            .select('*')
            .order('id')
        if (moduleList)
            setModuleList(moduleList!);
    }

    // get all categories
    const getCategory = async () => {
        const {data: categoryList} = await supabase
            .from('categories')
            .select('*')
            .eq('user_id', user!.id)
        if (categoryList)
            setCategoryList(categoryList!);
    }

    
    // get all tasks
    const getTasks = async () => {
        const {data: taskList} = await supabase
            .from('tasks')
            .select ('*')
            .order('created_at', {ascending:false})
        if (taskList) {
            setTaskList(taskList!);
            // console.log('provider: ', taskList);
        }
    }

    //get tasks by cat
    const getTasksByCategory = async () => {
        const { data: catTaskList, error } = await supabase
            .from('tasks')
            .select('*,  categories(category_name)')
            .order('created_at', {ascending: false})
        if (error) {
            console.log(error.message)
            return;
        }
        
        const tasksByCategory = catTaskList.reduce((acc, task) => {
            if (!acc[task.category_id]) {
                acc[task.category_id] = [];
            }
            acc[task.category_id].push(task);
            return acc;
        }, {});

        setCatTaskList(tasksByCategory);
    }

    //get all notes
    const getNotes = async () => {
        const { data: noteList, error } = await supabase
            .from('notes')
            .select('*, modules(*)')
        if (error)
            console.log(error.message)
        else
            setNoteList(noteList!);
    }

    //add module
    const addModule = async (
        module_title: Module['module_title'],
        module_description: Module['module_description'],
        colour: Module['colour']
    ) => {
        const { data: modulelist, error } = await supabase
            .from('modules')
            .insert({
                module_title: module_title,
                module_description: module_description,
                colour: colour,
                user_id: user!.id
            })
            .select('*')
            .single()
        if(error){
            console.log(error.message)
        } else {
            // get  module count for user
            const { count } = await supabase
                .from('modules')
                .select('id', { count: 'exact', head: true })
                .eq('user_id', user!.id)

            console.log('module count ', count);
            
            // award first module badge
            if (count === 1) {
                const hasEarned = await hasEarnedBadge(2);
                if (!hasEarned) {
                    console.log('calling has earned badge', 2, user!.id)
                    awardBadge(user!.id, 2)
                } else {
                    console.log('user already has badge')
                }
            }
        
            setModuleList([modulelist!, ...moduleList])
            return modulelist.id;
        }
    }

    // add category
    const addCategory = async (
        category_name: Category['category_name'],
        module_id: Module['id']
    ) => {
        try {
            const { data: categorylist, error } = await supabase
                .from('categories')
                .insert({
                    category_name: category_name,
                    user_id : user!.id
                })
                .select('*')
                .single()
            if (error){
                throw error;
            } else {
                setCategoryList([categorylist!, ...categoryList]);
                const category_id = categorylist.id;

                //add category to module
                const { data: moduleCatList, error: moduleCatError } = await supabase
                    .from('module_categories')
                    .insert({
                        module_id: module_id,
                        category_id: category_id,
                        user_id: user!.id
                    })
                    .select('*')
                    .single()
                if (moduleCatError) {
                    console.log(moduleCatError.message)
                } else {
                    console.log('cat added to module: ', moduleCatList)
                }
                return category_id;
            }
        } catch (error) {
            throw error;
        }
           
    }

    const addTask = async (
        task_name: Task['task_name'],
        task_description: Task['task_description'],
        moduleId: Task['module_id'] | null,
        categoryId: Task['category_id'] | null,
        due_date: Task['due_date'] | null,
        priority_id: Task['priority_id'] | null
    ) => {
        try {
            console.log('adding task: ', task_name, ' due date: ', due_date);
            const { data: tasklist, error } = await supabase
                .from('tasks')
                .insert({ 
                    task_name: task_name,
                    task_description: task_description,
                    user_id: user!.id,
                    module_id: moduleId,
                    category_id: categoryId,
                    due_date: due_date,
                    priority_id: priority_id
                })
                .select('*')
                .single()
            if(error)
                console.log(error.message)
            else {
                const taskId = tasklist.id;
                console.log('catid: ', categoryId, moduleId, taskId);

                //get task count for user
                const { count } = await supabase
                    .from('tasks')
                    .select('id', { count: 'exact', head: true})
                    .eq('user_id', user!.id)

                console.log('task count ', count);

                //award first task badge
                if (count === 1) {
                    const hasEarned = await hasEarnedBadge(1);
                    if (!hasEarned) {
                        console.log('calling has earned badge', 1, user!.id)
                        awardBadge(user!.id, 1)
                    } else {
                        console.log('user already has badge')
                    }
                }

                console.log('taskcat: ', tasklist.task_name);
                setTaskList([tasklist, ...taskList]);
            }
        } catch (error: any) {
            console.log(error.message)
        }
    }

    //add note
    const addNote = async (
        note_title: Note['note_title'],
        note_text: Note['note_text'],
        module_id: Note['module_id'] | null
    ) => {
        const { data: notelist, error } = await supabase
            .from('notes')
            .insert({
                note_title: note_title,
                note_text: note_text,
                module_id: module_id,
                user_id: user!.id
            })
            .select('*')
            .single()
        if (error) {
            console.log(error.message)
        } else {
            //get note count for user
            const { count } = await supabase
                .from('notes')
                .select('id', { count: 'exact', head: true })
                .eq('user_id', user!.id)

            console.log('note count: ', count);

            //award first note badge
            if (count === 1) {
                const hasEarned = await hasEarnedBadge(5);
                if (!hasEarned) {
                    console.log('getting badge', 5, user!.id)
                    awardBadge(user!.id, 5)
                } else {
                    console.log('user already has badge')
                }
            }
            
            setNoteList([notelist!, ...noteList]);
        }
            
    }

    // check task
    async function onCheckPressed(task:Task){
        const { data, error } = await supabase
            .from('tasks')
            .update({ isCompleted: !task.isCompleted })
            .eq('id', task.id)
            .select ('*')
            .single()
        
        setTaskList(taskList.map((x) => (x.id === task.id ? data! : x)))

        const { data: completedData, error: completedError } = await supabase
            .from('user_completed_tasks')
            .select('completed_tasks')
            .eq('user_id', user!.id)
            .single()

        let newCompletedTasks = completedData?.completed_tasks || 0;

        if (newCompletedTasks === 0){
            //check if user has badge
            const hasEarned = await hasEarnedBadge(3);
            if (!hasEarned){
                awardBadge(user!.id, 3);
            }
        }

        if (newCompletedTasks === 4){
            //check if user has badge
            const hasEarned = await hasEarnedBadge(4);
            if (!hasEarned){
                awardBadge(user!.id, 4);
            }
        }

        newCompletedTasks++;

        // upsert task completions
        await supabase
            .from('user_completed_tasks')
            .upsert({
                user_id: user!.id,
                completed_tasks: newCompletedTasks
            })
        
        console.log('completed data', newCompletedTasks)

        console.log('oncheckpressed: ', task);
        if (error)
            throw error;
    }

    // delete task
    async function onDelete(task:Task){
        const { error } = await supabase
            .from('tasks')
            .delete()
            .eq('id', task.id)
        if (error) 
            console.log('error', error)
        else
            setTaskList(taskList.filter((x) => x.id !== Number(task.id)))
    }

    //edit task
    async function onTaskPressed(task:Task){
        console.log('ontaskpressed')
    }

    // update category
    async function updateCategory(category:Category) {
        const { data, error } = await supabase
            .from('categories')
            .update(category)
            .eq('user_id', user!.id)
            .select('*')
        if (error) {
            console.log(error.message)
        } else {
            console.log('category updated successfully!', category)
        }
    }

    return (
        <TaskListContext.Provider value={{
            tasks: taskList,
            priorities: priorityList,
            modules: moduleList,
            categories: categoryList,
            notes: noteList,
            getPriority,
            getModule,
            getCategory,
            getTasks,
            getTasksByCategory,
            getNotes,
            addModule,
            addCategory,
            addTask,
            addNote,
            onCheckPressed,
            onDelete,
            onTaskPressed,
            updateCategory
        }}>
            {children}
        </TaskListContext.Provider>
    );
};

export default TaskListProvider;

export const useTaskList = () => useContext(TaskListContext);