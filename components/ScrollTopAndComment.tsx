'use client'

import siteMetadata from '@/data/siteMetadata'
import { useEffect, useState } from 'react'

const ScrollTopAndComment = () => {
  const [show, setShow] = useState(false)
  const [scrollPercentage, setScrollPercentage] = useState(0)

  useEffect(() => {
    const handleWindowScroll = () => {
      // Tampilkan tombol jika scroll lebih dari 50px
      if (window.scrollY > 50) setShow(true)
      else setShow(false)

      // Hitung persentase scroll
      const scrollTop = window.scrollY
      const windowHeight = window.innerHeight
      const docHeight = document.documentElement.scrollHeight
      const totalScroll = docHeight - windowHeight
      const percentage = (scrollTop / totalScroll) * 100
      setScrollPercentage(percentage)
    }

    window.addEventListener('scroll', handleWindowScroll)
    return () => window.removeEventListener('scroll', handleWindowScroll)
  }, [])

  const handleScrollTop = () => {
    window.scrollTo({ top: 0 })
  }

  return (
    <div
      className={`fixed bottom-8 right-8 hidden flex-col gap-3 ${show ? 'md:flex' : 'md:hidden'}`}
    >
      {/* Tombol Persentase Scroll */}
      <div className="relative flex items-center justify-center bg-white dark:bg-black rounded-full">
        <svg className="h-10 w-10 transform rotate-[-90deg]" viewBox="0 0 36 36">
          {/* Lingkaran Background */}
          <circle
            cx="18"
            cy="18"
            r="15.9155"
            fill="none"
            className="stroke-gray-200 dark:stroke-gray-700"
            strokeWidth="2"
          />
          {/* Lingkaran Progress */}
          <circle
            cx="18"
            cy="18"
            r="15.9155"
            fill="none"
            className="stroke-gray-500 dark:stroke-gray-400"
            strokeWidth="2"
            strokeDasharray="100"
            strokeDashoffset={100 - scrollPercentage}
            strokeLinecap="round"
          />
        </svg>
        {/* Teks Persentase */}
        <span className="absolute text-xs text-gray-500 dark:text-gray-400">
          {Math.round(scrollPercentage)}%
        </span>
      </div>

      {/* Tombol Scroll to Top */}
      <button
        aria-label="Scroll To Top"
        onClick={handleScrollTop}
        className="rounded-full bg-gray-200 p-2 text-gray-500 transition-all hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
      >
        <svg className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  )
}

export default ScrollTopAndComment