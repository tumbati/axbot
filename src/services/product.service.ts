import WhatsappDispatcher from 'src/channels/whatsapp/whatsapp.dispatcher'
import Hierarchy from 'src/channels/whatsapp/whatsapp.hierarchy'
import WhatsAppTemplate from 'src/channels/whatsapp/whatsapp.template'
import api from 'src/config/api'
import http from 'src/config/http'
import { IHttpGetResponse } from 'src/interfaces'
import { IProduct } from 'src/interfaces/product.interface'
import HierarchyModel from 'src/models/hierarchy.model'
import ProductModel from 'src/models/product.model'
import SessionModel from 'src/models/session.model'
import { createWhatsappTextTemplate, isDigit } from 'src/utils/util'
import HierarchyService from './hierarchy.service'
import PaginationService from './pagination.service'

function sendSMS(account: string, body: string) {
  WhatsappDispatcher.send(account, {
    type: 'text',
    text: { body },
  })
}

async function cacheProducts(account: string, products: IProduct[]): Promise<IProduct[]> {
  try {
    await clearCache(account)

    const result = await ProductModel.insertMany(
      products.map((item, i) => ({ ...item, account, cacheId: i + 1 }))
    )
    return result
  } catch (error) {
    console.log(error)
    return []
  }
}

async function clearCache(account: string) {
  await ProductModel.deleteMany({ account })
}

export async function runSearch(account: string, query: string) {
  try {
    fetchAndRenderProducts(account, query)
  } catch (e: any) {
    console.log(e)
    console.log(e.response.data.message)
  }
}

async function viewProduct(account: string, product: IProduct) {
  try {
    const response = await WhatsappDispatcher.send(
      account,
      WhatsAppTemplate.productCardTemplate(product)
    )
  } catch (e) {
    console.log(e)
  }
}

async function search(account: string, value: string): Promise<void> {
  try {
    const search = Hierarchy.structure.find((item) => item.name === 'search')

    if (!search) {
      return
    }

    const session = await SessionModel.findOne({ account })
    const hierarchy = await HierarchyModel.findOne({ account })

    if (hierarchy?.level === 'menu') {
      await HierarchyService.updateHierarchyLevel(account, 'search')

      if (session) {
        await SessionModel.deleteOne({ account })
      }

      await SessionModel.create({
        account,
        process: 'search',
        dialog: [search.prompts?.first],
      })
      WhatsappDispatcher.send(account, {
        type: 'text',
        text: { body: search.prompts?.first || '' },
      })
      return
    }

    const cache = await ProductModel.find<IProduct>({ account })

    if (isDigit(value) && cache.length) {
      const product = cache.at(parseInt(value) - 1)
      if (!product) {
        sendSMS(account, `Error!\n\nThe number you entered is out of range.`)
        return
      }

      sendSMS(account, `Loading, please wait...`)
      viewProduct(account, product)
      // sendSMS(account, `You have selected ${product.title}`)
      return
    }

    if (session?.dialog.length && session.process === 'search') {
      runSearch(account, value)
    }
  } catch (error) {
    console.log(error)
  }
}

async function fetchAndRenderProducts(
  account: string,
  query: string,
  url?: string | null
) {
  try {
    const defaultUrl = `${api.products}/?view=SEARCH&value=${query}`
    const response = await http.get<IHttpGetResponse<IProduct>>(url || defaultUrl)

    const results = response.data.products

    if (!response.data.total) {
      sendSMS(account, `Not found!\n\nWe could not find results for ${query}`)
      return
    }

    cacheProducts(account, results)

    const menu = createWhatsappTextTemplate(response.data.products, {
      next: response.data.next,
      previous: response.data.previous,
      count: response.data.total,
    })

    await PaginationService.create({
      account,
      component: 'search_results',
      next: response.data.next,
      previous: response.data.previous,
      count: response.data.total,
      perPage: response.data.limit,
      pageNumber: response.data.skip,
    })

    await HierarchyModel.updateOne({ account }, { $set: { level: 'search' } })

    const pagination = WhatsAppTemplate.paginationTemplate({
      header: `Products found (${response.data.products.length}) - page ${
        response.data.skip
      }/${Math.ceil(response.data.total / 10)}`,
      body: menu,
      previous: response.data.previous,
      next: response.data.next,
    })

    WhatsappDispatcher.send(account, pagination)
  } catch (error) {
    console.log(error)
  }
}

async function trackOrder(account: string, value: string) {
  try {
    const hierarchy = await HierarchyModel.findOne({ account })

    if (!hierarchy) {
      return
    }

    if (hierarchy.level === 'menu') {
      await HierarchyModel.updateOne({ account }, { $set: { level: 'track_order' } })
      return WhatsappDispatcher.sendText(account, 'Enter your order number')
    }

    if (hierarchy.level !== 'track_order') {
      return
    }

    // const response = await http.get(api.orders(account))

    // console.log(response.data.data)
    // await HierarchyModel.updateOne({account}, {$set: {level: 'menu'}})
    WhatsappDispatcher.sendText(
      account,
      `Your order ${value} is at example message.\n\nEnter another order number to see the details or send "menu" to go to main menu.`
    )
  } catch (error: any) {
    if (error.response.status === 404) {
      WhatsappDispatcher.sendText(account, `Error!\n\nOrder with ${value} number was not found, make sure you enter the correct order number.`)
    }
  }
}

async function paginateForward(account: string, value: string) {
  try {
    const hierarchy = await HierarchyModel.findOne({ account })

    if (hierarchy?.level === 'search') {
      const pagination = await PaginationService.find(account, 'search_results')

      if (!pagination?.next) {
        return WhatsappDispatcher.sendText(account, 'Error!\n\nThere is no more pages.')
      }

      fetchAndRenderProducts(account, '', pagination.next)
    }
  } catch (error) {
    console.log(error)
  }
}

async function paginateBackwards(account: string, value: string) {
  try {
    const hierarchy = await HierarchyModel.findOne({ account })

    if (hierarchy?.level === 'search') {
      const pagination = await PaginationService.find(account, 'search_results')

      if (!pagination?.previous) {
        return WhatsappDispatcher.sendText(account, 'Error!\n\nThere is no more pages.')
      }

      fetchAndRenderProducts(account, '', pagination.previous)
    }
  } catch (error) {
    console.log(error)
  }
}

const ProductService = {
  search,
  trackOrder,
  paginateForward,
  paginateBackwards,
}

export default ProductService
