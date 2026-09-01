/**
 * Migrates from old single "Life" tree to new multi-root structure
 * Extracts School, Car, Money as independent roots
 * Moves other categories to Ideas/Hold
 */

export const migrateOldData = (oldData) => {
  // If already in new format, return as-is
  if (oldData.school && oldData.car && oldData.money && oldData.ideas !== undefined) {
    return oldData
  }

  // Extract from old Life tree
  let school = null
  let car = null
  let money = null
  const uncategorized = []

  if (oldData.children) {
    oldData.children.forEach(child => {
      if (child.name.toLowerCase() === 'school') {
        school = JSON.parse(JSON.stringify(child))
        school.id = 'school-root'
      } else if (child.name.toLowerCase() === 'cars' || child.name.toLowerCase() === 'car') {
        car = JSON.parse(JSON.stringify(child))
        car.id = 'car-root'
        car.name = 'Car' // Normalize to singular
      } else if (child.name.toLowerCase() === 'money') {
        money = JSON.parse(JSON.stringify(child))
        money.id = 'money-root'
      } else {
        // Move other categories to uncategorized
        uncategorized.push(JSON.parse(JSON.stringify(child)))
      }
    })
  }

  // Create default structures if missing
  if (!school) {
    school = createDefaultRoot('School', 'school-root')
  }
  if (!car) {
    car = createDefaultRoot('Car', 'car-root')
  }
  if (!money) {
    money = createDefaultRoot('Money', 'money-root')
  }

  // Create ideas array from uncategorized items
  const ideas = uncategorized.map((item, idx) => ({
    id: `idea-${idx}-${Date.now()}`,
    text: item.name,
    notes: item.notes || '',
    dateCreated: Date.now(),
    isOnHold: false
  }))

  return {
    school,
    car,
    money,
    ideas
  }
}

/**
 * Creates a default root node for a category
 */
const createDefaultRoot = (name, id) => {
  return {
    id,
    name,
    type: 'Area',
    priority: 4,
    status: 'In Progress',
    notes: '',
    children: []
  }
}

/**
 * Checks if data is in new format
 */
export const isNewFormat = (data) => {
  return data && typeof data === 'object' && 'school' in data && 'car' in data && 'money' in data
}
