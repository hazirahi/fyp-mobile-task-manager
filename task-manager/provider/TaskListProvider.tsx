import { supabase } from "@/config/initSupabase";
import { createContext, PropsWithChildren, useContext, useState } from "react";
import { useAuth } from '@/provider/AuthProvider';

export type Task = {
    id: number
    user_id: string
    task_name: string
    task_description: string
    isCompleted: boolean
    created_at: Date | null
    module_id: number | null
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

// export type TaskSection = {
//     task_id: number
//     task_name: string
//     task_description: string
//     section_id: number
//     section_name: string
// }

type TaskListItem = {
    tasks: TaskCat[];
    modules: Module[];
    categories: Category[];
    // moduleCat: ModuleCat[];
    // taskSections: Task[];
    getModule: () => void;
    getCategory: () => void;
    // getModuleCat: () => void;
    getTasks: () => void;
    // getTaskSection: () => void;
    addModule: (
        module_title: Module['module_title'],
        module_description: Module['module_description'],
        colour: Module['colour']
    ) => void;
    addCategory: (
        category_name: Category['category_name']
    ) => void;
    addTask: (
        task_name: TaskCat['task_name'],
        task_description: TaskCat['task_description'],
        module_id: TaskCat['module_id'],
        category_id: TaskCat['category_id']
        // task_name: string, task_description: string, moduleId: number, categoryId: number
    ) => void;
    onCheckPressed: (task: Task) => void;
    onDelete: (task: Task) => void;
};

const TaskListContext = createContext<TaskListItem>({
    tasks: [],
    modules: [],
    categories: [],
    // moduleCat: [],
    getModule: () => {},
    getCategory: () => {},
    // getModuleCat: () => {},
    getTasks: () => {},
    addModule: () => {},
    addCategory: () => {},
    addTask: () => {},
    onCheckPressed: () => {},
    onDelete: () => {}
});

const TaskListProvider = ({ children }: PropsWithChildren) => {
    const { user } = useAuth();
    const [taskList, setTaskList] = useState<TaskCat[]>([]);
    const [moduleList, setModuleList] = useState<Module[]>([]);
    const [categoryList, setCategoryList] = useState<Category[]>([]);


    const getModule = async () => {
        const { data: moduleList } = await supabase
            .from('modules')
            .select('*')
            .order('id')
        if (moduleList)
            setModuleList(moduleList!);
    }

    const getCategory = async () => {
        const {data: categoryList} = await supabase
            .from('categories')
            .select('*')
        if (categoryList)
            setCategoryList(categoryList!);
    }

    // const getModuleCat = async () => {
    //     const {data: moduleCatList} = await supabase
    //         .from('module_categories')
    //         .select('*')
    //         .eq('module_id', 'module.id')
    //     if (moduleCatList)
    //         setModuleCatList(moduleCatList!);
    // }

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

    
    // task with section
    // const getTaskSection = async () => {
    //     const { data: taskSectionList } = await supabase
    //         .from('tasks')
    //         .select(`
    //             *,
    //             modules(
    //                 module_title
    //             ),
    //             sections(
    //                 section_name
    //             )
    //         `)
    //         .eq('section_id', 3)
    //         .order('created_at', {ascending:false})
    //     if (taskSectionList) {
    //         setTaskSectionList(taskSectionList!);
    //         // console.log('section: ', taskSectionList);
    //     }
    // }

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
        if(error)
            console.log(error.message)
        else
            setModuleList([modulelist!, ...moduleList])
    }

    const addCategory = async (
        category_name: Category['category_name']   
    ) => {
        const { data: categorylist, error } = await supabase
            .from('categories')
            .insert({
                category_name: category_name,
                user_id : user!.id
            })
            .select('*')
            .single()
        if (error)
            console.log(error.message)
        else
            setCategoryList([categorylist!, ...categoryList])
    }

    // const addTask = async (
    //     // task_name: Task['task_name'],
    //     // task_description: Task['task_description'],
    //     // module_id: Task['module_id']
    //     task_name: string, task_description: string, moduleId: number, categoryId: number
    // ) => {
    //     // if (task) {
    //         const { data: tasklist, error } = await supabase
    //             .from('tasks')
    //             .insert({ 
    //                 task_name: task_name,
    //                 task_description: task_description,
    //                 user_id: user!.id,
    //                 module_id: moduleId,
    //             })
    //             .select('*')
    //             .single()
    //         if(error)
    //             console.log(error.message)
    //         else {
    //             //get category_id associated w module_id
    //             const { data: module, error: moduleError } = await supabase
    //                 .from('module_categories')
    //                 .select('category_id')
    //                 .eq('module_id', moduleId)
    //                 .single()
    //             if(moduleError)
    //                 console.log(moduleError.message)
    //             else{
    //                 //insert into table
    //                 await supabase
    //                     .from('module_categories')
    //                     .insert({
    //                         module_id: moduleId,
    //                         category_id: categoryId,
    //                         task_id: tasklist!.id
    //                     })
    //                     .select('*')
    //                     .single()
                        
    //                 setTaskList([tasklist!, ...taskList])
    //             }
                
    //         }
    //     //}
    // }

    // onPress, complete task
    // async function onCheckPressed({id, isCompleted}: {id: number, isCompleted: boolean}){
    //     console.log(id);
    //     const { data, error } = await supabase
    //         .from('tasks')
    //         .update({ isCompleted: !isCompleted })
    //         .eq('id', id)
    //         .select ('*')
    //         .single()
        
    //     setTaskList(taskList.map((task) => (task.id === id ? data! : task)))

    //     if (error) {
    //         throw error;
    //     }
    // }

    const addTask = async (
        task_name: TaskCat['task_name'],
        task_description: TaskCat['task_description'],
        moduleId: TaskCat['module_id'],
        categoryId: TaskCat['category_id']
    ) => {
        try {
            console.log('adding task: ', task_name);
            const { data: tasklist, error } = await supabase
                .from('tasks')
                .insert({ 
                    task_name: task_name,
                    task_description: task_description,
                    user_id: user!.id,
                    module_id: moduleId,
                })
                .select('*')
                .single()
            if(error)
                console.log(error.message)
            else {
                console.log('tasklist: ', tasklist);
                const taskId = tasklist.id;
                console.log('catid: ', categoryId, moduleId, taskId);
                const { data: taskcat, error: taskcatError } = await supabase
                    .from('module_categories')
                    .insert({
                        category_id: categoryId,
                        module_id: moduleId,
                        task_id: taskId,
                        user_id: user!.id
                    })
                    .select('*')
                    .single()
                if(taskcatError)
                    console.log(taskcatError.message)
                else{
                    console.log('taskcat: ', tasklist.task_name);
                    setTaskList([tasklist, ...taskList]);
                    
                }
            
            }
        } catch (error: any) {
            console.log(error.message)
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
        console.log('oncheckpressed: ', task);
        if (error) {
            throw error;
        }
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

    return (
        <TaskListContext.Provider value={{
            tasks: taskList,
            modules: moduleList,
            categories: categoryList,
            // moduleCat: moduleCatList,
            getModule,
            getCategory,
            // getModuleCat,
            getTasks,
            // getTaskSection,
            addModule,
            addCategory,
            addTask,
            onCheckPressed,
            onDelete
        }}>
            {children}
        </TaskListContext.Provider>
    );
};

export default TaskListProvider;

export const useTaskList = () => useContext(TaskListContext);