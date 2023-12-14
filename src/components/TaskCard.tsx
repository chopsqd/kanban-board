import {ITask} from "../types.ts";
import TrashIcon from "../icons/TrashIcon.tsx";
import {useState} from "react";

// Refactor this later // This is so cringe...
interface ITaskCardProps {
    task: ITask
    deleteTask: (taskId: number) => void
    updateTask: (taskId: number, content: string) => void
}

const TaskCard = ({task: {id, content}, deleteTask, updateTask}: ITaskCardProps) => {
    const [mouseOver, setMouseOver] = useState(false)
    const [editMode, setEditMode] = useState(false)

    const toggleEditMode = () => {
        setEditMode(prev => !prev)
        setMouseOver(false)
    }

    if(editMode) {
        return (
            <div
                className={"bg-mainBackgroundColor p-2.5 h-[100px] min-h-[100px] flex items-center text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-rose-500 cursor-grab relative"}
            >
                <textarea
                    className={"h-[90%] w-full resize-none border-none rounded bg-transparent text-white focus:outline-none"}
                    value={content}
                    autoFocus
                    placeholder={"Task content here..."}
                    onBlur={toggleEditMode}
                    onKeyDown={event => {
                        if(event.key === "Enter" && event.shiftKey) {
                            toggleEditMode()
                        }
                    }}
                    onChange={event => updateTask(id, event.target.value)}
                ></textarea>
            </div>
        )
    }

    return (
        <div
            className={"bg-mainBackgroundColor p-2.5 h-[100px] min-h-[100px] flex items-center text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-rose-500 cursor-grab relative task"}
            onMouseEnter={() => setMouseOver(true)}
            onMouseLeave={() => setMouseOver(false)}
            onClick={toggleEditMode}
        >
            <p className={"my-auto h-[90%] w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap"}>
                {content}
            </p>
            {mouseOver && (
                <button
                    className={"stroke-white absolute right-4 top-1/2-translate-y-1/2 bg-columnBackgroundColor p-2 rounded opacity-60 hover:opacity-100"}
                    onClick={() => deleteTask(id)}
                >
                    <TrashIcon/>
                </button>
            )}
        </div>
    );
};

export default TaskCard;
