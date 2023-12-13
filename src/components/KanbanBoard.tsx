import {useState} from "react";
import PlusIcon from "../icons/PlusIcon.tsx";
import {IColumn} from "../types.ts";
import Column from "./Column.tsx";

const KanbanBoard = () => {
    const [columns, setColumns] = useState<IColumn[]>([])

    const createNewColumn = () => {
        setColumns([
            ...columns,
            {id: Date.now(), title: `Column ${columns.length + 1}`}
        ])
    }

    const deleteColumn = (id: number) => {
        setColumns(prevColumns => prevColumns.filter(column => column.id !== id))
    }

    return (
        <div className={"m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden px-[40px]"}>
            <div className={"m-auto flex gap-4"}>
                <div className={"flex gap-4"}>
                    {columns.map(column =>
                        <Column
                            key={column.id}
                            column={column}
                            deleteColumn={deleteColumn}
                        />
                    )}
                </div>
                <button
                    onClick={createNewColumn}
                    className={"h-[60px] w-[350px] min-w-[350px] cursor-pointer rounded-lg bg-mainBackgroundColor border-2 border-columnBackgroundColor p-4 ring-rose-500 hover:ring-2 flex gap-2"}
                >
                    <PlusIcon/>
                    Add Column
                </button>
            </div>
        </div>
    );
};

export default KanbanBoard;
