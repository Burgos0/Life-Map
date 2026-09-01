import React, { useState, useRef, useEffect } from 'react'
import { createItem } from '../utils/dataManager'
import '../styles/Inbox.css'

const Inbox = ({ onAddToInbox, inboxItems, onRemoveFromInbox, onNavigateToItem }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const inputRef = useRef()

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleAdd = () => {
    if (input.trim()) {
      const newItem = createItem(input.trim(), 'Task')
      onAddToInbox(newItem)
      setInput('')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAdd()
    } else if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }

  return (
    <div className="inbox-container">
      <button
        className="inbox-toggle"
        onClick={() => setIsOpen(!isOpen)}
        title="Inbox"
      >
        📥 {inboxItems.length > 0 && <span className="inbox-badge">{inboxItems.length}</span>}
      </button>

      {isOpen && (
        <div className="inbox-panel">
          <div className="inbox-header">
            <h3>Inbox</h3>
            <button className="close-btn" onClick={() => setIsOpen(false)}>✕</button>
          </div>

          <div className="inbox-input-section">
            <input
              ref={inputRef}
              type="text"
              placeholder="Quick add... (press Enter)"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="inbox-input"
            />
            <button className="btn btn-primary" onClick={handleAdd}>Add</button>
          </div>

          <div className="inbox-items">
            {inboxItems.length === 0 ? (
              <div className="inbox-empty">Empty inbox ✓</div>
            ) : (
              inboxItems.map(item => (
                <div key={item.id} className="inbox-item">
                  <span className="item-text">{item.name}</span>
                  <div className="item-actions">
                    <button
                      className="btn-small btn-success"
                      onClick={() => onNavigateToItem(item)}
                      title="Move to location"
                    >
                      ↗️
                    </button>
                    <button
                      className="btn-small btn-danger"
                      onClick={() => onRemoveFromInbox(item.id)}
                      title="Delete"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Inbox
