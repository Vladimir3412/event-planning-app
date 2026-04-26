export interface Task {
    id: number
    text: string
    assignee: string
    dueDate: string
    done: boolean
}

export interface PollOption {
    id: number
    label: string
    votes: number
}

export interface Poll {
    id: number
    question: string
    options: PollOption[]
}

export interface Expense {
    id: number
    name: string
    paidBy: string
    amount: number
}

export interface Event {
    id: number
    title: string
    date: string
    description: string
    status: string
    participants: string[]
    tasks: Task[]
    polls: Poll[]
    expenses: Expense[]
}
