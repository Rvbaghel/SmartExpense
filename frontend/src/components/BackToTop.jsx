import React, { useState, useEffect } from 'react'

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <button 
      className={`back-to-top ${isVisible ? 'd-flex' : 'd-none'}`}
      onClick={scrollToTop} 
      aria-label="Back to top"
      style={{ display: isVisible ? 'flex' : 'none' }}
    >
      <i className="bi bi-arrow-up"></i>
    </button>
  )
}

export default BackToTop