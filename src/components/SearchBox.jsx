import React, { useState, useEffect, useRef } from 'react'
import { searchItems } from '../utils/dataManager'
import '../styles/SearchBox.css'

const SearchBox = ({ data, onSelectResult }) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [showResults, setShowResults] = useState(false)
  const containerRef = useRef()

  useEffect(() => {
    if (query.trim()) {
      const searchResults = searchItems(data, query)
      setResults(searchResults)
      setShowResults(true)
    } else {
      setResults([])
      setShowResults(false)
    }
  }, [query, data])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowResults(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelectResult = (result) => {
    onSelectResult(result.item.id, result.path)
    setQuery('')
    setShowResults(false)
  }

  const handleClear = () => {
    setQuery('')
    setShowResults(false)
  }

  return (
    <div className="search-box-container" ref={containerRef}>
      <div className="search-box">
        <input
          type="text"
          placeholder="🔍 Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setShowResults(true)}
          className="search-input"
        />
        {query && (
          <button className="search-clear" onClick={handleClear}>✕</button>
        )}
      </div>

      {showResults && results.length > 0 && (
        <div className="search-results">
          {results.map((result, index) => (
            <div
              key={index}
              className="search-result-item"
              onClick={() => handleSelectResult(result)}
            >
              <div className="result-name">{result.item.name}</div>
              <div className="result-path">
                {result.path.slice(0, -1).map((p, i) => (
                  <span key={i}>{p.name} {i < result.path.length - 2 ? ' / ' : ''}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {showResults && query.trim() && results.length === 0 && (
        <div className="search-empty">No results found</div>
      )}
    </div>
  )
}

export default SearchBox
