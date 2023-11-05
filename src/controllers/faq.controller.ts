import { Request, Response } from 'express'
import FaqModel from 'src/models/faq.model'

function validatePayload(payload: Record<string, string>): boolean {
  if (typeof payload !== 'object' || Array.isArray(payload)) {
    return false
  }

  const requiredKeys = ['creator', 'question', 'answer']
  for (const key of requiredKeys) {
    if (
      !(key in payload) ||
      typeof payload[key] !== 'string' ||
      payload[key].trim() === ''
    ) {
      return false
    }
  }

  return true
}

async function handleGetFaqs(req: Request, res: Response): Promise<void> {
  const faqs = await FaqModel.find()
  res.json(faqs)
}

async function handleGetFaqById(req: Request, res: Response): Promise<void> {
  const { id } = req.params
  const faq = await FaqModel.findById(id)
  if (!faq) {
    res.status(404).json({ message: 'Faq not found' })
    return
  }

  res.json(faq)
}

async function handleCreateFaq(req: Request, res: Response): Promise<void> {
  const { question, answer, creator } = req.body

  if (!validatePayload(req.body)) {
    res.status(400).send('Invalid payload')
    return
  }

  const faq = await FaqModel.create({ question, answer, creator })
  res.json(faq)
}

async function handleUpdateFaq(req: Request, res: Response): Promise<void> {
  const { id } = req.params
  const { question, answer } = req.body

  const updatedFaq = await FaqModel.findByIdAndUpdate(
    id,
    { question, answer },
    { new: true }
  )
  if (!updatedFaq) {
    res.status(404).json({ message: 'Faq not found' })
    return
  }

  res.json(updatedFaq)
}

async function handleDeleteFaq(req: Request, res: Response): Promise<void> {
  const { id } = req.params

  const deletedFaq = await FaqModel.findByIdAndDelete(id)
  if (!deletedFaq) {
    res.status(404).json({ message: 'Faq not found' })
    return
  }

  res.json(deletedFaq)
}

const FaqController = {
  getAllFaqs: handleGetFaqs,
  getFaqById: handleGetFaqById,
  createFaq: handleCreateFaq,
  updateFaq: handleUpdateFaq,
  deleteFaq: handleDeleteFaq,
}

export default FaqController
