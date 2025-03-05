// components/layout.js
import React from 'react'
import Footer from './footer'

const Layout = ({ children }) => {
  return (
    <div className="layout-container">
      <main>{children}</main>
      <Footer />
    </div>
  )
}

export default Layout