import './App.css'
import Navbar from './components/navbar/navbar'
import Sidebar from './components/sidebar/sidebar'
import ProductListing from './components/products/ProductListing'

function App() {
  return (
    <div>
      <Navbar />
      <div className="app-layout">
        <Sidebar />
        <ProductListing />
      </div>
    </div>
  )
}

export default App
