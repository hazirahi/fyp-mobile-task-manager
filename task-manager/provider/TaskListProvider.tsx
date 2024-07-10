import { supabase } from "@/config/initSupabase";
import { createContext, PropsWithChildren, useContext, useState, useEffect } from "react";
import { useAuth } from '@/provider/AuthProvider';
import { Task } from "@/components/TaskList";

// export type Task = {
//     task_name: string
//     task_description: string | null
// }

type TaskListItem = {
    tasks: Task[];
    getTasks: () => void;
    addTask: (task: Task) => void;
    onCheckPressed: (task: Task) => void;
    onDelete: (task: Task) => void;
};

const TaskListContext = createContext<TaskListItem>({
    tasks: [],
    getTasks: () => {},
    addTask: () => {},
    onCheckPressed: () => {},
    onDelete: () => {}
});

const TaskListProvider = ({ children }: PropsWithChildren) => {
    const { user } = useAuth();
    const [taskList, setTaskList] = useState<Task[]>([]);

    // useEffect(() => {
    //     getTasks();
    // },[user]);

    const getTasks = async () => {
        const {data: taskList} = await supabase
            .from('tasks')
            .select ('*')
            .order('created_at', {ascending:false})
        if (taskList) {
            setTaskList(taskList!);
            // console.log('provider: ', taskList)
        }
    }

    const addTask = async (task:Task) => {
        if (task) {
            const { data: tasklist, error } = await supabase
                .from('tasks')
                .insert({ task_name: task.task_name, task_description: task.task_description, user_id: user!.id })
                .select('*')
                .single()
            if(error)
                console.log(error.message)
            else {
                setTaskList([tasklist!, ...taskList])
            }
        }
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
            getTasks,
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