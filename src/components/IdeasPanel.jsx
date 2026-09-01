import React, { useRef, useState } from 'react'
import '../styles/IdeasPanel.css'

const formatIdeaAge = (dateCreated) => {
  if (!dateCreated) return null

  const daysOld = Math.floor((Date.now() - dateCreated) / 86400000)
  if (daysOld <= 0) return 'Today'
  if (daysOld === 1) return 'Yesterday'
  return `${daysOld} days ago`
}

const IdeasPanel = ({ ideas, onAddIdea, onDeleteIdea, onUpdateIdea, onToggleHold, onMoveToMap }) => {
  const [inputText, setInputText] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')
  const [expandedIdeaId, setExpandedIdeaId] = useState(null)
  const inputRef = useRef(null)

  const handleAddIdea = () => {
    if (inputText.trim()) {
      onAddIdea(inputText.trim())
      setInputText('')
      inputRef.current?.focus()
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddIdea()
    }
  }

  const handleStartEdit = (idea) => {
    setEditingId(idea.id)
    setEditText(idea.text)
    setExpandedIdeaId(idea.id)
  }

  const handleSaveEdit = (id) => {
    if (editText.trim()) {
      onUpdateIdea(id, { text: editText.trim() })
    }
    setEditingId(null)
    setEditText('')
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditText('')
  }

  const activeIdeas = ideas.filter(i => !i.isOnHold)
  const heldIdeas = ideas.filter(i => i.isOnHold)

  const renderIdea = (idea) => {
    const isExpanded = expandedIdeaId === idea.id

    return (
      <div
        key={idea.id}
        className={`idea-item${idea.isOnHold ? ' idea-item-held' : ''}${isExpanded ? ' idea-item-expanded' : ''}`}
        onClick={() => setExpandedIdeaId(isExpanded ? null : idea.id)}
      >
        {editingId === idea.id ? (
          <div className="idea-edit" onClick={(e) => e.stopPropagation()}>
            <input
              type="text"
              className="idea-edit-input"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              autoFocus
            />
            <div className="idea-edit-buttons">
              <button className="idea-edit-save" onClick={() => handleSaveEdit(idea.id)}>Save</button>
              <button className="idea-edit-cancel" onClick={handleCancelEdit}>Cancel</button>
            </div>
          </div>
        ) : (
          <>
            <div className="idea-text">{idea.text}</div>
            {formatIdeaAge(idea.dateCreated) && <div className="idea-meta">{formatIdeaAge(idea.dateCreated)}</div>}
            {isExpanded && (
              <div className="idea-card-actions" onClick={(e) => e.stopPropagation()}>
                <div className="idea-move-label">Move to:</div>
                <div className="idea-destinations">
                  {['school', 'car', 'money'].map((mapType) => (
                    <button key={mapType} className="idea-destination" onClick={() => onMoveToMap(idea.id, mapType)}>
                      {mapType}
                    </button>
                  ))}
                </div>
                <div className="idea-secondary-actions">
                  <button onClick={() => handleStartEdit(idea)}>Edit</button>
                  <button onClick={() => onToggleHold(idea.id)}>{idea.isOnHold ? 'Take Off Hold' : 'Put On Hold'}</button>
                  <button className="idea-delete" onClick={() => onDeleteIdea(idea.id)}>Delete</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    )
  }

  return (
    <div className="ideas-panel">
      <div className="ideas-header">
        <h2>💭 Ideas / Hold</h2>
        <p className="ideas-subtitle">Capture ideas before organizing</p>
      </div>

      <div className="ideas-input-section">
        <input
          ref={inputRef}
          type="text"
          className="ideas-input"
          placeholder="Add an idea, task, purchase, reminder..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="ideas-add-btn" onClick={handleAddIdea} title="Add idea">
          +
        </button>
      </div>

      <div className="ideas-list">
        {activeIdeas.length === 0 && heldIdeas.length === 0 && (
          <div className="ideas-empty">
            <p>No ideas yet</p>
            <p className="ideas-empty-hint">Start capturing thoughts above</p>
          </div>
        )}

        {activeIdeas.length > 0 && (
          <div className="ideas-section">
            <div className="ideas-section-label">Active</div>
            {activeIdeas.map(renderIdea)}
          </div>
        )}

        {heldIdeas.length > 0 && (
          <div className="ideas-section">
            <div className="ideas-section-label">On Hold</div>
            {heldIdeas.map(renderIdea)}
          </div>
        )}
      </div>
    </div>
  )
}

export default IdeasPanel
