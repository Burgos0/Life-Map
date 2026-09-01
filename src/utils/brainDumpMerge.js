/**
 * Merges parsed hierarchy items into existing data structure
 * Intelligently handles duplicates by merging into existing items
 */
import { createItem } from './dataManager'

export const mergeHierarchyItems = (parentNode, parsedItems, isTopLevel = true) => {
  parsedItems.forEach(parsedItem => {
    // Look for existing child with same name
    let existingChild = parentNode.children.find(
      child => child.name.toLowerCase() === parsedItem.name.toLowerCase()
    )

    if (existingChild) {
      // Merge into existing item
      if (parsedItem.children && parsedItem.children.length > 0) {
        mergeHierarchyItems(existingChild, parsedItem.children, false)
      }
    } else {
      // Create new item
      const itemType = getItemTypeForNew(parsedItem, isTopLevel)
      
      const newItem = createItem(parsedItem.name, itemType)
      parentNode.children.push(newItem)

      // Recursively add children
      if (parsedItem.children && parsedItem.children.length > 0) {
        mergeHierarchyItems(newItem, parsedItem.children, false)
      }
    }
  })
}

const getItemTypeForNew = (item, isTopLevel = false) => {
  if (isTopLevel) {
    return 'Area'
  }
  return item.children && item.children.length > 0 ? 'Project' : 'Task'
}
