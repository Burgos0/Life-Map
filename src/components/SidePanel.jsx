import React, { useState, useEffect } from 'react'
import '../styles/SidePanel.css'

const SidePanel = ({ item, onUpdate, onDelete, onAddChild, onClose, canDelete }) => {
  const [formData, setFormData] = useState(item || {})
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    setFormData(item || {})
  }, [item])

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = () => {
    onUpdate(formData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData(item)
    setIsEditing(false)
  }

  if (!item) return null

  return (
    <div className="side-panel">
      <div className="panel-header">
        <h2>Item Details</h2>
        <button className="close-btn" onClick={onClose}>✕</button>
      </div>

      <div className="panel-content">
        <div className="form-group">
          <label>Name</label>
          {isEditing ? (
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => handleChange('name', e.target.value)}
              className="form-input"
            />
          ) : (
            <div className="field-value">{formData.name}</div>
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Type</label>
            {isEditing ? (
              <select
                value={formData.type || 'Area'}
                onChange={(e) => handleChange('type', e.target.value)}
                className="form-select"
              >
                <option>Area</option>
                <option>Project</option>
                <option>Task</option>
                <option>Want</option>
                <option>Idea</option>
              </select>
            ) : (
              <div className="field-value">{formData.type}</div>
            )}
          </div>

          <div className="form-group">
            <label>Priority</label>
            {isEditing ? (
              <select
                value={formData.priority || 3}
                onChange={(e) => handleChange('priority', parseInt(e.target.value))}
                className="form-select"
              >
                <option value={1}>1 - Low</option>
                <option value={2}>2</option>
                <option value={3}>3 - Normal</option>
                <option value={4}>4</option>
                <option value={5}>5 - High</option>
              </select>
            ) : (
              <div className="field-value">{formData.priority} {formData.priority >= 4 ? '⭐' : ''}</div>
            )}
          </div>
        </div>

        <div className="form-group">
          <label>Status</label>
          {isEditing ? (
            <select
              value={formData.status || 'Not Started'}
              onChange={(e) => handleChange('status', e.target.value)}
              className="form-select"
            >
              <option>Not Started</option>
              <option>In Progress</option>
              <option>Waiting</option>
              <option>Done</option>
            </select>
          ) : (
            <div className="field-value">{formData.status}</div>
          )}
        </div>

        <div className="form-group">
          <label>Notes</label>
          {isEditing ? (
            <textarea
              value={formData.notes || ''}
              onChange={(e) => handleChange('notes', e.target.value)}
              className="form-textarea"
              rows={4}
            />
          ) : (
            <div className="field-value notes-field">
              {formData.notes || <span className="placeholder">No notes</span>}
            </div>
          )}
        </div>

        {formData.children && (
          <div className="form-group">
            <label>Children ({formData.children.length})</label>
            <div className="children-list">
              {formData.children.length === 0 ? (
                <span className="placeholder">No children</span>
              ) : (
                formData.children.map(child => (
                  <div key={child.id} className="child-item">
                    {child.name}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        <div className="panel-actions">
          {isEditing ? (
            <>
              <button className="btn btn-primary" onClick={handleSave}>Save</button>
              <button className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
            </>
          ) : (
            <>
              <button className="btn btn-primary" onClick={() => setIsEditing(true)}>Edit</button>
              <button className="btn btn-secondary" onClick={() => onAddChild()}>+ Add Child</button>
              {canDelete && (
                <button className="btn btn-danger" onClick={onDelete}>Delete</button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default SidePanel
