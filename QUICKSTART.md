## Life Map - Quick Start Guide

### Installation & Running

```bash
# Install dependencies
npm install

# Start development server
npm run dev
# Opens at http://localhost:5173

# Build for production
npm run build
```

### First Time Setup
The app auto-loads sample data on first launch. This includes:
- 7 main life areas (School, Cars, Money, Personal, Projects, Wants, Ideas)
- Example nested items showing multiple visualization rings
- All sample data can be deleted or renamed

### Core Workflows

#### Navigate the Hierarchy
1. Click any section in the sunburst chart to zoom in
2. Use breadcrumbs at top to navigate back
3. Click breadcrumb items to jump to any level

#### Add Items
- **Quick**: Click "+ Add Item" button at bottom
- **To Current**: Click "+ Add Item" button
- **As Child**: Select item → click "+ Add Child"
- **Rapid Capture**: Use 📥 Inbox button

#### Edit Items
1. Click item in sunburst
2. View details in side panel (right side)
3. Click "Edit" to modify
4. Save changes

#### Search
- Type in search box at top
- Click result to navigate and select
- Shows path to each item

#### Manage Data
- **Export**: Click ↓ button (saves as JSON)
- **Import**: Click ↑ button (restores from JSON)
- **Data**: All saved automatically to browser localStorage

### Data Stays Safe
✓ Existing localStorage data never overwritten on app launch
✓ Sample data only appears on first fresh install
✓ Changes auto-saved to browser
✓ Export regularly for backups
✓ Import restores complete state

### Features

**Types**: Area, Project, Task, Want, Idea
**Priority**: 1-5 scale (5 = highest, shown with ⭐)
**Status**: Not Started, In Progress, Waiting, Done
**Completed items**: Appear faded/subdued

### Browser Compatibility
✓ Chrome/Edge (best)
✓ Firefox
✓ Safari  
✓ Mobile browsers (full responsive)

### File Organization
- `src/App.jsx` - Main application component
- `src/components/` - React components (Sunburst, SidePanel, etc.)
- `src/utils/` - Data management and initial data
- `src/styles/` - Component-specific CSS
- `src/App.css` - Main layout styles
- `src/index.css` - Global styles

### No External Dependencies Required
✓ No authentication/login
✓ No backend servers
✓ No databases
✓ No paid services
✓ All local storage in browser
✓ Works completely offline after load

### Customization Ideas
- Modify colors in Sunburst.jsx
- Change initial data in utils/initialData.js
- Add more item types in modal options
- Adjust animation speeds in CSS
- Add keyboard shortcuts
- Export/import to different formats

Enjoy mapping your life! 🗺️
