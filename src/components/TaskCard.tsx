import {ITask} from "../types.ts";
import TrashIcon from "../icons/TrashIcon.tsx";
import {useState} from "react";
import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {useAppStore} from "../store.ts";

interface ITaskCardProps {
    task: ITask
}

const TaskCard = ({task}: ITaskCardProps) => {
    const {deleteTask, updateTask} = useAppStore()
    const [mouseOver, setMouseOver] = useState(false)
    const [editMode, setEditMode] = useState(false)

    const {setNodeRef, isDragging, attributes, listeners, transform, transition} = useSortable({
        id: task.id,
        data: {type: "task", task},
        disabled: editMode
    })

    const style = {
        transition,
        transform: CSS.Transform.toString(transform)
    }

    const toggleEditMode = () => {
        setEditMode(prev => !prev)
        setMouseOver(false)
    }

    const onKeyDown = (event: any) => {
        if(event.key === "Enter" && event.shiftKey) {
            toggleEditMode()
        }
    }

    if(isDragging) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className={"opacity-30 bg-mainBackgroundColor p-2.5 h-[100px] min-h-[100px] flex items-center text-left rounded-xl border-2 border-rose-500 cursor-grab relative"}
            />
        )
    }

    if(editMode) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                {...attributes}
                {...listeners}
                className={"bg-mainBackgroundColor p-2.5 h-[100px] min-h-[100px] flex items-center text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-rose-500 cursor-grab relative"}
            >
                <textarea
                    className={"h-[90%] w-full resize-none border-none rounded bg-transparent text-white focus:outline-none"}
                    value={task.content}
                    autoFocus
                    placeholder={"Task content here..."}
                    onBlur={toggleEditMode}
                    onKeyDown={onKeyDown}
                    onChange={event => updateTask(task.id, event.target.value)}
                ></textarea>
            </div>
        )
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={"bg-mainBackgroundColor p-2.5 h-[100px] min-h-[100px] flex items-center text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-rose-500 cursor-grab relative task"}
            onMouseEnter={() => setMouseOver(true)}
            onMouseLeave={() => setMouseOver(false)}
            onClick={toggleEditMode}
        >
            <p className={"my-auto h-[90%] w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap"}>
                {task.content}
            </p>
            {mouseOver && (
                <button
                    className={"stroke-white absolute right-4 top-1/2-translate-y-1/2 bg-columnBackgroundColor p-2 rounded opacity-60 hover:opacity-100"}
                    onClick={() => deleteTask(task.id)}
                >
                    <TrashIcon/>
                </button>
            )}
        </div>
    );
};

export default TaskCard;
