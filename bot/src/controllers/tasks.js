// Контроллеры задач: CRUD, тайм-трекер, отчёты
const { validationResult } = require('express-validator')
const service = require('../services/tasks')

function handle(req, res, next) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
  return next()
}

exports.list = async (req, res) => {
  const user = await require('../db/queries').getUser(req.user.id)
  const { page, limit, ...filters } = req.query
  const tasks = await service.get(
    { ...filters, departmentId: user?.departmentId },
    page ? Number(page) : undefined,
    limit ? Number(limit) : undefined
  )
  res.json(tasks)
}

exports.detail = async (req, res) => {
  const task = await service.getById(req.params.id)
  if (!task) return res.sendStatus(404)
  res.json(task)
}

exports.create = [handle, async (req, res) => {
  const task = await service.create(req.body)
  res.status(201).json(task)
}]

exports.update = [handle, async (req, res) => {
  const task = await service.update(req.params.id, req.body)
  if (!task) return res.sendStatus(404)
  res.json(task)
}]

exports.addTime = [handle, async (req, res) => {
  const task = await service.addTime(req.params.id, req.body.minutes)
  if (!task) return res.sendStatus(404)
  res.json(task)
}]

exports.bulk = [handle, async (req, res) => {
  await service.bulk(req.body.ids, { status: req.body.status })
  res.json({ status: 'ok' })
}]

exports.mentioned = async (req, res) => {
  const tasks = await service.mentioned(req.user.id)
  res.json(tasks)
}

exports.summary = async (req, res) => {
  res.json(await service.summary(req.query))
}

exports.remove = async (req, res) => {
  const task = await service.remove(req.params.id)
  if (!task) return res.sendStatus(404)
  res.sendStatus(204)
}
