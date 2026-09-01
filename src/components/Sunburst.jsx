import React, { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import '../styles/Sunburst.css'

const MAP_COLOR_FAMILIES = {
  school: ['#1b6f9d', '#2386a7', '#29999f', '#185a86'],
  car: ['#913f3d', '#ad4b3f', '#bf6240', '#793638'],
  money: ['#367953', '#478b60', '#5aa477', '#2d6547']
}

const getColor = (mapType, depth) => {
  const colorFamily = MAP_COLOR_FAMILIES[mapType] || MAP_COLOR_FAMILIES.school
  return colorFamily[(Math.max(1, depth) - 1) % colorFamily.length]
}

const Sunburst = ({ data, onItemClick, currentId, completedIds, mapType = 'school' }) => {
  const svgRef = useRef()
  const containerRef = useRef()
  const [tooltip, setTooltip] = useState(null)
  const rootRef = useRef(null)
  const [hoveredId, setHoveredId] = useState(null)
  const [hoveredAncestors, setHoveredAncestors] = useState(new Set())
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const container = containerRef.current
    if (!container) return undefined

    const resizeObserver = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setContainerSize((previousSize) => (
        previousSize.width === width && previousSize.height === height
          ? previousSize
          : { width, height }
      ))
    })

    resizeObserver.observe(container)
    return () => resizeObserver.disconnect()
  }, [])

  useEffect(() => {
    if (!svgRef.current || !data) return

    const container = containerRef.current
    if (!container) return

    const width = containerSize.width || container.clientWidth
    const height = containerSize.height || container.clientHeight
    if (!width || !height) return

    // Keep the full radial chart inside this panel, clear of its title and edges.
    const titleClearance = 42
    const horizontalMargin = 28
    const bottomMargin = 26
    const availableRadius = Math.max(0, Math.min(
      (width - horizontalMargin * 2) / 2,
      (height - titleClearance - bottomMargin) / 2
    ))

    const svgElement = d3.select(svgRef.current)
    svgElement.selectAll('*').remove()

    // Create hierarchy without using partition's descendant-based weighting
    const hierarchy = d3.hierarchy(data)
    const visibleDepth = Math.max(1, hierarchy.height)
    const centerRadius = Math.min(
      Math.max(24, availableRadius * 0.3),
      Math.max(18, availableRadius - visibleDepth * 14)
    )
    const radialSpace = Math.max(0, availableRadius - centerRadius)
    const ringThickness = Math.max(
      Math.min(14, radialSpace),
      Math.min(60, radialSpace / visibleDepth)
    )
    const chartCenterY = titleClearance + (height - titleClearance - bottomMargin) / 2

    // Manually assign ALL angular and radial coordinates
    // This ensures: 1) direct children get equal 360° distribution 2) descendants divide parent's wedge
    const assignCoordinates = (node, startAngle, endAngle) => {
      node.x0 = startAngle
      node.x1 = endAngle
      node.y0 = Math.max(0, node.depth - 1) * ringThickness + centerRadius
      node.y1 = node.y0 + ringThickness

      if (node.children && node.children.length > 0) {
        const numChildren = node.children.length
        const anglePerChild = (endAngle - startAngle) / numChildren

        node.children.forEach((child, i) => {
          const childStart = startAngle + i * anglePerChild
          const childEnd = startAngle + (i + 1) * anglePerChild
          assignCoordinates(child, childStart, childEnd)
        })
      }
    }

    // Assign all coordinates: direct children of root get 0 to 2π equally
    assignCoordinates(hierarchy, 0, 2 * Math.PI)
    const root = hierarchy

    rootRef.current = root

    const svg = svgElement
      .attr('width', width)
      .attr('height', height)
      .style('background-color', '#0d0d0d')

    const g = svg.append('g')
      .attr('class', 'sunburst-group')
      .attr('transform', `translate(${width / 2},${chartCenterY})`)

    const arcGenerator = d3.arc()
      .startAngle(d => d.x0)
      .endAngle(d => d.x1)
      .innerRadius(d => d.y0)
      .outerRadius(d => d.y1)
      .padAngle(0.005)  // Tiny gap between arcs

    const nodes = root.descendants().filter(d => d.depth > 0)

    // Create arcs
    const paths = g.selectAll('path.arc')
      .data(nodes, d => d.data.id)
      .enter()
      .append('path')
      .attr('class', 'arc')
      .attr('data-id', d => d.data.id)
      .attr('d', arcGenerator)
      .attr('fill', d => getColor(mapType, d.depth))
      .attr('stroke', '#0a0a0a')
      .attr('stroke-width', 1.5)
      .style('opacity', d => completedIds.has(d.data.id) && d.data.status === 'Done' ? 0.3 : 0.85)
      .style('cursor', 'pointer')
      .on('mouseenter', function(event, d) {
        setHoveredId(d.data.id)
        
        // Collect ancestors
        const ancestors = new Set()
        let current = d.parent
        while (current) {
          ancestors.add(current.data.id)
          current = current.parent
        }
        setHoveredAncestors(ancestors)
        
        // Show tooltip
        const x = event.clientX
        const y = event.clientY
        const tooltipWidth = 220
        const tooltipHeight = 120
        setTooltip({
          x: Math.max(12, Math.min(x + 12, window.innerWidth - tooltipWidth)),
          y: Math.max(12, Math.min(y + 12, window.innerHeight - tooltipHeight)),
          name: d.data.name,
          type: d.data.type,
          status: d.data.status,
          priority: d.data.priority
        })
      })
      .on('mouseleave', () => {
        setHoveredId(null)
        setHoveredAncestors(new Set())
        setTooltip(null)
      })
      .on('click', (event, d) => {
        event.stopPropagation()
        // Animate the transition
        onItemClick(d.data.id, mapType)
      })

    // Update path opacity based on hover
    paths.style('opacity', function(d) {
      if (!hoveredId) {
        return completedIds.has(d.data.id) && d.data.status === 'Done' ? 0.3 : 0.85
      }
      if (d.data.id === hoveredId) {
        return 1.0
      }
      if (hoveredAncestors.has(d.data.id)) {
        return completedIds.has(d.data.id) && d.data.status === 'Done' ? 0.4 : 0.9
      }
      return completedIds.has(d.data.id) && d.data.status === 'Done' ? 0.15 : 0.3
    })

    // Add text labels
    g.selectAll('text.arc-label')
      .data(nodes, d => d.data.id)
      .enter()
      .append('text')
      .attr('class', 'arc-label')
      .attr('transform', d => {
        const angle = (d.x0 + d.x1) / 2
        const radius = (d.y0 + d.y1) / 2
        const degrees = angle * 180 / Math.PI - 90
        
        // Flip the left semicircle so glyphs never render upside-down.
        const isLeftSide = angle > Math.PI
        const rotation = isLeftSide ? degrees + 180 : degrees
        
        return `rotate(${rotation}) translate(${radius},0)`
      })
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('font-size', d => {
        if (d.depth === 1) return '13px'
        if (d.depth === 2) return '11px'
        return '10px'
      })
      .attr('font-weight', d => {
        if (d.depth === 1) return '700'
        return d.data.priority >= 4 ? '600' : '500'
      })
      .attr('fill', '#f0f0f0')
      .attr('pointer-events', 'none')
      .style('text-shadow', '0 1px 2px rgba(0,0,0,0.95)')
      .text(d => {
        const arcWidth = d.y1 - d.y0
        const arcAngle = d.x1 - d.x0
        
        // Minimum arc width to show labels
        const minWidth = d.depth === 1 ? 18 : 20
        if (arcWidth < minWidth) return ''
        
        // Calculate max characters
        const arcLength = arcAngle * (d.y0 + d.y1) / 2
        const charWidth = d.depth === 1 ? 7.5 : 6.5
        const maxChars = Math.max(1, Math.floor(arcLength / charWidth))
        
        // Hide labels that don't fit entirely (no ellipsis)
        if (d.data.name.length > maxChars) {
          return ''
        }
        return d.data.name
      })
      .style('opacity', d => {
        if (!hoveredId) return 1
        if (d.data.id === hoveredId) return 1
        if (hoveredAncestors.has(d.data.id)) return 0.9
        return 0.4
      })

    // Center circle
    const centerGroup = g.append('g').attr('class', 'center')
    
    centerGroup.append('circle')
      .attr('r', centerRadius)
      .attr('fill', getColor(mapType, 1))
      .attr('stroke', '#333')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .on('mouseenter', function() {
        d3.select(this)
          .attr('stroke-width', 3)
          .transition()
          .duration(200)
          .attr('r', centerRadius + 5)
      })
      .on('mouseleave', function() {
        d3.select(this)
          .attr('stroke-width', 2)
          .transition()
          .duration(200)
          .attr('r', centerRadius)
      })
      .on('click', () => {
        setHoveredId(null)
        onItemClick(data.id, mapType)
      })

    centerGroup.append('text')
      .attr('class', 'center-name')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('y', -10)
      .attr('font-size', '16px')
      .attr('font-weight', '700')
      .attr('fill', '#fff')
      .style('pointer-events', 'none')
      .style('text-shadow', '0 1px 2px rgba(0,0,0,0.5)')
      .text(data.name)

    centerGroup.append('text')
      .attr('class', 'center-type')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('y', 10)
      .attr('font-size', '10px')
      .attr('fill', '#aaa')
      .style('text-transform', 'uppercase')
      .style('letter-spacing', '1.2px')
      .style('font-weight', '600')
      .style('pointer-events', 'none')
      .text(data.type)

  }, [data, onItemClick, currentId, completedIds, hoveredId, hoveredAncestors, mapType])

  return (
    <div ref={containerRef} className="sunburst-container">
      <svg ref={svgRef}></svg>
      {tooltip && (
        <div 
          className="sunburst-tooltip"
          style={{ 
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`
          }}
        >
          <div className="tooltip-name">{tooltip.name}</div>
          <div className="tooltip-type">{tooltip.type}</div>
          <div className="tooltip-status">{tooltip.status}</div>
          <div className="tooltip-priority">Priority: {tooltip.priority}</div>
        </div>
      )}
    </div>
  )
}

export default Sunburst
