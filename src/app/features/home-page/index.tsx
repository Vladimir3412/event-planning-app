'use client'
import { useState } from 'react'
import { Button, Modal, TextInput, Select, Group, Text, ActionIcon, Paper } from '@mantine/core'
import { Plus, X } from 'lucide-react'
import { DefaultLayout } from '@/app/widgets/layout'
import { CardEvent } from '@/app/widgets/card-event'
import { EventDetail } from '@/app/widgets/event-details'
import { EVENTS } from '@/app/shared/config/constants'
import type { Event, Task, Poll, Expense } from '@/app/shared/config/types'

const STATUS_OPTIONS = [
    { value: 'Планируется', label: 'Планируется' },
    { value: 'В процессе', label: 'В процессе' },
    { value: 'Завершено', label: 'Завершено' }
]

const HomePageManage = () => {
    const [events, setEvents] = useState<Event[]>(EVENTS)
    const [selectedEventId, setSelectedEventId] = useState<number | null>(null)
    const selectedEvent = events.find((e) => e.id === selectedEventId) ?? null

    const [modal, setModal] = useState(false)
    const [title, setTitle] = useState('')
    const [date, setDate] = useState<string>('')
    const [description, setDescription] = useState('')
    const [status, setStatus] = useState<string>('Планируется')
    const [participants, setParticipants] = useState<string[]>([])
    const [newParticipant, setNewParticipant] = useState('')

    const resetForm = () => {
        setTitle('')
        setDate('')
        setDescription('')
        setStatus('Планируется')
        setParticipants([])
        setNewParticipant('')
    }

    const addParticipant = () => {
        const val = newParticipant.trim()
        if (!val || participants.includes(val)) return
        setParticipants((prev) => [...prev, val])
        setNewParticipant('')
    }

    const removeParticipant = (name: string) => setParticipants((prev) => prev.filter((p) => p !== name))

    const createEvent = () => {
        if (!title.trim()) return
        const newEvent: Event = {
            id: Date.now(),
            title: title.trim(),
            date: date ? new Date(date).toLocaleDateString('ru-RU') : '—',
            description: description.trim() || '—',
            status,
            participants,
            tasks: [],
            polls: [],
            expenses: []
        }
        setEvents((prev) => [newEvent, ...prev])
        setSelectedEventId(newEvent.id)
        resetForm()
        setModal(false)
    }

    const deleteEvent = (id: number) => {
        setEvents((prev) => prev.filter((e) => e.id !== id))
        if (selectedEventId === id) setSelectedEventId(null)
    }

    const updateEvent = (id: number, patch: Partial<Event>) =>
        setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)))

    return (
        <DefaultLayout>
            <Group justify="space-between" align="center">
                <h1 className="text-2xl font-semibold">Мои мероприятия</h1>
                <Button leftSection={<Plus size={16} />} onClick={() => setModal(true)}>
                    Создать
                </Button>
            </Group>

            <div className="mb-3 grid grid-cols-3 gap-3">
                {events.map((card) => (
                    <CardEvent
                        key={card.id}
                        title={card.title}
                        date={card.date}
                        description={card.description}
                        status={card.status}
                        participants={card.participants}
                        isSelected={selectedEventId === card.id}
                        onSelect={() => setSelectedEventId(card.id)}
                        onDelete={() => deleteEvent(card.id)}
                    />
                ))}
            </div>

            {selectedEvent && (
                <EventDetail
                    event={selectedEvent}
                    onUpdateTasks={(tasks: Task[]) => updateEvent(selectedEvent.id, { tasks })}
                    onUpdatePolls={(polls: Poll[]) => updateEvent(selectedEvent.id, { polls })}
                    onUpdateExpenses={(expenses: Expense[]) => updateEvent(selectedEvent.id, { expenses })}
                    onUpdateStatus={(status: string) => updateEvent(selectedEvent.id, { status })}
                />
            )}

            {/* МОДАЛКА СОЗДАНИЯ */}
            <Modal
                opened={modal}
                onClose={() => {
                    setModal(false)
                    resetForm()
                }}
                title="Новое мероприятие"
                size="md"
                keepMounted={false}
            >
                <div className="flex flex-col gap-3">
                    <TextInput
                        label="Название"
                        placeholder="День рождения, поездка..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                    <Group gap={8} grow>
                        <TextInput
                            label="Дата"
                            placeholder="Выбери дату"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            type="date"
                        />
                        <Select
                            label="Статус"
                            data={STATUS_OPTIONS}
                            value={status}
                            onChange={(v) => setStatus(v ?? 'Планируется')}
                        />
                    </Group>
                    <TextInput
                        label="Место"
                        placeholder="Кафе, адрес..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    {/* участники */}
                    <div>
                        <Text fz={14} fw={500} mb={6}>
                            Участники
                        </Text>
                        {participants.length > 0 && (
                            <Group gap={6} mb={8}>
                                {participants.map((p) => (
                                    <Paper key={p} px={10} py={2} radius="xl" withBorder>
                                        <Group gap={4}>
                                            <Text fz={12}>{p}</Text>
                                            <ActionIcon
                                                size={14}
                                                variant="transparent"
                                                color="gray"
                                                onClick={() => removeParticipant(p)}
                                            >
                                                <X size={11} />
                                            </ActionIcon>
                                        </Group>
                                    </Paper>
                                ))}
                            </Group>
                        )}
                        <Group gap={8}>
                            <TextInput
                                placeholder="Имя участника"
                                value={newParticipant}
                                onChange={(e) => setNewParticipant(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && addParticipant()}
                                flex={1}
                                size="sm"
                            />
                            <Button variant="default" size="sm" onClick={addParticipant}>
                                + Добавить
                            </Button>
                        </Group>
                    </div>

                    <Group justify="flex-end" mt={4}>
                        <Button
                            variant="default"
                            onClick={() => {
                                setModal(false)
                                resetForm()
                            }}
                        >
                            Отмена
                        </Button>
                        <Button onClick={createEvent} disabled={!title.trim()}>
                            Создать
                        </Button>
                    </Group>
                </div>
            </Modal>
        </DefaultLayout>
    )
}
export default HomePageManage
