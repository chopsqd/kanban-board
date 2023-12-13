import {IColumn} from "../types.ts";
import TrashIcon from "../icons/TrashIcon.tsx";
import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";

interface IColumnProps {
    column: IColumn
    deleteColumn: (id: number) => void
}

const Column = ({column, deleteColumn}: IColumnProps) => {

    const {setNodeRef, isDragging, attributes, listeners, transform, transition} = useSortable({
        id: column.id,
        data: {
            type: "column",
            column
        }
    })

    const style = {
        transition,
        transform: CSS.Transform.toString(transform)
    }

    if(isDragging) {
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
                className={"bg-mainBackgroundColor text-md h-[60px] cursor-grab rounded-md rounded-b-none p-3 font-bold border-columnBackgroundColor border-4 flex items-center justify-between"}
            >
                <div className={"flex gap-2"}>
                    <div
                        className={"flex justify-center items-center bg-columnBackgroundColor px-2 py-1 text-sm rounded-full"}
                    >
                        0
                    </div>
                    {column.title}
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

            <div className={"flex flex-grow"}>
                Content
            </div>
        </div>
    );
};

export default Column;
