import React, { useState, useEffect } from 'react'
import Sunburst from './components/Sunburst'
import SidePanel from './components/SidePanel'
import IdeasPanel from './components/IdeasPanel'
import Modal, { PromptModal } from './components/Modal'
import BrainDumpModal from './components/BrainDumpModal'
import {
  findItemById,
  getPath,
  createItem,
  addItemToParent,
  updateItem,
  deleteItem,
  generateId
} from './utils/dataManager'
import {
  saveMultiRootData,
  loadMultiRootData,
  getRoot,
  findItemAcrossRoots,
  getPathAcrossRoots,
  addIdea,
  updateIdea,
  removeIdea,
  toggleIdeaHold,
  moveIdeaToMap,
  searchAll,
  exportAllData,
  importAllData
} from './utils/multiRootDataManager'
import { migrateOldData, isNewFormat } from './utils/dataMigration'
import { mergeHierarchyItems } from './utils/brainDumpMerge'
import { getInitialData } from './utils/initialData'
import './App.css'

function App() {
  const [data, setData] = useState(null)
  
  // Navigation state for each map
  const [schoolCurrentId, setSchoolCurrentId] = useState('school-root')
  const [carCurrentId, setCarCurrentId] = useState('car-root')
  const [moneyCurrentId, setMoneyCurrentId] = useState('money-root')
  const [expandedMap, setExpandedMap] = useState(null)
  
  // Selected items for editor
  const [selectedId, setSelectedId] = useState(null)
  const [selectedMap, setSelectedMap] = useState(null)
  
  const [modal, setModal] = useState({ isOpen: false, type: null })
  const [completedIds, setCompletedIds] = useState(new Set())
  const [isBrainDumpOpen, setIsBrainDumpOpen] = useState(false)
  const [brainDumpTarget, setBrainDumpTarget] = useState('school')

  // Initialize data on mount
  useEffect(() => {
    let savedData = loadMultiRootData()
    
    if (!savedData || !isNewFormat(savedData)) {
      // Migrate old format or use new initial data
      const oldData = savedData ? savedData : null
      if (oldData && oldData.children) {
        savedData = migrateOldData(oldData)
      } else {
        savedData = getInitialData()
      }
      saveMultiRootData(savedData)
    }
    
    setData(savedData)
  }, [])

  // Track completed items
  useEffect(() => {
    if (!data) return
    
    const completed = new Set()
    const maps = ['school', 'car', 'money']
    
    maps.forEach(map => {
      const root = getRoot(data, map)
      if (root) {
        const traverse = (item) => {
          if (item.status === 'Done') {
            completed.add(item.id)
          }
          if (item.children) {
            item.children.forEach(child => traverse(child))
          }
        }
        traverse(root)
      }
    })
    
    setCompletedIds(completed)
  }, [data])

  // Get currently selected item
  const selectedItem = selectedId && data ? findItemAcrossRoots(data, selectedId).item : null
  
  // Get current map's root and current item
  const getCurrentMapState = () => {
    if (!data) return { root: null, currentId: null }
    
    if (selectedMap === 'school') {
      return { root: getRoot(data, 'school'), currentId: schoolCurrentId }
    } else if (selectedMap === 'car') {
      return { root: getRoot(data, 'car'), currentId: carCurrentId }
    } else if (selectedMap === 'money') {
      return { root: getRoot(data, 'money'), currentId: moneyCurrentId }
    }
    return { root: null, currentId: null }
  }

  // Item click handlers for each map
  const handleMapItemClick = (itemId, mapType) => {
    setSelectedId(itemId)
    setSelectedMap(mapType)
    
    // Update current navigation for that map
    if (mapType === 'school') {
      setSchoolCurrentId(itemId)
    } else if (mapType === 'car') {
      setCarCurrentId(itemId)
    } else if (mapType === 'money') {
      setMoneyCurrentId(itemId)
    }
  }

  const handleUpdateItem = (updatedItem) => {
    const newData = JSON.parse(JSON.stringify(data))
    const { root } = findItemAcrossRoots(newData, selectedId)
    
    if (root) {
      updateItem(root, selectedId, updatedItem)
      setData(newData)
      saveMultiRootData(newData)
      setSelectedId(updatedItem.id)
    }
  }

  const handleDeleteItem = () => {
    const newData = JSON.parse(JSON.stringify(data))
    const { root } = findItemAcrossRoots(newData, selectedId)
    
    if (root && deleteItem(root, selectedId)) {
      setData(newData)
      saveMultiRootData(newData)
      setSelectedId(null)
    }
  }

  const handleAddChild = () => {
    setModal({
      isOpen: true,
      type: 'prompt',
      title: 'Add Child Item',
      placeholder: 'Item name',
      onConfirm: (name) => {
        const newData = JSON.parse(JSON.stringify(data))
        const { root } = findItemAcrossRoots(newData, selectedId)
        
        if (root) {
          const newItem = createItem(name, 'Task')
          addItemToParent(root, selectedId, newItem)
          setData(newData)
          saveMultiRootData(newData)
        }
        setModal({ isOpen: false, type: null })
      }
    })
  }

  const handleDeleteClick = () => {
    setModal({
      isOpen: true,
      type: 'confirm',
      title: 'Delete Item?',
      message: `Are you sure you want to delete "${selectedItem.name}"? This action cannot be undone.`,
      isDangerous: true,
      onConfirm: () => {
        handleDeleteItem()
        setModal({ isOpen: false, type: null })
      }
    })
  }

  const handleIdeasAddIdea = (text) => {
    const newData = JSON.parse(JSON.stringify(data))
    addIdea(newData, text)
    setData(newData)
    saveMultiRootData(newData)
  }

  const handleIdeasDeleteIdea = (ideaId) => {
    const newData = JSON.parse(JSON.stringify(data))
    removeIdea(newData, ideaId)
    setData(newData)
    saveMultiRootData(newData)
  }

  const handleIdeasUpdateIdea = (ideaId, updates) => {
    const newData = JSON.parse(JSON.stringify(data))
    updateIdea(newData, ideaId, updates)
    setData(newData)
    saveMultiRootData(newData)
  }

  const handleIdeasToggleHold = (ideaId) => {
    const newData = JSON.parse(JSON.stringify(data))
    toggleIdeaHold(newData, ideaId)
    setData(newData)
    saveMultiRootData(newData)
  }

  const handleIdeasMoveToMap = (ideaId, mapType) => {
    const newData = JSON.parse(JSON.stringify(data))
    moveIdeaToMap(newData, ideaId, mapType)
    setData(newData)
    saveMultiRootData(newData)
  }

  const handleExportData = () => {
    exportAllData(data)
  }

  const handleImportData = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = async (e) => {
      try {
        const importedData = await importAllData(e.target.files[0])
        if (isNewFormat(importedData)) {
          setData(importedData)
          saveMultiRootData(importedData)
        } else {
          const migrated = migrateOldData(importedData)
          setData(migrated)
          saveMultiRootData(migrated)
        }
        setSelectedId(null)
      } catch (error) {
        setModal({
          isOpen: true,
          type: 'confirm',
          title: 'Import Failed',
          message: error.message,
          confirmText: 'OK',
          cancelText: '',
          onConfirm: () => setModal({ isOpen: false, type: null })
        })
      }
    }
    input.click()
  }

  const handleBrainDump = (parsedItems) => {
    const newData = JSON.parse(JSON.stringify(data))
    
    if (brainDumpTarget === 'ideas') {
      // Add as idea entries
      parsedItems.forEach(item => {
        addIdea(newData, item.name, '')
      })
    } else {
      // Add to specified map
      const root = getRoot(newData, brainDumpTarget)
      if (root) {
        mergeHierarchyItems(root, parsedItems, true)
      }
    }
    
    setData(newData)
    saveMultiRootData(newData)
    setIsBrainDumpOpen(false)
    setBrainDumpTarget('school')
  }

  if (!data) {
    return <div className="loading">Loading Life Map...</div>
  }

  return (
    <div className="app">
      <div className="header">
        <div className="header-left">
          <h1>🗺️ Life Map</h1>
        </div>
        <div className="header-center">
          {/* Search can be added here later */}
        </div>
        <div className="header-right">
          <button 
            className="btn-icon" 
            onClick={() => {
              setIsBrainDumpOpen(true)
              setBrainDumpTarget('school')
            }} 
            title="Brain Dump"
          >
            💭
          </button>
          <button className="btn-icon" onClick={handleExportData} title="Export data">
            ↓
          </button>
          <button className="btn-icon" onClick={handleImportData} title="Import data">
            ↑
          </button>
        </div>
      </div>

      <div className="dashboard">
        <div className="left-panel">
          {data.ideas && (
            <IdeasPanel
              ideas={data.ideas}
              onAddIdea={handleIdeasAddIdea}
              onDeleteIdea={handleIdeasDeleteIdea}
              onUpdateIdea={handleIdeasUpdateIdea}
              onToggleHold={handleIdeasToggleHold}
              onMoveToMap={handleIdeasMoveToMap}
            />
          )}
        </div>

        <div className={`right-panels${expandedMap ? ' right-panels-expanded' : ''}`}>
          {expandedMap ? (
            <div className={`map-container map-expanded map-${expandedMap}`}>
              <div className="map-title map-title-expanded">
                <button className="dashboard-return" onClick={() => setExpandedMap(null)}>
                  &larr; Back to Dashboard
                </button>
                <span>{expandedMap}</span>
              </div>
              <Sunburst
                data={getRoot(data, expandedMap)}
                onItemClick={handleMapItemClick}
                currentId={expandedMap === 'school' ? schoolCurrentId : expandedMap === 'car' ? carCurrentId : moneyCurrentId}
                completedIds={completedIds}
                mapType={expandedMap}
              />
            </div>
          ) : (
            <>
              <div className="map-container map-school">
                <div className="map-title">
                  <span>SCHOOL</span>
                  <button className="map-expand" onClick={() => setExpandedMap('school')} aria-label="Expand School map" title="Expand School map">&#x26F6;</button>
                </div>
                <Sunburst
                  data={getRoot(data, 'school')}
                  onItemClick={handleMapItemClick}
                  currentId={schoolCurrentId}
                  completedIds={completedIds}
                  mapType="school"
                />
              </div>

              <div className="maps-row">
                <div className="map-container map-car">
                  <div className="map-title">
                    <span>CAR</span>
                    <button className="map-expand" onClick={() => setExpandedMap('car')} aria-label="Expand Car map" title="Expand Car map">&#x26F6;</button>
                  </div>
                  <Sunburst
                    data={getRoot(data, 'car')}
                    onItemClick={handleMapItemClick}
                    currentId={carCurrentId}
                    completedIds={completedIds}
                    mapType="car"
                  />
                </div>

                <div className="map-container map-money">
                  <div className="map-title">
                    <span>MONEY</span>
                    <button className="map-expand" onClick={() => setExpandedMap('money')} aria-label="Expand Money map" title="Expand Money map">&#x26F6;</button>
                  </div>
                  <Sunburst
                    data={getRoot(data, 'money')}
                    onItemClick={handleMapItemClick}
                    currentId={moneyCurrentId}
                    completedIds={completedIds}
                    mapType="money"
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {selectedItem && (
          <div 
            className="editor-overlay"
            onClick={() => {
              setSelectedId(null)
              setSelectedMap(null)
            }}
          >
            <div 
              className="editor-panel"
              onClick={(e) => e.stopPropagation()}
            >
              <SidePanel
                item={selectedItem}
                onUpdate={handleUpdateItem}
                onDelete={handleDeleteClick}
                onAddChild={handleAddChild}
                onClose={() => {
                  setSelectedId(null)
                  setSelectedMap(null)
                }}
                canDelete={true}
              />
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {modal.type === 'confirm' && (
        <Modal
          isOpen={modal.isOpen}
          title={modal.title}
          message={modal.message}
          confirmText={modal.confirmText || 'Confirm'}
          cancelText={modal.cancelText !== '' ? (modal.cancelText || 'Cancel') : ''}
          isDangerous={modal.isDangerous}
          onConfirm={modal.onConfirm}
          onCancel={() => setModal({ isOpen: false, type: null })}
        />
      )}

      {modal.type === 'prompt' && (
        <PromptModal
          isOpen={modal.isOpen}
          title={modal.title}
          placeholder={modal.placeholder}
          onConfirm={(value) => {
            modal.onConfirm(value)
          }}
          onCancel={() => setModal({ isOpen: false, type: null })}
        />
      )}

      <BrainDumpModal
        isOpen={isBrainDumpOpen}
        onConfirm={handleBrainDump}
        onCancel={() => setIsBrainDumpOpen(false)}
      />
    </div>
  )
}

export default App
