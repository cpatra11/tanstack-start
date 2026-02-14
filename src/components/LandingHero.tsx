import { useState, useEffect, useRef } from 'react'
import type { FC, CSSProperties } from 'react'
import { motion, AnimatePresence } from 'motion/react'

// --------------------------------------------
// Types
// --------------------------------------------
interface CelestialBody {
  name: string
  size: number
  orbit?: {
    a: number
    b: number
    tilt: number
    speed: number
  }
  moonOrbit?: {
    radius: number
    speed: number
  }
  house: number
  detail: CSSProperties['background']
  glow: string
  rings?: boolean
  bands?: boolean
  spots?: boolean
  craters?: boolean
  isEarth?: boolean
  isMoon?: boolean
}

// --------------------------------------------
// Planetary Data (Kalpurush alignment)
// --------------------------------------------
const celestialBodies: CelestialBody[] = [
  // Sun – centre, with enhanced glow
  {
    name: 'Sun',
    size: 54,
    house: 5,
    detail: 'radial-gradient(circle at 30% 30%, #FBBF24, #D97706)',
    glow: '0 0 120px #F59E0B, 0 0 200px #F59E0B80',
  },
  // Mars (Aries - 1st House)
  {
    name: 'Mars',
    size: 42,
    house: 1,
    detail: '#EF4444',
    glow: '0 0 60px #EF4444',
    orbit: { a: 210, b: 140, tilt: 0.7, speed: 0.7 },
    spots: true,
  },
  // Venus (Libra - 7th House)
  {
    name: 'Venus',
    size: 44,
    house: 7,
    detail: 'linear-gradient(45deg, #FDA4AF, #E879F9)',
    glow: '0 0 60px #F472B6',
    orbit: { a: 270, b: 190, tilt: -0.3, speed: 0.6 },
  },
  // Mercury (Gemini - 3rd House)
  {
    name: 'Mercury',
    size: 34,
    house: 3,
    detail: 'linear-gradient(145deg, #34D399, #059669)',
    glow: '0 0 40px #10B981',
    orbit: { a: 170, b: 110, tilt: 1.2, speed: 1.2 },
  },
  // Jupiter (Sagittarius - 9th House)
  {
    name: 'Jupiter',
    size: 56,
    house: 9,
    detail: 'radial-gradient(circle at 30% 30%, #FDE047, #B45309)',
    glow: '0 0 80px #FBBF24',
    orbit: { a: 340, b: 240, tilt: 0.8, speed: 0.3 },
    bands: true,
  },
  // Saturn (Capricorn - 10th House)
  {
    name: 'Saturn',
    size: 50,
    house: 10,
    detail: '#3B82F6',
    glow: '0 0 70px #3B82F6',
    orbit: { a: 400, b: 280, tilt: 1.5, speed: 0.2 },
    rings: true,
  },
  // Rahu (Scorpio - 8th House)
  {
    name: 'Rahu',
    size: 36,
    house: 8,
    detail: 'radial-gradient(circle at 60% 40%, #94A3B8, #334155)',
    glow: '0 0 45px #64748B',
    orbit: { a: 440, b: 320, tilt: -0.6, speed: 0.25 },
  },
  // Ketu (Taurus - 2nd House)
  {
    name: 'Ketu',
    size: 36,
    house: 2,
    detail: 'radial-gradient(circle at 30% 30%, #CBD5E1, #1E293B)',
    glow: '0 0 45px #94A3B8',
    orbit: { a: 440, b: 320, tilt: 2.5, speed: 0.25 },
  },
  // Moon – orbits Earth
  {
    name: 'Moon',
    size: 28,
    house: 4,
    detail: 'repeating-linear-gradient(45deg, #f1f5f9 0px, #cbd5e1 6px)',
    glow: '0 0 30px #CBD5E1',
    moonOrbit: { radius: 60, speed: 4 },
    craters: true,
    isMoon: true,
  },
  // Earth – orbits Sun, enhanced with clouds
  {
    name: 'Earth',
    size: 42, // even larger for prominence
    house: -1,
    detail: 'radial-gradient(circle at 30% 30%, #3B82F6, #1E3A8A)',
    glow: '0 0 100px #3B82F6', // stronger glow
    orbit: { a: 300, b: 210, tilt: 0.2, speed: 0.5 },
    isEarth: true,
  },
]

