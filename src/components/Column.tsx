import {IColumn, ITask} from "../types.ts";
import TrashIcon from "../icons/TrashIcon.tsx";
import {SortableContext, useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {useMemo, useState} from "react";
import PlusIcon from "../icons/PlusIcon.tsx";
import TaskCard from "./TaskCard.tsx";
import {useAppStore} from "../store.ts";

interface IColumnProps {
    column: IColumn
}

const Column = ({column}: IColumnProps) => {
    const {updateColumn, deleteColumn, createTask, getFilteredTasks} = useAppStore()
    const tasks = getFilteredTasks(column.id)
    const [editMode, setEditMode] = useState<boolean>(false)
    const tasksIds: Array<number> = useMemo(() =>
        tasks.map((task: ITask) => task.id), [tasks]
    )

    const {setNodeRef, isDragging, attributes, listeners, transform, transition} = useSortable({
        id: column.id,
        data: {type: "column", column},
        disabled: editMode
    })

    const style = {
        transition,
        transform: CSS.Transform.toString(transform)
    }

    const onKeyDown = (event: any) => {
        if (event.key === "Enter") {
            setEditMode(false)
        }
    }

    if (isDragging) {
        return (
            <div
                style={style}
                ref={setNodeRef}
                className={"opacity-40 border-2 border-rose-500 bg-columnBackgroundColor w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col"}
            />
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
                    <div className={"flex justify-center items-center bg-columnBackgroundColor px-2 py-1 text-sm rounded-full"}>
                        {tasks.length}
                    </div>
                    {editMode
                        ? <input
                            autoFocus
                            value={column.title}
                            onChange={event => updateColumn(column.id, event.target.value)}
                            onBlur={() => setEditMode(false)}
                            onKeyDown={onKeyDown}
                            className={"bg-black focus:border-orange-500 border rounded outline-none px-2"}
                        />
                        : column.title
                    }
                </div>

                <button
                    className={"stroke-gray-500 hover:stroke-white hover:bg-columnBackgroundColor rounded px-1 py-2"}
                    onClick={() => deleteColumn(column.id)}
                >
                    <TrashIcon/>
                </button>
            </div>

            <div className={"flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto"}>
                <SortableContext items={tasksIds}>
                    {tasks.map(task =>
                        <TaskCard key={task.id} task={task}/>
                    )}
                </SortableContext>
            </div>

            <button
                className={"flex gap-2 items-center border-columnBackgroundColor border-2 rounded-md p-4 border-x-columnBackgroundColor hover:bg-mainBackgroundColor hover:text-lime-500 active:bg-black"}
                onClick={() => createTask(column.id)}
            >
                <PlusIcon/>Add task
            </button>
        </div>
    );
};

export default Column;
