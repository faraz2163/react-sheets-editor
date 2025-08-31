# 🚀 Highly Reactive Google Sheets Editor

A real-time, highly reactive Google Sheets editor built with React and Node.js that provides instant feedback, optimistic updates, and seamless editing experience.

## ✨ Features

### 🎯 **Real-Time Reactivity**
- **Instant Visual Feedback**: See changes immediately as you type
- **Optimistic Updates**: UI updates instantly while saving in background
- **Debounced API Calls**: Automatic saving after 500ms of inactivity
- **Real-Time Synchronization**: Changes sync with Google Sheets instantly

### 🎮 **Advanced Editing**
- **Double-click to Edit**: Click any cell to start editing
- **Keyboard Navigation**: Full keyboard support with arrow keys, Tab, Enter
- **Multi-cell Selection**: Navigate between cells seamlessly
- **Escape to Cancel**: Press Escape to cancel editing

### 🎨 **Professional UI/UX**
- **Modern Design**: Clean, professional interface with smooth animations
- **Status Indicators**: Real-time feedback on save status, errors, and pending changes
- **Responsive Layout**: Works on desktop and mobile devices
- **Visual Feedback**: Color-coded cells for editing, pending, and error states

### ⚡ **Performance Features**
- **Virtual Scrolling**: Handles thousands of rows efficiently
- **Smart Caching**: Intelligent caching with automatic cleanup
- **Batch Updates**: Multiple changes saved in single API call
- **Error Handling**: Graceful error handling with automatic rollback

## 🛠️ Setup

### Prerequisites
- Node.js 16+ 
- Google Sheets API credentials
- A Google Sheets document

### 1. Clone and Install
```bash
git clone <repository-url>
cd googlesheetdata
npm install
cd server
npm install
```

### 2. Google Sheets API Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google Sheets API
4. Create a Service Account
5. Download the JSON key file
6. Place it as `server/service-account.json`

### 3. Configure Spreadsheet
1. Open your Google Sheets document
2. Share it with the service account email (from the JSON file)
3. Copy the spreadsheet ID from the URL
4. Update `spreadsheetId` in `server/index.js`

### 4. Start the Application
```bash
# Terminal 1: Start backend
cd server
npm start

# Terminal 2: Start frontend
npm run dev
```

## 🎯 Usage

### Basic Editing
1. **Double-click** any cell to start editing
2. **Type** your content
3. **Press Enter** or click outside to save
4. **Press Escape** to cancel

### Keyboard Navigation
- **Enter**: Start editing or confirm edit
- **Escape**: Cancel editing
- **Tab/Arrow Right**: Move to next cell
- **Arrow Left**: Move to previous cell
- **Arrow Up/Down**: Move to cell above/below

### Status Indicators
- **💾 Saving changes...**: Changes are being saved
- **⏳ X pending changes**: X changes waiting to be saved
- **⚠️ Error message**: Something went wrong (with details)

## 🔧 API Endpoints

### `GET /tabs`
Get all available tabs/sheets in the spreadsheet.

### `GET /sheet/:tab?start=1&limit=500&cols=A:Z`
Get data from a specific tab with pagination and column selection.

### `POST /sheet/:tab/batch`
Update multiple cells in a single request.

### `GET /health`
Health check endpoint.

## 🎨 Customization

### Styling
- Modify `src/App.css` for custom styling
- Update color schemes, fonts, and layouts
- Add custom animations and transitions

### Behavior
- Adjust debounce timing in `src/App.jsx`
- Modify cache TTL in `server/index.js`
- Customize validation rules and error handling

### Features
- Add support for different data types
- Implement cell formatting options
- Add search and filter capabilities
- Integrate with other Google APIs

## 🚀 Performance Tips

### For Large Spreadsheets
- Use column limits (e.g., `cols=A:F` instead of `A:Z`)
- Implement row virtualization for very long sheets
- Use pagination for better memory management

### For High-Frequency Updates
- Adjust debounce timing based on your needs
- Implement rate limiting if necessary
- Use WebSocket for real-time collaboration

## 🐛 Troubleshooting

### Common Issues

**"Unable to parse range" Error**
- ✅ Fixed: Range format now correctly generates `A1:Z500` instead of `A:Z1:A:Z500`

**Authentication Errors**
- Verify `service-account.json` is in the correct location
- Check that the service account has access to the spreadsheet
- Ensure Google Sheets API is enabled

**CORS Issues**
- Backend is configured with CORS enabled
- Verify backend is running on port 4000
- Check browser console for CORS errors

**Performance Issues**
- Reduce the number of columns being loaded
- Implement pagination for very large datasets
- Check network tab for slow API calls

## 🔮 Future Enhancements

- [ ] **Real-time Collaboration**: Multiple users editing simultaneously
- [ ] **Cell Formatting**: Bold, italic, colors, etc.
- [ ] **Formulas Support**: Google Sheets formulas and calculations
- [ ] **Data Validation**: Input validation and constraints
- [ ] **Export Options**: CSV, Excel, PDF export
- [ ] **Search & Filter**: Advanced data filtering capabilities
- [ ] **Undo/Redo**: Change history and rollback
- [ ] **Mobile App**: Native mobile applications

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Built with ❤️ using React, Node.js, and Google Sheets API**