// DEEPER PLANET CENTROIDS (spacious inside houses)
const planetCentroids: Record<number, { x: number; y: number }> = {
  1: { x: 400, y: 220 },
  2: { x: 250, y: 150 },
  3: { x: 150, y: 250 },
  4: { x: 220, y: 400 },
  5: { x: 150, y: 550 },
  6: { x: 250, y: 650 },
  7: { x: 400, y: 580 },
  8: { x: 550, y: 650 },
  9: { x: 650, y: 550 },
  10: { x: 580, y: 400 },
  11: { x: 650, y: 250 },
  12: { x: 550, y: 150 },
}

// HOUSE NUMBER POSITIONS – properly separated for each house
const houseNumberPositions: Record<number, { x: number; y: number }> = {
  1:  { x: 400, y: 340 }, // Top diamond
  2:  { x: 210, y: 190 }, // Top‑left triangle (house 2)
  3:  { x: 190, y: 210 }, // Left‑top triangle (house 3)
  4:  { x: 340, y: 400 }, // Left diamond
  5:  { x: 190, y: 580 }, // Left‑bottom triangle (house 5)
  6:  { x: 210, y: 610 }, // Bottom‑left triangle (house 6)
  7:  { x: 400, y: 460 }, // Bottom diamond
  8:  { x: 580, y: 610 }, // Bottom‑right triangle (house 8)
  9:  { x: 610, y: 580 }, // Right‑bottom triangle (house 9)
  10: { x: 460, y: 400 }, // Right diamond
  11: { x: 610, y: 210 }, // Right‑top triangle (house 11)
  12: { x: 580, y: 190 }, // Top‑right triangle (house 12)
}

// --------------------------------------------
// Helper Components
// --------------------------------------------
const ArrowRight = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
)

const SparkleIcon = () => (
  <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
    <path d="M12 2L15 9H22L16 14L19 21L12 16.5L5 21L8 14L2 9H9L12 2Z" fill="#FCD34D" stroke="#B45309" />
  </svg>
)

