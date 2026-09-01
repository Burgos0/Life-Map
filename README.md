# 🗺️ Life Map

A visual personal organizer with an interactive radial sunburst chart. Organize everything in your life into a hierarchical structure and visualize it beautifully.

## Features

- **Radial Sunburst Visualization**: Click to zoom into sections and navigate through your life hierarchy
- **Complete Item Management**: Add, edit, delete, and organize items with type, priority, status, and notes
- **Quick Inbox**: Rapidly add items without deciding where they belong
- **Search**: Find any item across your entire hierarchy
- **Import/Export**: Save and restore your data as JSON
- **Dark & Modern UI**: Polished dark theme with smooth animations
- **Local Storage**: All data saved in browser - no servers or accounts needed
- **Responsive Design**: Works on desktop and mobile

## Core Concepts

### Item Types
- **Area**: High-level category (e.g., School, Cars, Money)
- **Project**: Medium-level grouping (e.g., G35 Supercharger, EE 301)
- **Task**: Actionable item (e.g., Install injectors, Study for midterm)
- **Want**: Something you want to own or do
- **Idea**: Random thoughts and ideas

### Item Properties
- **Name**: What is this item?
- **Type**: Which category above?
- **Priority**: 1-5 scale (5 = highest)
- **Status**: Not Started, In Progress, Waiting, Done
- **Notes**: Additional details
- **Children**: Sub-items in the hierarchy

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

The optimized build will be in the `dist/` folder.

## How to Use

### Navigate the Hierarchy
1. Click any section in the radial chart to zoom into it
2. Use the breadcrumb trail at the top to go back
3. Click breadcrumb items to jump to any level

### Search
1. Use the search box at the top to find items
2. Click a result to navigate directly to it

### Edit Items
1. Click an item to select it
2. The side panel shows all details
3. Click "Edit" to modify the item
4. Save your changes

### Add Items
1. **Direct**: Click the "+ Add Item" button to add to current level
2. **Within item**: Select an item and click "+ Add Child"
3. **Quick add**: Use the Inbox to add items rapidly

### Inbox
1. Click the Inbox icon (📥) in the header
2. Type quickly and press Enter
3. Later, click the arrow button to move items to their proper location
4. Or delete directly with the ✕ button

### Import/Export
1. **Export**: Click the ↓ button to download your data as JSON
2. **Import**: Click the ↑ button to upload a previously exported file

## Technology Stack

- **React 18**: User interface
- **D3.js**: Radial visualization
- **Vite**: Build tool and dev server
- **CSS**: Styling and animations
- **localStorage**: Persistent storage

## Data Structure

All data is stored locally in your browser. The app only creates localStorage data if none exists on first launch. Subsequent launches will load and preserve your existing data.

### Example Initial Structure

```
Life (Root)
├── School
│   └── EE 301
│       ├── Homework
│       └── Study for midterm
├── Cars
│   └── G35
│       ├── Supercharger
│       │   ├── Install injectors
│       │   └── Install fuel pump
│       └── Maintenance
│           └── Oil change
├── Money
│   ├── Bills
│   └── Savings
├── Personal
│   └── Fitness
├── Projects
├── Wants
└── Ideas
```

## Tips for Best Results

1. **Start Broad**: Create top-level areas first (e.g., Life areas)
2. **Add Details**: Nest projects and tasks under areas
3. **Use Inbox**: Don't overthink placement - use inbox for quick capture
4. **Regular Export**: Export your data periodically for backup
5. **Color Meaning**: Each top-level area has a distinct color for visual scanning

## Keyboard Shortcuts

- Type in search box to find items
- Press Enter in inbox to add an item
- Press Escape to close panels

## Browser Support

Works on all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

This project is open source and available under the MIT License.
