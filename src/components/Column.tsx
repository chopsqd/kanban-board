import {IColumn, ITask} from "../types.ts";
import TrashIcon from "../icons/TrashIcon.tsx";
import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {useState} from "react";
import PlusIcon from "../icons/PlusIcon.tsx";
import TaskCard from "./TaskCard.tsx";

interface IColumnProps {
    column: IColumn
    deleteColumn: (id: number) => void
    updateColumn: (id: number, title: string) => void

    tasks: Array<ITask>
    createTask: (columnId: number) => void
    deleteTask: (id: number) => void
    updateTask: (id: number, content: string) => void
}

const Column = ({column, deleteColumn, updateColumn, tasks, createTask, deleteTask, updateTask}: IColumnProps) => {
    const [editMode, setEditMode] = useState<boolean>(false)

    const {setNodeRef, isDragging, attributes, listeners, transform, transition} = useSortable({
        id: column.id,
        data: {
            type: "column",
            column
        },
        disabled: editMode
    })

    const style = {
        transition,
        transform: CSS.Transform.toString(transform)
    }

    if (isDragging) {
        return (
            <div
                style={style}
                ref={setNodeRef}
                className={"opacity-40 border-2 border-rose-500 bg-columnBackgroundColor w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col"}
            >

            </div>
        )
    }

    return (
        <div
            style={style}
            ref={setNodeRef}
            className={"bg-columnBackgroundColor w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col"}
        >
            <div
                {...attributes}
                {...listeners}
                onClick={() => setEditMode(true)}
                className={"bg-mainBackgroundColor text-md h-[60px] cursor-grab rounded-md rounded-b-none p-3 font-bold border-columnBackgroundColor border-4 flex items-center justify-between"}
            >
                <div className={"flex gap-2"}>
                    <div
                        className={"flex justify-center items-center bg-columnBackgroundColor px-2 py-1 text-sm rounded-full"}
                    >
                        0
                    </div>
                    {editMode
                        ? <input
                            autoFocus
                            value={column.title}
                            onChange={event => updateColumn(column.id, event.target.value)}
                            onBlur={() => setEditMode(false)}
                            onKeyDown={event => {
                                if (event.key === "Enter") {
                                    setEditMode(false)
                                }
                            }}
                            className={"bg-black focus:border-rose-500 border rounded outline-none px-2"}
                        />
                        : column.title
                    }
                </div>

                <button
                    className={"stroke-gray-500 hover:stroke-white hover:bg-columnBackgroundColor rounded px-1 py-2"}
                    onClick={() => {
                        deleteColumn(column.id)
                    }}
                >
                    <TrashIcon/>
                </button>
            </div>

            <div className={"flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto"}>
                {tasks.map(task =>
                    <TaskCard
                        key={task.id}
                        task={task}
                        deleteTask={deleteTask}
                        updateTask={updateTask}
                    />
                )}
            </div>

            <button
                className={"flex gap-2 items-center border-columnBackgroundColor border-2 rounded-md p-4 border-x-columnBackgroundColor hover:bg-mainBackgroundColor hover:text-rose-500 active:bg-black"}
                onClick={() => createTask(column.id)}
            >
                <PlusIcon/>Add task
            </button>
        </div>
    );
};

export default Column;
