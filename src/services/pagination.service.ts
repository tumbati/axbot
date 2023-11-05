import { IPagination, PaginationComponent } from 'src/interfaces'
import PaginationModel from 'src/models/pagination.model'

async function create(data: IPagination): Promise<IPagination | null> {
  try {
    await PaginationModel.deleteOne({ account: data.account, component: data.component })

    const pagination = await PaginationModel.create<IPagination>(data)

    return pagination as IPagination
  } catch (error) {
    console.log(error)
    return null
  }
}

async function find(
  account: string,
  component: PaginationComponent
): Promise<IPagination | null> {
  try {
    const pagination = await PaginationModel.findOne<IPagination>({ account, component })
    return pagination
  } catch (error) {
    return null
  }
}

const PaginationService = {
  create,
  find
}

export default PaginationService
