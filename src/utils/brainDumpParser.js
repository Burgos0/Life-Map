/**
 * Parses hierarchical text with indentation and "-" prefixes into a tree structure
 * Example:
 * School
 * - EE 301
 * - Homework
 *   - Study Chapter 4
 * - Graduation
 */
export const parseHierarchy = (text) => {
  const lines = text.split('\n').filter(line => line.trim().length > 0)
  if (lines.length === 0) return []

  const items = []
  const stack = [] // Stack of [item, depth] pairs

  lines.forEach(line => {
    // Count leading spaces
    const leadingSpaces = line.length - line.trimStart().length
    const depth = Math.floor(leadingSpaces / 2) // Assume 2 spaces per indent level

    // Remove leading spaces and "-" prefix
    let text = line.trim()
    if (text.startsWith('-')) {
      text = text.substring(1).trim()
    }

    if (text.length === 0) return

    // Create item with name and empty children
    const item = {
      name: text,
      children: [],
      depth: depth
    }

    // Adjust stack to current depth
    while (stack.length > 0 && stack[stack.length - 1][1] >= depth) {
      stack.pop()
    }

    // Add to appropriate parent
    if (stack.length === 0) {
      // Top level
      items.push(item)
    } else {
      // Child of last item in stack
      const parent = stack[stack.length - 1][0]
      parent.children.push(item)
    }

    // Add to stack
    stack.push([item, depth])
  })

  return items
}

/**
 * Converts parsed hierarchy to a tree-like string for preview
 */
export const previewHierarchy = (items, indent = 0) => {
  if (!items || items.length === 0) return ''

  return items
    .map(item => {
      const prefix = '  '.repeat(indent) + (indent > 0 ? '└── ' : '')
      const preview = prefix + item.name
      const childPreview = item.children.length > 0 ? '\n' + previewHierarchy(item.children, indent + 1) : ''
      return preview + childPreview
    })
    .join('\n')
}

/**
 * Determines the type based on the item's properties
 */
export const getItemType = (item, isTopLevel = false) => {
  if (isTopLevel) {
    return 'Area'
  }
  return item.children && item.children.length > 0 ? 'Project' : 'Task'
}
