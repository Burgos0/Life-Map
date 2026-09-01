/**
 * Multi-root data manager for School, Car, Money trees and Ideas list
 */

const STORAGE_KEY = 'lifeMapData'

import { findItemById, findItemAndParent, updateItem as updateItemSingle, deleteItem as deleteItemSingle, getPath as getPathSingle } from './dataManager'

/**
 * Saves multi-root data to localStorage
 */
export const saveMultiRootData = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    return true
  } catch (e) {
    console.error('Failed to save data:', e)
    return false
  }
}

/**
 * Loads multi-root data from localStorage
 */
export const loadMultiRootData = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : null
  } catch (e) {
    console.error('Failed to load data:', e)
    return null
  }
}

/**
 * Gets root by type: 'school', 'car', 'money'
 */
export const getRoot = (data, mapType) => {
  if (!data) return null
  return data[mapType] || null
}

/**
 * Finds an item by ID across school/car/money roots
 * Returns { item, root, map }
 */
export const findItemAcrossRoots = (data, id) => {
  const maps = ['school', 'car', 'money']
  
  for (const map of maps) {
    const root = getRoot(data, map)
    if (!root) continue
    
    const item = findItemById(root, id)
    if (item) {
      return { item, root, map }
    }
  }
  
  return { item: null, root: null, map: null }
}

/**
 * Gets path for an item across all roots
 * Returns [ root, ...breadcrumb ]
 */
export const getPathAcrossRoots = (data, id) => {
  const { root, map } = findItemAcrossRoots(data, id)
  if (!root) return []
  return getPathSingle(root, id)
}

/**
 * Finds idea by ID in ideas array
 */
export const findIdeaById = (data, id) => {
  if (!data.ideas) return null
  return data.ideas.find(idea => idea.id === id) || null
}

/**
 * Adds a new idea
 */
export const addIdea = (data, text, notes = '') => {
  const idea = {
    id: Math.random().toString(36).substr(2, 9),
    text,
    notes,
    dateCreated: Date.now(),
    isOnHold: false
  }
  
  if (!data.ideas) {
    data.ideas = []
  }
  
  data.ideas.push(idea)
  return idea
}

/**
 * Updates an idea
 */
export const updateIdea = (data, id, updates) => {
  if (!data.ideas) return false
  
  const idea = data.ideas.find(i => i.id === id)
  if (!idea) return false
  
  Object.assign(idea, updates)
  return true
}

/**
 * Removes an idea
 */
export const removeIdea = (data, id) => {
  if (!data.ideas) return false
  
  const idx = data.ideas.findIndex(i => i.id === id)
  if (idx === -1) return false
  
  data.ideas.splice(idx, 1)
  return true
}

/**
 * Toggles on-hold status for an idea
 */
export const toggleIdeaHold = (data, id) => {
  if (!data.ideas) return false
  
  const idea = data.ideas.find(i => i.id === id)
  if (!idea) return false
  
  idea.isOnHold = !idea.isOnHold
  return true
}

/**
 * Moves an idea to a map
 * Creates a new task under the specified root
 */
export const moveIdeaToMap = (data, ideaId, mapType) => {
  const idea = findIdeaById(data, ideaId)
  if (!idea) return false
  
  const root = getRoot(data, mapType)
  if (!root) return false
  
  // Create new task from idea
  const newTask = {
    id: Math.random().toString(36).substr(2, 9),
    name: idea.text,
    type: 'Task',
    priority: 3,
    status: idea.isOnHold ? 'Waiting' : 'Not Started',
    notes: idea.notes,
    children: []
  }
  
  root.children.push(newTask)
  removeIdea(data, ideaId)
  
  return true
}

/**
 * Searches across all roots and ideas
 * Returns array of { type: 'map'|'idea', item, map, path }
 */
export const searchAll = (data, query) => {
  const results = []
  const lowerQuery = query.toLowerCase()
  
  // Search maps
  const maps = ['school', 'car', 'money']
  maps.forEach(map => {
    const root = getRoot(data, map)
    if (!root) return
    
    const searchInTree = (node, breadcrumb = []) => {
      const currentPath = [...breadcrumb, node.name]
      
      if (node.name.toLowerCase().includes(lowerQuery)) {
        results.push({
          type: 'map',
          item: node,
          map,
          path: currentPath
        })
      }
      
      if (node.children) {
        node.children.forEach(child => searchInTree(child, currentPath))
      }
    }
    
    searchInTree(root, [])
  })
  
  // Search ideas
  if (data.ideas) {
    data.ideas.forEach(idea => {
      if (idea.text.toLowerCase().includes(lowerQuery)) {
        results.push({
          type: 'idea',
          item: idea,
          path: ['Ideas / Hold']
        })
      }
    })
  }
  
  return results
}

/**
 * Exports all data
 */
export const exportAllData = (data) => {
  const dataStr = JSON.stringify(data, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)
  const link = document.createElement('a')
  link.href = url
  link.download = `life-map-backup-${Date.now()}.json`
  link.click()
  URL.revokeObjectURL(url)
}

/**
 * Imports data from file
 */
export const importAllData = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result)
        resolve(importedData)
      } catch (error) {
        reject(new Error('Failed to parse JSON file'))
      }
    }
    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }
    reader.readAsText(file)
  })
}
