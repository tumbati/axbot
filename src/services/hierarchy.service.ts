import WhatsappDispatcher from 'src/channels/whatsapp/whatsapp.dispatcher'
import Hierarchy from 'src/channels/whatsapp/whatsapp.hierarchy'
import { ChildFiltration, IHierarchy } from 'src/interfaces'
import HierarchyModel from 'src/models/hierarchy.model'
import { buildMenu, findItemPath, hasHierarchySeparator, isDigit } from 'src/utils/util'

async function updateHierarchyLevel(account: string, level: string): Promise<boolean> {
  const result = await HierarchyModel.updateOne({ account }, { $set: { level } })
  return result.modifiedCount > 0
}

async function sendMainMenu(account: string): Promise<void> {
  try {
    const header = 'Select an option by entering its corresponding number.'
    const message = buildMenu(
      header,
      Hierarchy.structure.filter((item) => !item.isPrivate)
    )

    const hierarchy = await HierarchyModel.findOne({ account })

    if (!hierarchy) {
      await HierarchyModel.create({
        account,
        level: 'menu',
      })

      WhatsappDispatcher.send(account, {
        type: 'text',
        text: { body: message },
      })
      return
    }

    await updateHierarchyLevel(account, 'menu')
    WhatsappDispatcher.send(account, {
      type: 'text',
      text: { body: message },
    })
  } catch (error) {
    console.log(error)
  }
}

async function filtrateChildren(filtration: ChildFiltration): Promise<void> {
  try {
    const index = parseInt(filtration.value) - 1
    const option = filtration.subordinate.children?.at(index)

    if (option?.action) {
      option.action(filtration.account, filtration.value, filtration.subordinate)
      return
    }
  } catch (error) {
    console.log(error)
  }
}

async function filtrateInHierarchy(account: string, value: string): Promise<void> {
  try {
    const result = await HierarchyModel.findOne<IHierarchy>({ account })

    if (!result) {
      return
    }

    if (hasHierarchySeparator(result.level)) {
      const item = findItemPath(Hierarchy.structure, result.level)
      const parent = Hierarchy.structure.find(
        (item) => item.name === result.level.split(':').first
      )

      if (!item?.action) {
        //reporting error
        return
      }

      item.action(account, value, parent)
      return
    }

    let subordinate = Hierarchy.structure.find((item) => item.name === result.level)

    if (result.level === 'menu' && isDigit(value)) {
      subordinate = Hierarchy.structure
        .filter((item) => !item.isPrivate)
        .at(parseInt(value) - 1)
    }

    if (subordinate?.children) {
      if (result.level === subordinate.name && !isDigit(value)) {
        return sendMessage(account, 'Error!!\n\nYou can only use numeric values')
      }

      if (result.level === subordinate.name && isDigit(value)) {
        const item = subordinate?.children.at(parseInt(value) - 1)
        const message =
          'Error!!\n\nNumber out of range only from 1-' +
          subordinate.children.filter((item) => !item.isPrivate).length
        if (!item || item.isPrivate) {
          return sendMessage(account, message)
        }

        filtrateChildren({
          subordinate,
          hierarchy: result,
          account,
          value,
        })

        return
      }

      const menu = buildMenu(subordinate.header || '', subordinate.children)
      await updateHierarchyLevel(account, subordinate.name)
      sendMessage(account, menu)
      return
    }

    if (subordinate?.prompts && subordinate.action) {
      subordinate.action(account, value)
      return
    }

    if (subordinate?.action) {
      subordinate.action(account, value)
    }
  } catch (error) {
    console.log(error)
  }
}

function sendMessage(account: string, message: string) {
  WhatsappDispatcher.send(account, {
    type: 'text',
    text: { body: message },
  })
}

const HierarchyService = {
  filtrateInHierarchy,
  sendMainMenu,
  updateHierarchyLevel,
}

export default HierarchyService
