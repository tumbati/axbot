import WhatsappCommands from 'src/channels/whatsapp/whatsapp.commands'
import WhatsappDispatcher from 'src/channels/whatsapp/whatsapp.dispatcher'
import Hierarchy from 'src/channels/whatsapp/whatsapp.hierarchy'
import WhatsAppTemplate from 'src/channels/whatsapp/whatsapp.template'
import api from 'src/config/api'
import http from 'src/config/http'
import { ICategory, IHttpGetResponse } from 'src/interfaces'
import { IProduct } from 'src/interfaces/product.interface'
import BrowseCategoryModel from 'src/models/browse-category.model'
import HierarchyModel from 'src/models/hierarchy.model'
import MessageContextModel from 'src/models/message-context.model'
import ProductModel from 'src/models/product.model'
import SessionModel from 'src/models/session.model'
import { categoryMenu, createWhatsappTextTemplate, isDigit } from 'src/utils/util'
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

    await MessageContextModel.deleteOne({
      account,
      command: WhatsappCommands.ADD_TO_CART,
      'product.product_id': product.product_id,
    })
    await MessageContextModel.create({
      account,
      waId: response?.messages.first?.id,
      command: WhatsappCommands.ADD_TO_CART,
      product,
    })
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

async function browseCategories(account: string, value: string) {
  try {
    if (!search) {
      return
    }

    const hierarchy = await HierarchyModel.findOne({ account })

    if (hierarchy?.level === 'menu') {
      fetchAndRenderCategories(account)
      return
    }

    if (!isDigit(value)) {
      return WhatsappDispatcher.sendText(account, `Error!!\n\nYou can only use numbers`)
    }

    const results = await BrowseCategoryModel.findOne({ account })
    const category = results?.categories.at(parseInt(value) - 1)

    if (!category) {
      return WhatsappDispatcher.sendText(
        account,
        `Error!\n\nOut of range, you can only choose from 1-${results?.categories.length}`
      )
    }

    const url = `${api.products}/?view=CATEGORY&value=${category.category_id}`
    fetchAndRenderProducts(account, '', url)
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

    const results = response.data.results

    if (!response.data.count) {
      sendSMS(account, `Not found!\n\nWe could not find results for ${query}`)
      return
    }

    cacheProducts(account, results)

    const menu = createWhatsappTextTemplate(response.data.results, {
      next: response.data.next,
      previous: response.data.previous,
      count: response.data.count,
    })

    await PaginationService.create({
      account,
      component: 'search_results',
      next: response.data.next,
      previous: response.data.previous,
      count: response.data.count,
      perPage: response.data.per_page,
      pageNumber: response.data.page_number,
    })

    await HierarchyModel.updateOne({ account }, { $set: { level: 'search' } })

    const pagination = WhatsAppTemplate.paginationTemplate({
      header: `Products found (${response.data.results.length}) - page ${
        response.data.page_number
      }/${Math.ceil(response.data.count / 10)}`,
      body: menu,
      previous: response.data.previous,
      next: response.data.next,
    })

    WhatsappDispatcher.send(account, pagination)
  } catch (error) {
    console.log(error)
  }
}

async function fetchAndRenderCategories(account: string, url?: string | null) {
  await BrowseCategoryModel.deleteOne({ account })
  const response = await http.get<IHttpGetResponse<ICategory>>(url || api.categories)
  await BrowseCategoryModel.create({
    account,
    categories: response.data.results,
  })
  await PaginationService.create({
    component: 'categories',
    account,
    perPage: response.data.per_page,
    pageNumber: response.data.page_number,
    count: response.data.count,
    next: response.data.next,
    previous: response.data.previous,
  })
  await HierarchyModel.updateOne({ account }, { $set: { level: 'browse_categories' } })

  const menu = categoryMenu(response.data.results, {
    next: response.data.next,
    previous: response.data.previous,
    count: response.data.count,
  })

  WhatsappDispatcher.send(
    account,
    WhatsAppTemplate.paginationTemplate({
      header: `Categories - page ${response.data.page_number}/${Math.ceil(
        response.data.count / 10
      )}`,
      body: menu,
      previous: response.data.previous,
      next: response.data.next,
    })
  )
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

    const response = await http.get(api.orders(account))

    console.log(response.data.data)
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

    if (hierarchy?.level === 'browse_categories') {
      const pagination = await PaginationService.find(account, 'categories')

      if (!pagination) {
        return
      }

      fetchAndRenderCategories(account, pagination.next)
    }

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

    if (hierarchy?.level === 'browse_categories') {
      const pagination = await PaginationService.find(account, 'categories')

      if (!pagination) {
        return
      }

      fetchAndRenderCategories(account, pagination.previous)
    }

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
  browseCategories,
  trackOrder,
  paginateForward,
  paginateBackwards,
}

export default ProductService
