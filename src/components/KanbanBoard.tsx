import {useMemo, useState} from "react";
import PlusIcon from "../icons/PlusIcon.tsx";
import {IColumn} from "../types.ts";
import Column from "./Column.tsx";
import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    PointerSensor,
    useSensor,
    useSensors
} from "@dnd-kit/core";
import {arrayMove, SortableContext} from "@dnd-kit/sortable";
import {createPortal} from "react-dom";

const KanbanBoard = () => {
    const [columns, setColumns] = useState<IColumn[]>([])
    const [activeColumn, setActiveColumn] = useState<IColumn | null>(null)

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
    }

    const onDragEnd = (event: DragEndEvent) => {
        const {active, over} = event

        if(!over || active.id === over.id) return

        setColumns(columns => {
            const activeColIdx = columns.findIndex(col => col.id === active.id)

            const overColIdx = columns.findIndex(col => col.id === over.id)

            return arrayMove(columns, activeColIdx, overColIdx)
        })
    }

    return (
        <div className={"m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden px-[40px]"}>
            <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}>
                <div className={"m-auto flex gap-4"}>
                    <div className={"flex gap-4"}>
                        <SortableContext items={columnsIds}>
                            {columns.map(column =>
                                <Column
                                    key={column.id}
                                    column={column}
                                    deleteColumn={deleteColumn}
                                    updateColumn={updateColumn}
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
                            />
                        )}
                    </DragOverlay>,
                    document.body
                )}

            </DndContext>
        </div>
    );
};

export default KanbanBoard;
