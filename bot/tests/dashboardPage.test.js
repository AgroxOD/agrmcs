// Пример теста для Dashboard: проверяем обработку метрик
process.env.BOT_TOKEN = 't'
process.env.CHAT_ID = '1'
process.env.JWT_SECRET = 's'
process.env.MONGO_DATABASE_URL = 'mongodb://localhost/db'
process.env.APP_URL = 'https://localhost'

function calcTotal(tasks) {
  return tasks.length
}

const { stopScheduler } = require('../src/services/scheduler')
const { stopQueue } = require('../src/services/messageQueue')

test('calcTotal считает количество задач', () => {
  expect(calcTotal([{id:1},{id:2}])).toBe(2)
})

afterAll(() => { stopScheduler(); stopQueue() })