// --------------------------------------------
// Main Component
// --------------------------------------------
const CosmicGenesis: FC = () => {
  const [phase, setPhase] = useState<'orbit' | 'forming' | 'alignment' | 'revealed'>('orbit')
  const [time, setTime] = useState(0)
  const requestRef = useRef<number>()

  const animate = (t: number) => {
    setTime(t * 0.001)
    requestRef.current = requestAnimationFrame(animate)
  }

  // Updated sequence: 6s orbits → 4s forming → 4s alignment → 2s pause → reveal (16s)
  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate)

    const timer1 = setTimeout(() => setPhase('forming'), 6000)    // 0–6s orbits
    const timer2 = setTimeout(() => setPhase('alignment'), 10000) // 6–10s forming
    const timer3 = setTimeout(() => setPhase('revealed'), 16000)  // 10–14s snap, then 2s pause, reveal at 16s

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current)
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [])

  const getEllipticalOffset = (a: number, b: number, tilt: number, angle: number) => {
    const x = a * Math.cos(angle)
    const y = b * Math.sin(angle)
    return {
      x: x * Math.cos(tilt) - y * Math.sin(tilt),
      y: x * Math.sin(tilt) + y * Math.cos(tilt),
    }
  }

  // Track Earth for Moon orbit
  const earthBody = celestialBodies.find(b => b.isEarth)!
  let earthX = 400,
    earthY = 400
  if (earthBody.orbit) {
    const { a, b, tilt, speed } = earthBody.orbit
    const offset = getEllipticalOffset(a, b, tilt, time * speed)
    earthX = 400 + offset.x
    earthY = 400 + offset.y
  }

  // Pre‑compute Moon position for the connecting line
  const moonBody = celestialBodies.find(b => b.isMoon)!
  let moonX = 400,
    moonY = 400
  if (phase === 'orbit' || phase === 'forming') {
    const angle = time * moonBody.moonOrbit!.speed
    moonX = earthX + moonBody.moonOrbit!.radius * Math.cos(angle)
    moonY = earthY + moonBody.moonOrbit!.radius * Math.sin(angle)
  }

  // Generate random asteroids
  const asteroids = useRef(
    [...Array(15)].map(() => ({
      x: Math.random() * 800,
      y: Math.random() * 800,
      size: Math.random() * 10 + 5,
      rotation: Math.random() * 360,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      rotSpeed: (Math.random() - 0.5) * 2,
    }))
  ).current

  return (
    <section className="relative w-full h-screen bg-[#020617] overflow-hidden flex items-center justify-center font-serif text-slate-200 selection:bg-amber-500/30">
      {/* Deep space background with extra stars, rocks, and asteroids */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#312e81_0%,_#020617_80%)] opacity-40" />
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-800/20 rounded-full blur-3xl"
          animate={{ x: [0, 30, -20, 0], y: [0, -40, 20, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-amber-700/20 rounded-full blur-3xl"
          animate={{ x: [0, -20, 30, 0], y: [0, 30, -30, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        />
        {/* Extra stars (300) with varied sizes */}
        {[...Array(300)].map((_, i) => (
          <motion.div
            key={`star-${i}`}
            className="absolute rounded-full bg-white"
            initial={{ opacity: 0.1 }}
            animate={{ opacity: [0.1, 0.8, 0.1] }}
            transition={{ duration: Math.random() * 5 + 2, repeat: Infinity }}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: Math.random() < 0.7 ? '2px' : Math.random() < 0.9 ? '3px' : '4px',
              height: Math.random() < 0.7 ? '2px' : Math.random() < 0.9 ? '3px' : '4px',
            }}
          />
        ))}
        {/* Asteroids and rocks – irregular shapes, rotating and drifting */}
        {asteroids.map((ast, i) => (
          <motion.div
            key={`ast-${i}`}
            className="absolute bg-[#4a4a4a] rounded-sm opacity-40"
            style={{
              width: ast.size,
              height: ast.size,
              x: ast.x,
              y: ast.y,
              rotate: ast.rotation,
              background: 'radial-gradient(circle at 30% 30%, #6b6b6b, #2d2d2d)',
              boxShadow: '0 0 5px rgba(0,0,0,0.5)',
            }}
            animate={{
              x: ast.x + ast.speedX * time * 20,
              y: ast.y + ast.speedY * time * 20,
              rotate: ast.rotation + ast.rotSpeed * time * 10,
            }}
            transition={{ duration: 0, repeat: Infinity, ease: 'linear' }}
          />
        ))}
        {/* Moving light sweep */}
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            background:
              'radial-gradient(circle at 20% 30%, rgba(255,215,0,0.2) 0%, transparent 50%)',
          }}
          animate={{
            x: ['-100%', '100%'],
            y: ['-50%', '50%'],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        />
        {/* Sun's glow overlay – makes nearby planets glow */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: '400px',
            height: '400px',
            left: '50%',
            top: '50%',
            marginLeft: '-200px',
            marginTop: '-200px',
            background: 'radial-gradient(circle, rgba(255,215,0,0.15) 0%, transparent 70%)',
            filter: 'blur(40px)',
            zIndex: 1,
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* MAIN STAGE (800x800) */}
      <div className="relative z-10 w-[800px] h-[800px] flex items-center justify-center scale-90 md:scale-100">
        {/* ORBITAL PATHS (visible during orbit and forming) */}
        {(phase === 'orbit' || phase === 'forming') && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {celestialBodies
              .filter(p => p.orbit)
              .map((planet, idx) => (
                <ellipse
                  key={`orbit-${idx}`}
                  cx="400"
                  cy="400"
                  rx={planet.orbit!.a}
                  ry={planet.orbit!.b}
                  transform={`rotate(${(planet.orbit!.tilt * 180) / Math.PI} 400 400)`}
                  fill="none"
                  stroke={planet.isEarth ? 'rgba(252,211,77,0.3)' : 'rgba(252,211,77,0.15)'}
                  strokeWidth={planet.isEarth ? 2 : 1.5}
                  strokeDasharray="4 6"
                />
              ))}
            {/* Moon's orbit around Earth – a dashed circle that moves with Earth */}
            {earthBody.isEarth && (
              <circle
                cx={earthX}
                cy={earthY}
                r={60}
                fill="none"
                stroke="rgba(252,211,77,0.3)"
                strokeWidth="2"
                strokeDasharray="4 6"
              />
            )}
          </svg>
        )}

        {/* Earth‑Moon connecting line (visible during orbit and forming) */}
        {(phase === 'orbit' || phase === 'forming') && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <line
              x1={earthX}
              y1={earthY}
              x2={moonX}
              y2={moonY}
              stroke="rgba(252,211,77,0.3)"
              strokeWidth="1"
              strokeDasharray="3 4"
            />
          </svg>
        )}

        {/* KUNDLI GRID – draws during forming phase */}
        <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none" viewBox="0 0 800 800">
          <defs>
            <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="100%" stopColor="#B45309" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <motion.path
            d="M100 100 L700 100 L700 700 L100 700 Z M100 100 L700 700 M700 100 L100 700 M100 400 L400 100 L700 400 L400 700 Z"
            fill="none"
            stroke="url(#gold)"
            strokeWidth="2"
            filter="url(#glow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={
              phase === 'orbit'
                ? { pathLength: 0, opacity: 0 }
                : phase === 'forming'
                ? { pathLength: 1, opacity: 0.9 }
                : { pathLength: 1, opacity: phase === 'revealed' ? 0.2 : 0.8 }
            }
            transition={{ duration: 4, ease: 'easeInOut' }}
          />

          {/* HOUSE NUMBERS – blurred during revealed phase */}
          {(phase === 'alignment' || phase === 'revealed') &&
            Object.entries(houseNumberPositions).map(([num, pos]) => (
              <text
                key={num}
                x={pos.x}
                y={pos.y}
                fill="#FDE047"
                fontSize="18"
                fontWeight="bold"
                textAnchor="middle"
                dominantBaseline="middle"
                style={{
                  textShadow: '0px 0px 4px #B45309',
                  filter: phase === 'revealed' ? 'blur(1.2px) brightness(0.85)' : 'none',
                }}
              >
                {num}
              </text>
            ))}
        </svg>

        {/* EARTH with cloud details (orbits Sun during orbit/forming, then fades) */}
        <motion.div
          className="absolute rounded-full z-20"
          style={{
            width: 42,
            height: 42,
            left: '50%',
            top: '50%',
            marginLeft: -21,
            marginTop: -21,
            background: 'radial-gradient(circle at 30% 30%, #3B82F6, #1E3A8A)',
            boxShadow: '0 0 100px #3B82F6',
          }}
          animate={{ x: earthX - 400, y: earthY - 400, scale: phase === 'orbit' || phase === 'forming' ? 1 : 0 }}
          transition={{ duration: 2 }}
        >
          {/* Cloud specks */}
          <div className="absolute w-2 h-2 bg-white/30 rounded-full top-2 left-2 blur-[1px]" />
          <div className="absolute w-3 h-3 bg-white/20 rounded-full bottom-2 right-3 blur-[1px]" />
          <div className="absolute w-1.5 h-1.5 bg-white/40 rounded-full top-3 right-4 blur-[1px]" />
        </motion.div>

        {/* PLANETS (including Moon) – labels visible from start */}
        {celestialBodies.map(planet => {
          if (planet.isEarth) return null

          let x = 400,
            y = 400

          if (phase === 'orbit' || phase === 'forming') {
            if (planet.name === 'Sun') {
              x = 400
              y = 400
            } else if (planet.isMoon && planet.moonOrbit) {
              // Moon orbits Earth – using current earthX/earthY ensures proper connection
              const angle = time * planet.moonOrbit.speed
              x = earthX + planet.moonOrbit.radius * Math.cos(angle)
              y = earthY + planet.moonOrbit.radius * Math.sin(angle)
            } else if (planet.orbit) {
              const { a, b, tilt, speed } = planet.orbit
              const angle = time * speed
              const offset = getEllipticalOffset(a, b, tilt, angle)
              x = 400 + offset.x
              y = 400 + offset.y
            }
          } else {
            // alignment or revealed: snap to planet centroid
            const target = planetCentroids[planet.house]
            if (target) {
              x = target.x
              y = target.y
            }
          }

          const targetX = x - 400
          const targetY = y - 400
          const blurStyle = phase === 'revealed' ? { filter: 'blur(1.2px) brightness(0.85)' } : {}
          const transitionProps =
            phase === 'alignment' ? { duration: 4, ease: [0.34, 1.56, 0.64, 1] } : { duration: 0 }

          // Sun gets a pulsing glow
          const sunGlow = planet.name === 'Sun' ? { scale: [1, 1.08, 1] } : {}

          return (
            <motion.div
              key={planet.name}
              className="absolute rounded-full flex items-center justify-center z-20"
              style={{
                width: planet.size,
                height: planet.size,
                left: '50%',
                top: '50%',
                marginLeft: -planet.size / 2,
                marginTop: -planet.size / 2,
                background: planet.detail,
                boxShadow: planet.glow,
                ...blurStyle,
              }}
              animate={{
                x: targetX,
                y: targetY,
                opacity: phase === 'revealed' ? 0.4 : 1,
                ...sunGlow,
              }}
              transition={{
                ...transitionProps,
                scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
              }}
            >
              {/* Surface details */}
              {planet.rings && (
                <div className="absolute w-[200%] h-[40%] border-2 border-slate-400/60 rounded-full top-[30%] left-[-50%] rotate-[20deg] shadow-[0_0_20px_#94a3b8]" />
              )}
              {planet.bands && (
                <>
                  <div className="absolute w-full h-[15%] top-[30%] left-0 bg-[#b87333]/60 rounded-full" />
                  <div className="absolute w-full h-[12%] top-[55%] left-0 bg-[#d4a76a]/60 rounded-full" />
                </>
              )}
              {planet.spots && (
                <div className="absolute w-[35%] h-[35%] top-[15%] right-[10%] bg-[#7f1d1d] rounded-full shadow-[0_0_10px_#b91c1c]" />
              )}
              {planet.craters && (
                <>
                  <div className="absolute w-[25%] h-[25%] top-[10%] left-[15%] bg-[#cbd5e1]/70 rounded-full shadow-inner" />
                  <div className="absolute w-[18%] h-[18%] bottom-[20%] right-[20%] bg-[#cbd5e1]/70 rounded-full shadow-inner" />
                </>
              )}
              {planet.name === 'Saturn' && (
                <div className="absolute w-[220%] h-[30%] border-2 border-slate-400 rounded-full top-[35%] left-[-60%] rotate-[25deg] shadow-[0_0_25px_#3B82F6]" />
              )}

              {/* Planet name label – visible from start, except Earth */}
              {planet.name !== 'Earth' && (
                <span className="absolute -bottom-8 text-[10px] font-bold text-amber-500 uppercase tracking-widest whitespace-nowrap">
                  {planet.name}
                </span>
              )}
            </motion.div>
          )
        })}

        {/* BRAND REVEAL – appears at 16s, 2 seconds after alignment ends */}
        <AnimatePresence>
          {phase === 'revealed' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, delay: 0.4, ease: 'easeOut' }}
              className="absolute z-50 flex flex-col items-center text-center w-full max-w-2xl px-4"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="mb-6 text-amber-400 drop-shadow-[0_0_50px_rgba(251,191,36,0.9)]"
              >
                <SparkleIcon />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 }}
                className="text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-amber-300 to-amber-600 mb-6 drop-shadow-2xl"
              >
                cozmic.ai
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.0 }}
                className="text-amber-100/60 text-sm tracking-[0.4em] uppercase mb-10 max-w-md"
              >
                The Universe is precise. <br /> Your guidance should be too.
              </motion.p>

              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: '100%', opacity: 1 }}
                transition={{ delay: 2.6, duration: 1.2, ease: 'circOut' }}
                className="relative group w-full max-w-md"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/40 to-purple-500/40 rounded-full blur-2xl opacity-75 group-hover:opacity-100 transition duration-1000" />
                <div className="relative flex items-center backdrop-blur-sm">
                  <input
                    type="email"
                    placeholder="Enter your email for cosmic access..."
                    className="w-full bg-slate-900/80 backdrop-blur-xl border border-amber-500/40 text-amber-50 placeholder:text-slate-500 rounded-full py-4 pl-6 pr-32 focus:outline-none focus:ring-4 focus:ring-amber-500/30 transition-all shadow-2xl text-lg"
                  />
                  <button className="absolute right-1.5 top-1.5 bottom-1.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold px-6 rounded-full flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-xl">
                    Join <ArrowRight size={18} />
                  </button>
                </div>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3.2 }}
                className="mt-8 text-xs text-slate-500 uppercase tracking-widest font-bold"
              >
                Limited Kalpurush Beta • 5,000+ Seekers Waiting
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none z-50 ring-1 ring-amber-500/10 rounded-full shadow-[inset_0_0_200px_rgba(0,0,0,0.9)]" />
    </section>
  )
}

export default CosmicGenesis