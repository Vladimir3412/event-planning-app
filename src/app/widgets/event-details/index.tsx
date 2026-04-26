'use client'
import { useState } from 'react'
import {
    Card,
    Text,
    Badge,
    Group,
    Tabs,
    Checkbox,
    Progress,
    Paper,
    TextInput,
    Button,
    Modal,
    ActionIcon,
    Select
} from '@mantine/core'
import { MapPin, Calendar, Users, Trash2 } from 'lucide-react'
import type { Event, Task, Poll, Expense } from '@/app/shared/config/types'

const STATUS_COLOR: Record<string, string> = {
    'В процессе': 'orange',
    Планируется: 'blue',
    Завершено: 'green'
}

interface Props {
    event: Event
    onUpdateTasks: (tasks: Task[]) => void
    onUpdatePolls: (polls: Poll[]) => void
    onUpdateExpenses: (expenses: Expense[]) => void
    onUpdateStatus: (status: string) => void
}

const STATUS_OPTIONS = [
    { value: 'Планируется', label: 'Планируется' },
    { value: 'В процессе', label: 'В процессе' },
    { value: 'Завершено', label: 'Завершено' }
]

export const EventDetail = ({ event, onUpdateTasks, onUpdatePolls, onUpdateExpenses, onUpdateStatus }: Props) => {
    const [voted, setVoted] = useState<Record<number, number>>({})

    // задачи
    const [newTaskText, setNewTaskText] = useState('')
    const [newTaskAssignee, setNewTaskAssignee] = useState('')

    const toggleTask = (id: number) => {
        const updated = event.tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
        onUpdateTasks(updated)
    }

    const addTask = () => {
        if (!newTaskText.trim()) return
        onUpdateTasks([
            ...event.tasks,
            {
                id: Date.now(),
                text: newTaskText.trim(),
                assignee: newTaskAssignee.trim() || 'Без исполнителя',
                dueDate: '',
                done: false
            }
        ])
        setNewTaskText('')
        setNewTaskAssignee('')
    }

    const deleteTask = (id: number) => onUpdateTasks(event.tasks.filter((t) => t.id !== id))

    // голосование
    const [pollModal, setPollModal] = useState(false)
    const [newPollQ, setNewPollQ] = useState('')
    const [newPollOpts, setNewPollOpts] = useState(['', ''])

    const vote = (pollId: number, optId: number) => {
        if (voted[pollId] === optId) return
        const prev = voted[pollId]
        setVoted((v) => ({ ...v, [pollId]: optId }))
        onUpdatePolls(
            event.polls.map((p) =>
                p.id !== pollId
                    ? p
                    : {
                          ...p,
                          options: p.options.map((o) => ({
                              ...o,
                              votes: o.id === optId ? o.votes + 1 : o.id === prev ? o.votes - 1 : o.votes
                          }))
                      }
            )
        )
    }

    const addPoll = () => {
        const opts = newPollOpts.filter((o) => o.trim())
        if (!newPollQ.trim() || opts.length < 2) return
        onUpdatePolls([
            ...event.polls,
            {
                id: Date.now(),
                question: newPollQ.trim(),
                options: opts.map((label, i) => ({ id: i + 1, label, votes: 0 }))
            }
        ])
        setNewPollQ('')
        setNewPollOpts(['', ''])
        setPollModal(false)
    }

    const deletePoll = (id: number) => onUpdatePolls(event.polls.filter((p) => p.id !== id))

    // расходы
    const [newExpName, setNewExpName] = useState('')
    const [newExpPaidBy, setNewExpPaidBy] = useState('')
    const [newExpAmount, setNewExpAmount] = useState('')

    const addExpense = () => {
        const amount = parseInt(newExpAmount)
        if (!newExpName.trim() || isNaN(amount)) return
        onUpdateExpenses([
            ...event.expenses,
            {
                id: Date.now(),
                name: newExpName.trim(),
                paidBy: newExpPaidBy.trim() || 'Неизвестно',
                amount
            }
        ])
        setNewExpName('')
        setNewExpPaidBy('')
        setNewExpAmount('')
    }

    const deleteExpense = (id: number) => onUpdateExpenses(event.expenses.filter((e) => e.id !== id))

    const total = event.expenses.reduce((s, e) => s + e.amount, 0)

    return (
        <Card withBorder padding="lg">
            <Group justify="space-between" mb={6}>
                <Text fw={500} size="lg">
                    {event.title}
                </Text>
                <Select
                    data={STATUS_OPTIONS}
                    value={event.status}
                    onChange={(v) => onUpdateStatus(v ?? event.status)}
                    size="xs"
                    w={130}
                    styles={{ input: { color: STATUS_OPTIONS.find((o) => o.value === event.status)?.label } }}
                />
            </Group>

            <Group gap={14} mb={12}>
                <Group gap={4}>
                    <Calendar size={13} />
                    <Text fz={13} c="dimmed">
                        {event.date}
                    </Text>
                </Group>
                <Group gap={4}>
                    <MapPin size={13} />
                    <Text fz={13} c="dimmed">
                        {event.description}
                    </Text>
                </Group>
                <Group gap={4}>
                    <Users size={13} />
                    <Text fz={13} c="dimmed">
                        {event.participants.length} участников
                    </Text>
                </Group>
            </Group>

            <Group gap={6} mb={16}>
                {event.participants.map((name) => (
                    <Paper key={name} px={12} py={2} radius="xl" withBorder>
                        <Text fz={12} c="dimmed">
                            {name}
                        </Text>
                    </Paper>
                ))}
            </Group>

            <div className="mb-4 border-t border-gray-200 dark:border-gray-700" />

            <Tabs defaultValue="tasks">
                <Tabs.List mb="md">
                    <Tabs.Tab value="tasks">Задачи ({event.tasks.length})</Tabs.Tab>
                    <Tabs.Tab value="votes">Голосование ({event.polls.length})</Tabs.Tab>
                    <Tabs.Tab value="expenses">Расходы ({event.expenses.length})</Tabs.Tab>
                </Tabs.List>

                {/* ЗАДАЧИ */}
                <Tabs.Panel value="tasks">
                    <div className="flex flex-col gap-2">
                        {event.tasks.map((task) => (
                            <Paper key={task.id} px={12} py={10} radius="md" withBorder>
                                <Group gap={10}>
                                    <Checkbox checked={task.done} onChange={() => toggleTask(task.id)} radius="sm" />
                                    <Text
                                        fz={13}
                                        flex={1}
                                        td={task.done ? 'line-through' : undefined}
                                        c={task.done ? 'dimmed' : undefined}
                                    >
                                        {task.text}
                                    </Text>
                                    <Text fz={12} c="dimmed">
                                        {task.assignee}
                                    </Text>
                                    {task.dueDate && (
                                        <Text fz={11} c="dimmed">
                                            {task.dueDate}
                                        </Text>
                                    )}
                                    <ActionIcon
                                        variant="subtle"
                                        color="red"
                                        size="sm"
                                        onClick={() => deleteTask(task.id)}
                                    >
                                        <Trash2 size={13} />
                                    </ActionIcon>
                                </Group>
                            </Paper>
                        ))}
                        <Paper px={12} py={10} radius="md" withBorder mt={4}>
                            <div className="flex flex-col gap-2">
                                <TextInput
                                    placeholder="Название задачи"
                                    value={newTaskText}
                                    onChange={(e) => setNewTaskText(e.target.value)}
                                    size="sm"
                                    onKeyDown={(e) => e.key === 'Enter' && addTask()}
                                />
                                <Group gap={8}>
                                    <Select
                                        placeholder="Исполнитель"
                                        value={newTaskAssignee}
                                        onChange={(v) => setNewTaskAssignee(v ?? '')}
                                        data={
                                            event.participants.length > 0
                                                ? event.participants.map((p) => ({ value: p, label: p }))
                                                : [{ value: 'Без исполнителя', label: 'Без исполнителя' }]
                                        }
                                        size="sm"
                                        flex={1}
                                        clearable
                                    />
                                    <Button size="sm" onClick={addTask} disabled={!newTaskText.trim()}>
                                        Добавить
                                    </Button>
                                </Group>
                            </div>
                        </Paper>
                    </div>
                </Tabs.Panel>

                {/* ГОЛОСОВАНИЕ */}
                <Tabs.Panel value="votes">
                    <div className="flex flex-col gap-3">
                        {event.polls.length === 0 && (
                            <Text fz={13} c="dimmed">
                                Голосований пока нет
                            </Text>
                        )}
                        {event.polls.map((poll) => {
                            const pollTotal = poll.options.reduce((s, o) => s + o.votes, 0)
                            return (
                                <Paper key={poll.id} px={12} py={12} radius="md" withBorder>
                                    <Group justify="space-between" mb={8}>
                                        <Text fz={13} fw={500}>
                                            {poll.question}
                                        </Text>
                                        <ActionIcon
                                            variant="subtle"
                                            color="red"
                                            size="sm"
                                            onClick={() => deletePoll(poll.id)}
                                        >
                                            <Trash2 size={13} />
                                        </ActionIcon>
                                    </Group>
                                    {poll.options.map((opt) => (
                                        <div
                                            key={opt.id}
                                            className="mb-2 flex cursor-pointer items-center gap-2"
                                            onClick={() => vote(poll.id, opt.id)}
                                        >
                                            <Text
                                                fz={12}
                                                w={110}
                                                c={voted[poll.id] === opt.id ? 'blue' : 'dimmed'}
                                                fw={voted[poll.id] === opt.id ? 500 : 400}
                                            >
                                                {opt.label}
                                            </Text>
                                            <Progress
                                                flex={1}
                                                size="md"
                                                value={pollTotal ? (opt.votes / pollTotal) * 100 : 0}
                                                color={voted[poll.id] === opt.id ? 'blue' : 'gray'}
                                            />
                                            <Text fz={12} c="dimmed" w={20} ta="right">
                                                {opt.votes}
                                            </Text>
                                        </div>
                                    ))}
                                </Paper>
                            )
                        })}
                        <Button variant="default" size="sm" onClick={() => setPollModal(true)}>
                            + Создать голосование
                        </Button>
                    </div>

                    <Modal opened={pollModal} onClose={() => setPollModal(false)} title="Новое голосование" size="sm">
                        <div className="flex flex-col gap-3">
                            <TextInput
                                label="Вопрос"
                                placeholder="Что решаем?"
                                value={newPollQ}
                                onChange={(e) => setNewPollQ(e.target.value)}
                            />
                            {newPollOpts.map((opt, i) => (
                                <TextInput
                                    key={i}
                                    label={`Вариант ${i + 1}`}
                                    value={opt}
                                    onChange={(e) =>
                                        setNewPollOpts((prev) => prev.map((o, j) => (j === i ? e.target.value : o)))
                                    }
                                />
                            ))}
                            <Button variant="default" size="sm" onClick={() => setNewPollOpts((p) => [...p, ''])}>
                                + Ещё вариант
                            </Button>
                            <Button
                                onClick={addPoll}
                                disabled={!newPollQ.trim() || newPollOpts.filter(Boolean).length < 2}
                            >
                                Создать
                            </Button>
                        </div>
                    </Modal>
                </Tabs.Panel>

                {/* РАСХОДЫ */}
                <Tabs.Panel value="expenses">
                    <div className="flex flex-col gap-2">
                        {event.expenses.map((exp) => (
                            <Paper key={exp.id} px={12} py={10} radius="md" withBorder>
                                <Group justify="space-between">
                                    <div>
                                        <Text fz={13}>{exp.name}</Text>
                                        <Text fz={12} c="dimmed">
                                            Заплатил {exp.paidBy}
                                        </Text>
                                    </div>
                                    <Group gap={8}>
                                        <Text fz={14} fw={500}>
                                            {exp.amount.toLocaleString('ru-RU')} ₽
                                        </Text>
                                        <ActionIcon
                                            variant="subtle"
                                            color="red"
                                            size="sm"
                                            onClick={() => deleteExpense(exp.id)}
                                        >
                                            <Trash2 size={13} />
                                        </ActionIcon>
                                    </Group>
                                </Group>
                            </Paper>
                        ))}

                        {event.expenses.length > 0 && (
                            <Paper
                                px={12}
                                py={10}
                                radius="md"
                                style={{ background: 'var(--mantine-color-blue-light)' }}
                            >
                                <Group justify="space-between">
                                    <Text fz={13} c="blue">
                                        Итого
                                    </Text>
                                    <Text fz={13} fw={500} c="blue">
                                        {total.toLocaleString('ru-RU')} ₽
                                    </Text>
                                </Group>
                                <Group justify="space-between">
                                    <Text fz={13} c="blue">
                                        На человека
                                    </Text>
                                    <Text fz={13} fw={500} c="blue">
                                        {Math.round(total / event.participants.length).toLocaleString('ru-RU')} ₽
                                    </Text>
                                </Group>
                            </Paper>
                        )}

                        <Paper px={12} py={10} radius="md" withBorder mt={4}>
                            <div className="flex flex-col gap-2">
                                <Group gap={8}>
                                    <TextInput
                                        placeholder="Название"
                                        value={newExpName}
                                        onChange={(e) => setNewExpName(e.target.value)}
                                        size="sm"
                                        flex={1}
                                    />
                                    <TextInput
                                        placeholder="Кто платит"
                                        value={newExpPaidBy}
                                        onChange={(e) => setNewExpPaidBy(e.target.value)}
                                        size="sm"
                                        flex={1}
                                    />
                                </Group>
                                <Group gap={8}>
                                    <TextInput
                                        placeholder="Сумма ₽"
                                        value={newExpAmount}
                                        onChange={(e) => setNewExpAmount(e.target.value)}
                                        size="sm"
                                        flex={1}
                                        type="number"
                                    />
                                    <Button
                                        size="sm"
                                        onClick={addExpense}
                                        disabled={!newExpName.trim() || !newExpAmount}
                                    >
                                        Добавить
                                    </Button>
                                </Group>
                            </div>
                        </Paper>
                    </div>
                </Tabs.Panel>
            </Tabs>
        </Card>
    )
}
