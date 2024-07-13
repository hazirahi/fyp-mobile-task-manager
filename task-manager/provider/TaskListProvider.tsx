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

type TaskListItem = {
    tasks: Task[];
    modules: Module[];
    getModule: () => void;
    getTasks: () => void;
    addModule: (
        module_title: Module['module_title'],
        module_description: Module['module_description'],
        colour: Module['colour']
    ) => void;
    addTask: (
        task_name: Task['task_name'],
        task_description: Task['task_description'],
        module_id: Task['module_id']
    ) => void;
    onCheckPressed: (task: Task) => void;
    onDelete: (task: Task) => void;
};

const TaskListContext = createContext<TaskListItem>({
    tasks: [],
    modules: [],
    getModule: () => {},
    getTasks: () => {},
    addModule: () => {},
    addTask: () => {},
    onCheckPressed: () => {},
    onDelete: () => {}
});

const TaskListProvider = ({ children }: PropsWithChildren) => {
    const { user } = useAuth();
    const [taskList, setTaskList] = useState<Task[]>([]);
    const [moduleList, setModuleList] = useState<Module[]>([])

    // task with module
    // const getModule = async () => {
    //     const { data:moduleList } = await supabase
    //         .from('tasks')
    //         .select(`
    //             task_name,
    //             task_description,
    //             modules (
    //                 module_title
    //             )
    //         `)
    //     console.log('module: ', moduleList);
    //     // setModuleList(moduleList!);
    // }

    const getModule = async () => {
        const { data: moduleList } = await supabase
            .from('modules')
            .select('*')
        if (moduleList)
            setModuleList(moduleList!);
    }

    const getTasks = async () => {
        const {data: taskList} = await supabase
            .from('tasks')
            .select ('*, modules(*)')
            .order('created_at', {ascending:false})
        if (taskList) {
            setTaskList(taskList!);
            // console.log('provider: ', taskList);
        }
    }

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

    const addTask = async (
        task_name: Task['task_name'],
        task_description: Task['task_description'],
        module_id: Task['module_id']
    ) => {
        // if (task) {
            const { data: tasklist, error } = await supabase
                .from('tasks')
                .insert({ 
                    task_name: task_name,
                    task_description: task_description,
                    user_id: user!.id,
                    module_id: module_id
                })
                .select('*')
                .single()
            if(error)
                console.log(error.message)
            else {
                setTaskList([tasklist!, ...taskList])
            }
        //}
    }

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

    async function onCheckPressed(task:Task){
        const { data, error } = await supabase
            .from('tasks')
            .update({ isCompleted: !task.isCompleted })
            .eq('id', task.id)
            .select ('*')
            .single()
        
        setTaskList(taskList.map((x) => (x.id === task.id ? data! : x)))

        if (error) {
            throw error;
        }
    }

    // delete task
    // async function onDelete(id: string){
    //     const { error } = await supabase
    //         .from('tasks')
    //         .delete()
    //         .eq('id', id)
    //     if (error) 
    //         console.log('error', error)
    //     else
    //         setTaskList(taskList.filter((x) => x.id !== Number(id)))
    // }

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
            getModule,
            getTasks,
            addModule,
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