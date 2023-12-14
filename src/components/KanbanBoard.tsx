import {useMemo, useState} from "react";
import PlusIcon from "../icons/PlusIcon.tsx";
import {IColumn, ITask} from "../types.ts";
import Column from "./Column.tsx";
import {
    DndContext,
    DragEndEvent, DragOverEvent,
    DragOverlay,
    DragStartEvent,
    PointerSensor,
    useSensor,
    useSensors
} from "@dnd-kit/core";
import {arrayMove, SortableContext} from "@dnd-kit/sortable";
import {createPortal} from "react-dom";
import TaskCard from "./TaskCard.tsx";

const KanbanBoard = () => {
    const [columns, setColumns] = useState<IColumn[]>([])
    const [tasks, setTasks] = useState<ITask[]>([])
    const [activeColumn, setActiveColumn] = useState<IColumn | null>(null)
    const [activeTask, setActiveTask] = useState<ITask | null>(null)

    const columnsIds: Array<number> = useMemo(() =>
        columns.map((column: IColumn) => column.id), [columns]
    )
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 3
            }
        })
    )

    const createNewColumn = () => {
        setColumns([
            ...columns,
            {id: Date.now(), title: `Column ${columns.length + 1}`}
        ])
    }

    const deleteColumn = (id: number) => {
        setColumns(columns => columns.filter(column => column.id !== id))

        setTasks(tasks.filter(task => task.columnId !== id))
    }

    const updateColumn = (id: number, title: string) => {
        const updColumns = columns.map((column: IColumn) => {
            if(column.id !== id ) return column
            return {...column, title}
        })

        setColumns(updColumns)
    }

    const onDragStart = (event: DragStartEvent) => {
        if(event.active.data.current?.type === "column") {
            setActiveColumn(event.active.data.current.column)
        }

        if(event.active.data.current?.type === "task") {
            setActiveTask(event.active.data.current.task)
        }
    }

    const onDragEnd = (event: DragEndEvent) => {
        setActiveColumn(null)
        setActiveTask(null)

        const {active, over} = event

        if(!over || active.id === over.id) return

        setColumns(columns => {
            const activeColIdx = columns.findIndex(col => col.id === active.id)

            const overColIdx = columns.findIndex(col => col.id === over.id)

            return arrayMove(columns, activeColIdx, overColIdx)
        })
    }

    const onDragOver = (event: DragOverEvent) => {
        const {active, over} = event

        if(!over || active.id === over.id) return

        const isActiveTask = active.data.current?.type === "task"
        const isOverTask = over.data.current?.type === "task"

        if(!isActiveTask) return

        if(isActiveTask && isOverTask) {
            setTasks(tasks => {
                const activeTaskIdx = tasks.findIndex(tasks => tasks.id === active.id)
                const overTaskIdx = tasks.findIndex(tasks => tasks.id === over.id)

                tasks[activeTaskIdx].columnId = tasks[overTaskIdx].columnId

                return arrayMove(tasks, activeTaskIdx, overTaskIdx)
            })
        }

        const isOverColumn = over.data.current?.type === "column"

        if(isActiveTask && isOverColumn) {
            setTasks(tasks => {
                const activeTaskIdx = tasks.findIndex(tasks => tasks.id === active.id)

                //@ts-ignore
                tasks[activeTaskIdx].columnId = over.id

                return arrayMove(tasks, activeTaskIdx, activeTaskIdx)
            })
        }
    }

    const createTask = (columnId: number) => {
        setTasks([
            ...tasks,
            {id: Date.now(), columnId, content: `Task ${tasks.length + 1}`}
        ])
    }

    const deleteTask = (taskId: number) => {
        setTasks(tasks => tasks.filter(tasks => tasks.id !== taskId))
    }

    const updateTask = (id: number, content: string) => {
        setTasks(tasks.map(task => {
            if(task.id !== id) return task
            return {...task, content}
        }))
    }

    return (
        <div className={"m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden px-[40px]"}>
            <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd} onDragOver={onDragOver}>
                <div className={"m-auto flex gap-4"}>
                    <div className={"flex gap-4"}>
                        <SortableContext items={columnsIds}>
                            {columns.map(column =>
                                <Column
                                    key={column.id}
                                    column={column}
                                    deleteColumn={deleteColumn}
                                    updateColumn={updateColumn}
                                    createTask={createTask}
                                    deleteTask={deleteTask}
                                    updateTask={updateTask}
                                    tasks={tasks.filter(task => task.columnId === column.id)}
                                />
                            )}
                        </SortableContext>
                    </div>
                    <button
                        onClick={createNewColumn}
                        className={"h-[60px] w-[350px] min-w-[350px] cursor-pointer rounded-lg bg-mainBackgroundColor border-2 border-columnBackgroundColor p-4 ring-rose-500 hover:ring-2 flex gap-2"}
                    >
                        <PlusIcon/>
                        Add Column
                    </button>
                </div>

                {createPortal(
                    <DragOverlay>
                        {activeColumn && (
                            <Column
                                column={activeColumn}
                                deleteColumn={deleteColumn}
                                updateColumn={updateColumn}
                                createTask={createTask}
                                deleteTask={deleteTask}
                                updateTask={updateTask}
                                tasks={tasks.filter(task => task.columnId === activeColumn.id)}
                            />
                        )}
                        {
                            activeTask && (
                                <TaskCard task={activeTask} deleteTask={deleteTask} updateTask={updateTask}/>
                            )
                        }
                    </DragOverlay>,
                    document.body
                )}

            </DndContext>
        </div>
    );
};

export default KanbanBoard;
