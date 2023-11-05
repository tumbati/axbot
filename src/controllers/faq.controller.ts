import { Request, Response } from 'express'
import FaqModel from 'src/models/faq.model'

function validatePayload(payload: Record<string, string>) {
  if (typeof payload !== 'object' || Array.isArray(payload)) return false

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

async function getAllFaqs(req: Request, res: Response) {
  try {
    const faqs = await FaqModel.find()
    res.json(faqs)
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' })
  }
}

async function getFaqById(req: Request, res: Response) {
  const { id } = req.params
  try {
    const faq = await FaqModel.findById(id)
    if (faq) {
      res.json(faq)
    } else {
      res.status(404).json({ message: 'Faq not found' })
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' })
  }
}

async function createFaq(req: Request, res: Response) {
  try {
    const { question, answer, creator } = req.body

    if (!validatePayload(req.body)) {
      return res.status(400).send('Invalid payload')
    }

    const faq = await FaqModel.create({ question, answer, creator })

    res.json(faq)
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' })
  }
}

async function updateFaq(req: Request, res: Response) {
  const { id } = req.params
  const { question, answer } = req.body
  try {
    const updatedFaq = await FaqModel.findByIdAndUpdate(
      id,
      { question, answer },
      { new: true }
    )
    if (updatedFaq) {
      res.json(updatedFaq)
    } else {
      res.status(404).json({ message: 'Faq not found' })
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' })
  }
}

async function deleteFaq(req: Request, res: Response) {
  const { id } = req.params
  try {
    const deletedFaq = await FaqModel.findByIdAndDelete(id)
    if (deletedFaq) {
      res.json(deletedFaq)
    } else {
      res.status(404).json({ message: 'Faq not found' })
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' })
  }
}

const FaqController = {
  getAllFaqs,
  getFaqById,
  createFaq,
  updateFaq,
  deleteFaq
}

export default FaqController
