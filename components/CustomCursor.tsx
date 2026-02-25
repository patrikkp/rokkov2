'use client'

import { useEffect, useRef, useState } from 'react'

export default function CustomCursor() {
  const [isDesktop, setIsDesktop] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 992)
    }

    checkDesktop()
    window.addEventListener('resize', checkDesktop)

    return () => window.removeEventListener('resize', checkDesktop)
  }, [])

  useEffect(() => {
    if (!isDesktop) return

    let mouseX = 0
    let mouseY = 0
    let dotX = 0
    let dotY = 0
    let ringX = 0
    let ringY = 0

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      if (!isVisible) setIsVisible(true)
    }

    const handleMouseLeave = () => setIsVisible(false)
    const handleMouseEnter = () => setIsVisible(true)

    const animate = () => {
      dotX = mouseX
      dotY = mouseY
      ringX = mouseX
      ringY = mouseY

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${dotX}px, ${dotY}px) translate(-50%, -50%)`
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`
      }

      requestAnimationFrame(animate)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseenter', handleMouseEnter)
    
    const animationId = requestAnimationFrame(animate)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseenter', handleMouseEnter)
      cancelAnimationFrame(animationId)
    }
  }, [isDesktop, isVisible])

  if (!isDesktop || !isVisible) return null

  return (
    <>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[10000] mix-blend-difference will-change-transform"
      >
        <div className="w-2 h-2 bg-accent rounded-full" />
      </div>
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-[10000] will-change-transform"
      >
        <div className="w-8 h-8 border border-accent/50 rounded-full" />
      </div>
    </>
  )
}
