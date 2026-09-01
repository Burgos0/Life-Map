import React from 'react'
import '../styles/Breadcrumbs.css'

const Breadcrumbs = ({ path, onNavigate }) => {
  if (!path || path.length === 0) return null

  return (
    <div className="breadcrumbs">
      {path.map((item, index) => (
        <React.Fragment key={item.id}>
          <button
            className="breadcrumb-item"
            onClick={() => onNavigate(item.id)}
          >
            {item.name}
          </button>
          {index < path.length - 1 && <span className="breadcrumb-separator">/</span>}
        </React.Fragment>
      ))}
    </div>
  )
}

export default Breadcrumbs
