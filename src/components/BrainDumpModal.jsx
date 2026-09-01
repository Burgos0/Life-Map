import React, { useState, useEffect } from 'react'
import { parseHierarchy, previewHierarchy } from '../utils/brainDumpParser'
import '../styles/BrainDumpModal.css'

const BrainDumpModal = ({ isOpen, onConfirm, onCancel }) => {
  const [text, setText] = useState('')
  const [parsed, setParsed] = useState([])
  const [preview, setPreview] = useState('')

  useEffect(() => {
    if (text.trim().length === 0) {
      setParsed([])
      setPreview('')
    } else {
      const parsedItems = parseHierarchy(text)
      setParsed(parsedItems)
      setPreview(previewHierarchy(parsedItems))
    }
  }, [text])

  if (!isOpen) return null

  const handleConfirm = () => {
    if (parsed.length > 0) {
      onConfirm(parsed)
    }
  }

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="brain-dump-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Brain Dump</h2>
          <p className="modal-subtitle">Paste hierarchical items to add to Life Map</p>
        </div>

        <div className="brain-dump-content">
          <div className="brain-dump-input-section">
            <label>Paste items (use indentation or "-" prefix for hierarchy):</label>
            <textarea
              className="brain-dump-textarea"
              placeholder={`Example:
School
- EE 301
  - Homework
    - Study Chapter 4
  - Graduation
- Check remaining classes
Cars
- G35
  - Maintenance
    - Change oil
    - Buy tires`}
              value={text}
              onChange={(e) => setText(e.target.value)}
              autoFocus
            />
          </div>

          <div className="brain-dump-preview-section">
            <label>Preview:</label>
            <div className="brain-dump-preview">
              {preview ? (
                <pre>{preview}</pre>
              ) : (
                <p className="preview-empty">Paste items above to see preview</p>
              )}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleConfirm}
            disabled={parsed.length === 0}
          >
            Add to Life Map
          </button>
        </div>
      </div>
    </div>
  )
}

export default BrainDumpModal
