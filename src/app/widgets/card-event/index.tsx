import { Badge, Card, Group, Text, ActionIcon, Paper } from '@mantine/core'
import { MapPin, Trash2 } from 'lucide-react'

interface CardEventProps {
    title: string
    date: string
    description: string
    status: string
    participants: string[]
    isSelected: boolean
    onSelect: () => void
    onDelete: () => void
}

const STATUS_COLOR: Record<string, string> = {
    'В процессе': 'orange',
    Планируется: 'blue',
    Завершено: 'green'
}

export const CardEvent = ({
    title,
    date,
    description,
    status,
    participants,
    isSelected,
    onSelect,
    onDelete
}: CardEventProps) => {
    return (
        <Card
            padding="lg"
            withBorder
            style={{ borderColor: isSelected ? 'var(--mantine-color-blue-filled)' : undefined, cursor: 'pointer' }}
            onClick={onSelect}
        >
            <Group justify="space-between" align="flex-start" mb={4}>
                <Text fw={500}>{title}</Text>
                <ActionIcon
                    variant="subtle"
                    color="red"
                    size="sm"
                    onClick={(e) => {
                        e.stopPropagation()
                        onDelete()
                    }}
                >
                    <Trash2 size={14} />
                </ActionIcon>
            </Group>

            <div className="mb-3 flex flex-row gap-2">
                <Text fz={14} c="dimmed">
                    {date}
                </Text>
                <div className="flex items-center gap-1">
                    <Text fz={14} c="dimmed">
                        {description}
                    </Text>
                    <MapPin size={14} className="text-gray-500" />
                </div>
            </div>

            {/* участники */}
            {participants.length > 0 && (
                <Group gap={4} mb={8}>
                    {participants.slice(0, 3).map((p) => (
                        <Paper key={p} px={8} py={1} radius="xl" withBorder>
                            <Text fz={11} c="dimmed">
                                {p}
                            </Text>
                        </Paper>
                    ))}
                    {participants.length > 3 && (
                        <Text fz={11} c="dimmed">
                            +{participants.length - 3}
                        </Text>
                    )}
                </Group>
            )}

            <Group justify="flex-end">
                <Badge color={STATUS_COLOR[status] ?? 'gray'} variant="light">
                    {status}
                </Badge>
            </Group>
        </Card>
    )
}
