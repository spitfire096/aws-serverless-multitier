import React from 'react'
import './sidebar.css'

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <h3>Department</h3>
        <ul>
          <li><label><input type="radio" name="department" /> All</label></li>
          <li><label><input type="radio" name="department" /> Lorem Ipsum</label></li>
          <li><label><input type="radio" name="department" /> Dolor Sit Amet</label></li>
          <li><label><input type="radio" name="department" /> Consectetur</label></li>
        </ul>
      </div>

      <div className="sidebar-section">
        <h3>Brands</h3>
        <ul>
          <li><label><input type="checkbox" /> Lorem Brand</label></li>
          <li><label><input type="checkbox" /> Ipsum Brand</label></li>
          <li><label><input type="checkbox" /> Placeholder Co.</label></li>
        </ul>
      </div>

      <div className="sidebar-section">
        <h3>Customer Reviews</h3>
        <ul>
          <li>★★★★★ & up</li>
          <li>★★★★ & up</li>
          <li>★★★ & up</li>
          <li>★★ & up</li>
        </ul>
      </div>

      <div className="sidebar-section">
        <h3>Price</h3>
        <ul>
          <li><label><input type="radio" name="price" /> Under $25</label></li>
          <li><label><input type="radio" name="price" /> $25 to $50</label></li>
          <li><label><input type="radio" name="price" /> $50 to $100</label></li>
        </ul>
      </div>

      <div className="sidebar-section">
        <h3>Discount</h3>
        <ul>
          <li><label><input type="checkbox" /> 10% off or more</label></li>
          <li><label><input type="checkbox" /> 25% off or more</label></li>
          <li><label><input type="checkbox" /> 50% off or more</label></li>
        </ul>
      </div>
    </aside>
  )
}

export default Sidebar
