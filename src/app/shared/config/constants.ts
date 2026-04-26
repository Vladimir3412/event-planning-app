import type { Event } from './types'

export const EVENTS: Event[] = [
    {
        id: 1,
        title: 'День рождения Ани',
        date: '2026-05-10',
        description: 'Кафе «Сова»',
        status: 'В процессе',
        participants: ['Иван', 'Аня', 'Дима', 'Оля'],
        tasks: [
            { id: 1, text: 'Забронировать столик', assignee: 'Иван', dueDate: '1 мая', done: true },
            { id: 2, text: 'Купить торт', assignee: 'Аня', dueDate: '9 мая', done: false },
            { id: 3, text: 'Собрать деньги на подарок', assignee: 'Дима', dueDate: '8 мая', done: false }
        ],
        polls: [
            {
                id: 1,
                question: 'Что подарим?',
                options: [
                    { id: 1, label: 'Сертификат SPA', votes: 3 },
                    { id: 2, label: 'Книга + кофе', votes: 1 }
                ]
            }
        ],
        expenses: [
            { id: 1, name: 'Бронь столика', paidBy: 'Иван', amount: 3000 },
            { id: 2, name: 'Торт', paidBy: 'Аня', amount: 2500 }
        ]
    },
    {
        id: 2,
        title: 'Поездка на природу',
        date: '2026-06-01',
        description: 'Лесное озеро',
        status: 'Планируется',
        participants: ['Саша', 'Дима'],
        tasks: [
            { id: 1, text: 'Купить продукты', assignee: 'Саша', dueDate: '31 мая', done: false },
            { id: 2, text: 'Арендовать машину', assignee: 'Дима', dueDate: '30 мая', done: false }
        ],
        polls: [
            {
                id: 1,
                question: 'Во сколько выезжаем?',
                options: [
                    { id: 1, label: '8:00', votes: 2 },
                    { id: 2, label: '10:00', votes: 1 }
                ]
            }
        ],
        expenses: [{ id: 1, name: 'Аренда авто', paidBy: 'Дима', amount: 5000 }]
    },
    {
        id: 3,
        title: 'Корпоратив',
        date: '2026-04-20',
        description: 'Офис',
        status: 'Завершено',
        participants: ['Оля', 'Иван', 'Катя'],
        tasks: [
            { id: 1, text: 'Заказать пиццу', assignee: 'Катя', dueDate: '20 апр', done: true },
            { id: 2, text: 'Подготовить презентацию', assignee: 'Иван', dueDate: '20 апр', done: true }
        ],
        polls: [],
        expenses: [
            { id: 1, name: 'Пицца', paidBy: 'Катя', amount: 4000 },
            { id: 2, name: 'Напитки', paidBy: 'Оля', amount: 1500 }
        ]
    }
]
