'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
}

interface Receipt {
  x: number
  y: number
  vx: number
  vy: number
  rotation: number
  rotationSpeed: number
  size: number
  opacity: number
}

export default function ParticlesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let particles: Particle[] = []
    let receipts: Receipt[] = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initParticles()
      initReceipts()
    }

    const initParticles = () => {
      particles = []
      const particleCount = Math.floor((canvas.width * canvas.height) / 12000)
      
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          size: Math.random() * 2 + 1,
          opacity: Math.random() * 0.5 + 0.4,
        })
      }
    }

    const initReceipts = () => {
      receipts = []
      const receiptCount = Math.floor((canvas.width * canvas.height) / 80000)
      
      for (let i = 0; i < receiptCount; i++) {
        receipts.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.02,
          size: Math.random() * 20 + 25,
          opacity: Math.random() * 0.15 + 0.2,
        })
      }
    }

    const drawReceipt = (receipt: Receipt) => {
      ctx.save()
      ctx.translate(receipt.x, receipt.y)
      ctx.rotate(receipt.rotation)
      ctx.globalAlpha = receipt.opacity
      
      const width = receipt.size * 0.5
      const height = receipt.size * 1.3
      
      ctx.fillStyle = 'rgba(250, 250, 250, 0.9)'
      ctx.fillRect(-width / 2, -height / 2, width, height)
      
      const zigzagSize = 3
      const zigzagCount = Math.floor(width / (zigzagSize * 2))
      
      ctx.beginPath()
      ctx.moveTo(-width / 2, -height / 2)
      for (let i = 0; i <= zigzagCount; i++) {
        const x = -width / 2 + (i * zigzagSize * 2)
        const y = -height / 2 + (i % 2 === 0 ? -zigzagSize : 0)
        ctx.lineTo(x, y)
      }
      ctx.lineTo(width / 2, -height / 2)
      ctx.lineTo(width / 2, -height / 2 + 2)
      for (let i = zigzagCount; i >= 0; i--) {
        const x = -width / 2 + (i * zigzagSize * 2)
        const y = -height / 2 + (i % 2 === 0 ? -zigzagSize : 0) + 2
        ctx.lineTo(x, y)
      }
      ctx.closePath()
      ctx.fillStyle = 'rgba(220, 220, 220, 0.8)'
      ctx.fill()
      
      ctx.beginPath()
      ctx.moveTo(-width / 2, height / 2)
      for (let i = 0; i <= zigzagCount; i++) {
        const x = -width / 2 + (i * zigzagSize * 2)
        const y = height / 2 + (i % 2 === 0 ? zigzagSize : 0)
        ctx.lineTo(x, y)
      }
      ctx.lineTo(width / 2, height / 2)
      ctx.lineTo(width / 2, height / 2 - 2)
      for (let i = zigzagCount; i >= 0; i--) {
        const x = -width / 2 + (i * zigzagSize * 2)
        const y = height / 2 + (i % 2 === 0 ? zigzagSize : 0) - 2
        ctx.lineTo(x, y)
      }
      ctx.closePath()
      ctx.fillStyle = 'rgba(220, 220, 220, 0.8)'
      ctx.fill()
      
      const lineSpacing = height / 10
      ctx.strokeStyle = 'rgba(100, 100, 100, 0.3)'
      ctx.lineWidth = 0.5
      for (let i = 1; i < 6; i++) {
        const y = -height / 2 + lineSpacing * i
        ctx.beginPath()
        ctx.moveTo(-width / 2 + 4, y)
        ctx.lineTo(width / 2 - 4, y)
        ctx.stroke()
      }
      
      const barcodeY = height / 2 - 8
      const barcodeHeight = 6
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
      for (let i = 0; i < 12; i++) {
        const barWidth = Math.random() > 0.5 ? 1.5 : 0.8
        const x = -width / 2 + 4 + (i * (width - 8) / 12)
        ctx.fillRect(x, barcodeY, barWidth, barcodeHeight)
      }
      
      ctx.restore()
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      receipts.forEach((receipt) => {
        receipt.x += receipt.vx
        receipt.y += receipt.vy
        receipt.rotation += receipt.rotationSpeed

        if (receipt.x < -50) receipt.x = canvas.width + 50
        if (receipt.x > canvas.width + 50) receipt.x = -50
        if (receipt.y < -50) receipt.y = canvas.height + 50
        if (receipt.y > canvas.height + 50) receipt.y = -50

        drawReceipt(receipt)
      })

      particles.forEach((particle) => {
        particle.x += particle.vx
        particle.y += particle.vy

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 49, 49, ${particle.opacity})`
        ctx.fill()
      })

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 150) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(255, 49, 49, ${0.3 * (1 - distance / 150)})`
            ctx.lineWidth = 1
            ctx.stroke()
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    resize()
    window.addEventListener('resize', resize)
    animate()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.7 }}
    />
  )
}
