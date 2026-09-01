const STORAGE_KEY = 'lifeMapData'

export const generateId = () => {
  return Math.random().toString(36).substr(2, 9)
}

export const createItem = (name, type = 'Area', parent = null) => {
  return {
    id: generateId(),
    name,
    type,
    priority: 3,
    status: 'Not Started',
    notes: '',
    children: []
  }
}

export const saveData = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    return true
  } catch (e) {
    console.error('Failed to save data:', e)
    return false
  }
}

export const loadData = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : null
  } catch (e) {
    console.error('Failed to load data:', e)
    return null
  }
}

export const findItemById = (root, id) => {
  if (root.id === id) return root
  for (const child of root.children) {
    const found = findItemById(child, id)
    if (found) return found
  }
  return null
}

export const findItemAndParent = (root, id) => {
  if (root.id === id) return { item: root, parent: null }
  
  for (const child of root.children) {
    if (child.id === id) return { item: child, parent: root }
    const found = findItemAndParent(child, id)
    if (found) return found
  }
  return { item: null, parent: null }
}

export const getPath = (root, id) => {
  const path = []
  
  const traverse = (item) => {
    if (item.id === id) {
      path.push(item)
      return true
    }
    for (const child of item.children) {
      if (traverse(child)) {
        path.unshift(item)
        return true
      }
    }
    return false
  }
  
  traverse(root)
  return path
}

export const addItemToParent = (root, parentId, newItem) => {
  if (root.id === parentId) {
    root.children.push(newItem)
    return true
  }
  
  for (const child of root.children) {
    if (addItemToParent(child, parentId, newItem)) {
      return true
    }
  }
  return false
}

export const updateItem = (root, itemId, updates) => {
  const item = findItemById(root, itemId)
  if (item) {
    Object.assign(item, updates)
    return true
  }
  return false
}

export const deleteItem = (root, itemId) => {
  if (root.id === itemId) return false
  
  for (let i = 0; i < root.children.length; i++) {
    if (root.children[i].id === itemId) {
      root.children.splice(i, 1)
      return true
    }
  }
  
  for (const child of root.children) {
    if (deleteItem(child, itemId)) {
      return true
    }
  }
  return false
}

export const moveItem = (root, itemId, newParentId) => {
  const { item, parent } = findItemAndParent(root, itemId)
  if (!item || !parent) return false
  
  const newParent = findItemById(root, newParentId)
  if (!newParent) return false
  
  // Remove from old parent
  parent.children = parent.children.filter(child => child.id !== itemId)
  
  // Add to new parent
  newParent.children.push(item)
  return true
}

export const searchItems = (root, query) => {
  const results = []
  const lowerQuery = query.toLowerCase()
  
  const traverse = (item, path) => {
    if (item.name.toLowerCase().includes(lowerQuery)) {
      results.push({
        item,
        path: [...path, item]
      })
    }
    for (const child of item.children) {
      traverse(child, [...path, item])
    }
  }
  
  traverse(root, [])
  return results
}

export const validateData = (data) => {
  if (!data || typeof data !== 'object') return false
  if (!data.id || !data.name) return false
  if (!Array.isArray(data.children)) return false
  
  for (const child of data.children) {
    if (!validateData(child)) return false
  }
  
  return true
}

export const exportData = (data) => {
  const dataStr = JSON.stringify(data, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)
  const link = document.createElement('a')
  link.href = url
  link.download = `lifeMap-${new Date().toISOString().split('T')[0]}.json`
  link.click()
  URL.revokeObjectURL(url)
}

export const importData = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result)
        if (validateData(data)) {
          resolve(data)
        } else {
          reject(new Error('Invalid Life Map data format'))
        }
      } catch (err) {
        reject(new Error('Failed to parse JSON file'))
      }
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsText(file)
  })
}
