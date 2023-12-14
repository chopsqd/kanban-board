import {useMemo, useState} from "react";
import PlusIcon from "../icons/PlusIcon.tsx";
import {IColumn, ITask} from "../types.ts";
import Column from "./Column.tsx";
import {
    DndContext,
    DragEndEvent,
    DragOverEvent,
    DragOverlay,
    DragStartEvent,
    PointerSensor,
    useSensor,
    useSensors
} from "@dnd-kit/core";
import {SortableContext} from "@dnd-kit/sortable";
import {createPortal} from "react-dom";
import TaskCard from "./TaskCard.tsx";
import {useAppStore} from "../store.ts";

const KanbanBoard = () => {
    const {columns, createNewColumn, moveColumn, moveTask, moveTaskToColumn} = useAppStore()
    const [activeColumn, setActiveColumn] = useState<IColumn | null>(null)
    const [activeTask, setActiveTask] = useState<ITask | null>(null)
    const columnsIds: Array<number> = useMemo(() =>
        columns.map((column: IColumn) => column.id), [columns]
    )
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 3 }
        })
    )

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

        moveColumn(+active.id, +over.id)
    }

    const onDragOver = (event: DragOverEvent) => {
        const {active, over} = event

        if(!over || active.id === over.id) return

        const isActiveTask = active.data.current?.type === "task"
        const isOverTask = over.data.current?.type === "task"

        if(!isActiveTask) return

        if(isActiveTask && isOverTask) {
            moveTask(+active.id, +over.id)
        }

        const isOverColumn = over.data.current?.type === "column"

        if(isActiveTask && isOverColumn) {
            moveTaskToColumn(+active.id, +over.id)
        }
    }

    return (
        <div className={"m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden px-[40px]"}>
            <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd} onDragOver={onDragOver}>
                <div className={"m-auto flex gap-4"}>
                    <div className={"flex gap-4"}>
                        <SortableContext items={columnsIds}>
                            {columns.map(column =>
                                <Column key={column.id} column={column}/>
                            )}
                        </SortableContext>
                    </div>
                    <button
                        onClick={createNewColumn}
                        className={"h-[60px] w-[350px] min-w-[350px] cursor-pointer rounded-lg bg-mainBackgroundColor border-2 border-columnBackgroundColor p-4 ring-lime-500 hover:ring-2 flex gap-2"}
                    >
                        <PlusIcon/>
                        Add Column
                    </button>
                </div>

                {createPortal(
                    <DragOverlay>
                        {activeColumn && <Column column={activeColumn}/>}
                        {activeTask && <TaskCard task={activeTask}/>}
                    </DragOverlay>,
                    document.body
                )}

            </DndContext>
        </div>
    );
};

export default KanbanBoard;
