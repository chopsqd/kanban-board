import {IColumn} from "../types.ts";
import TrashIcon from "../icons/TrashIcon.tsx";

interface IColumnProps {
    column: IColumn
    deleteColumn: (id: number) => void
}

const Column = ({column, deleteColumn}: IColumnProps) => {
    return (
        <div className={"bg-columnBackgroundColor w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col"}>
            <div className={"bg-mainBackgroundColor text-md h-[60px] cursor-grab rounded-md rounded-b-none p-3 font-bold border-columnBackgroundColor border-4 flex items-center justify-between"}>
                <div className={"flex gap-2"}>
                    <div className={"flex justify-center items-center bg-columnBackgroundColor px-2 py-1 text-sm rounded-full"}>0</div>
                    {column.title}
                </div>

                <button
                    className={"stroke-gray-500 hover:stroke-white hover:bg-columnBackgroundColor rounded px-1 py-2"}
                    onClick={() => {
                        deleteColumn(column.id)
                    }}
                >
                    <TrashIcon />
                </button>
            </div>

            <div className={"flex flex-grow"}>
                Content
            </div>
        </div>
    );
};

export default Column;
