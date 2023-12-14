import { create } from 'zustand'
import {IColumn, ITask} from "./types.ts";
import {arrayMove} from "@dnd-kit/sortable";

interface AppState {
    columns: Array<IColumn>
    tasks: Array<ITask>

    createNewColumn: () => void
    updateColumn: (id: number, title: string) => void
    deleteColumn: (id: number) => void
    moveColumn: (activeId: number, overId: number) => void

    createTask: (columnId: number) => void
    updateTask: (id: number, content: string) => void
    deleteTask: (id: number) => void
    moveTask: (activeId: number, overId: number) => void
    moveTaskToColumn: (activeId: number, overId: number) => void
    getFilteredTasks: (columnId: number) => Array<ITask>
}

export const useAppStore  = create<AppState>()((set, get) => ({
    columns: [],
    tasks: [],

    createNewColumn: () => set(state => ({
        columns: [
            ...state.columns,
            {id: Date.now(), title: "New column"}
        ]
    })),
    updateColumn: (id: number, title: string) => set(state => ({
        columns: state.columns.map(column => {
            if(column.id !== id ) return column
            return {...column, title}
        })
    })),
    deleteColumn: (id: number) => set(state => ({
        columns: state.columns.filter(column => column.id !== id)
    })),
    moveColumn: (activeId: number, overId: number) => set(state => ({
        columns: arrayMove(
            state.columns,
            state.columns.findIndex(col => col.id === activeId),
            state.columns.findIndex(col => col.id === overId)
        )
    })),

    createTask: (columnId: number) => set(state => ({
        tasks: [
            ...state.tasks,
            {id: Date.now(), columnId, content: "New task"}
        ]
    })),
    updateTask: (id: number, content: string) => set(state => ({
        tasks: state.tasks.map(task => {
            if(task.id !== id) return task
            return {...task, content}
        })
    })),
    deleteTask: (id: number) => set(state => ({
        tasks: state.tasks.filter(tasks => tasks.id !== id)
    })),
    moveTask: (activeId: number, overId: number) => set(state => {
        const activeTaskIdx = state.tasks.findIndex(tasks => tasks.id === activeId)
        const overTaskIdx = state.tasks.findIndex(tasks => tasks.id === overId)

        state.tasks[activeTaskIdx].columnId = state.tasks[overTaskIdx].columnId

        return {
            tasks: arrayMove(state.tasks, activeTaskIdx, overTaskIdx)
        }
    }),
    moveTaskToColumn: (activeId: number, overId: number) => set(state => {
        const activeTaskIdx = state.tasks.findIndex(tasks => tasks.id === activeId)

        state.tasks[activeTaskIdx].columnId = overId

        return {
            tasks: arrayMove(state.tasks, activeTaskIdx, activeTaskIdx)
        }
    }),
    getFilteredTasks: (columnId: number) => {
        return get().tasks.filter(task => task.columnId === columnId)
    }
}))
