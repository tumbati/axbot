
export async function runSearch(account: string, query: string) {
  try {
    // const response = await http.get<{ products: IProduct[] }>(
    //   'https://dummyjson.com/products'
    // )

    // const results = response.data.products.filter((product) => {
    //   const matchesTitle = product.title.lowercase().includes(query)
    //   const matchesDescription = product.description.lowercase().includes(query)

    //   return matchesTitle || matchesDescription
    // })

    // // ProductService.cacheProducts(account, results)

    // let message = ''

    // for (let i = 0; i < results.length; i++) {
    //   // message += ProductService.createWhatsappTextTemplate(results[i], i)
    // }

    // message =
    //   message.length > 4096
    //     ? `Error! \nThe query "${query}", generated a lot of results.`
    //     : message

    // if (!message && query) {
    //   message = 'No results found'
    // }

    // dispatcherService.send(account, {
    //   type: 'text',
    //   text: {
    //     body: query
    //       ? message
    //       : 'You must provide a query after "search", eg; search iphone 7',
    //   },
    // })
  } catch (e: any) {
    console.log(e.response.data.message)
  }
}

export default {
  runSearch,
}
