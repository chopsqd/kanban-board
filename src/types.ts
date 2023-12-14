export interface IColumn {
    id: number
    title: string
}

export interface ITask {
    id: number
    columnId: number
    content: string
}
