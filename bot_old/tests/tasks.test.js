// Интеграционные тесты маршрутов /api/tasks с моками модели
process.env.NODE_ENV='test'
process.env.BOT_TOKEN='t'
process.env.CHAT_ID='1'
process.env.JWT_SECRET='s'
process.env.MONGO_DATABASE_URL='mongodb://localhost/db'
const request = require('supertest')
const express = require('express')
const { stopScheduler } = require('../src/services/scheduler')

jest.mock('../src/db/model', () => ({
  Task: {
    create: jest.fn(async d => ({ _id:'1', ...d, status:'new', time_spent:0 })),
    findByIdAndUpdate: jest.fn(async (_id,d)=>({ _id, ...d })),
    findById: jest.fn(async () => ({ time_spent:0, save: jest.fn() })),
    findByIdAndDelete: jest.fn(async ()=>({ _id:'1' })),
    updateMany: jest.fn(async ()=>null),
    aggregate: jest.fn(async ()=>[{ count:2, time:30 }]),
    find: jest.fn(async ()=>[])
  }
}))

jest.mock('../src/api/middleware', () => ({ verifyToken: (_req,_res,next)=>next(), asyncHandler: fn=>fn, errorHandler: (err,_req,res,_next)=>res.status(500).json({error:err.message}), checkRole: () => (_req,_res,next)=>next() }))

const router = require('../src/routes/tasks')
const { Task } = require('../src/db/model')

let app
beforeAll(() => {
  app = express()
  app.use(express.json())
  app.use('/api/tasks', router)
})

test('создание задачи возвращает 201', async () => {
  const res = await request(app).post('/api/tasks').send({
    title: 'T',
    start_location_link: 'https://maps.google.com',
    end_location_link: 'https://maps.google.com'
  })
  expect(res.status).toBe(201)
  expect(res.body.title).toBe('T')
})

const id = '507f191e810c19729de860ea'

test('обновление задачи', async () => {
  const res = await request(app).patch(`/api/tasks/${id}`).send({ status:'done' })
  expect(res.body.status).toBe('done')
})

test('добавление времени', async () => {
  await request(app).patch(`/api/tasks/${id}/time`).send({ minutes:15 })
  expect(Task.findById).toHaveBeenCalled()
})

test('bulk update статуса', async () => {
  await request(app).post('/api/tasks/bulk').send({ ids:[id,id], status:'done' })
  expect(Task.updateMany).toHaveBeenCalled()
})

test('summary report возвращает метрики', async () => {
  const res = await request(app).get('/api/tasks/report/summary')
  expect(res.body.count).toBe(2)
  expect(res.body.time).toBe(30)
})

test('summary report c фильтром дат', async () => {
  const res = await request(app).get('/api/tasks/report/summary?from=2024-01-01&to=2024-12-31')
  expect(res.body.count).toBe(2)
  expect(res.body.time).toBe(30)
})

test('удаление задачи', async () => {
  const res = await request(app).delete(`/api/tasks/${id}`)
  expect(res.status).toBe(204)
})

afterAll(() => stopScheduler())
