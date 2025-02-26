// pages/_app.js
import React, { useState } from 'react'
import Navbar from '../components/navbar'
import Modal from '../components/modal'
import Layout from '../components/layout'


// If your global styles are in pages/style.css or a styles/global.css, import them here:
import '../pages/style.css'  // or wherever your global CSS actually lives

export default function MyApp({ Component, pageProps }) {
  // Track sign-in modal open/close at the global level
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      {/* 1) Render the single global Navbar at the top */}
      <Navbar setIsModalOpen={setIsModalOpen} />

      {/* 2) The global sign-in Modal, so user can sign in from any page */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onLogin={() => setIsModalOpen(false)}
      />

      {/* 3) Then render whichever page the user is on */}
      <Component {...pageProps} />
    </>
  )
}