import Toile from 'toile-canvas'
import { useState, useRef } from 'react'
import * as React from 'react'
import Canvas from './GalleryCanvas'
import { blue, red, violet } from '@radix-ui/colors'
import { spirografhLaps, spirografhLapsFromP } from '../../utils/spirographs'

interface HypocycloidProps {
  canvasID: string
  p: number
  k?: number
  R?: number
  color?: string
}

const Hypocycloid: React.FC<HypocycloidProps> = ({ canvasID, p, k = 0, R=100, color=violet.violet9 }) => {
  const [play, setPlay] = useState(true)
  const [hide, setHide] = useState(true)
  const points = useRef<{ x: number; y: number }[]>([])
  const angle = useRef(0)

  const _draw = (draw: Toile, loop: boolean) => {
    draw.Fcol = ''
    draw.origin(draw.width / 2, draw.height / 2)
    draw.Swidth = 2
    draw.ctx.lineJoin = 'round'
    const r1 = R
    const r2 = r1 / p
    return () => {
      if (angle.current >= spirografhLapsFromP(r1, p) * Math.PI * 2) {
        setPlay(false)
        angle.current = spirografhLapsFromP(r1, p) * Math.PI * 2
      }
      draw.clear()
      draw.Scol = color
      if (play) {
        angle.current += 0.05
      }
      const _k = k === 0 ? r2 : k
      const a = angle.current
      const cx = (r1 - r2) * Math.cos(a)
      const cy = (r1 - r2) * Math.sin(a)
      if (play) {
        points.current.push({
          x: cx + _k * Math.cos(a * (1 - r1 / r2)),
          y: cy + _k * Math.sin(a * (1 - r1 / r2)),
        })
      }
      draw.lines(points.current)
      if (!hide) {
        draw.Scol = blue.blue9
        draw.circle(0, 0, r1)
        draw.Scol = red.red9
        draw.circle(cx, cy, r2)
        draw.line(
          cx,
          cy,
          cx + _k * Math.cos(a * (1 - r1 / r2)),
          cy + _k * Math.sin(a * (1 - r1 / r2))
        )
      }
    }
  }
  return (
    <Canvas
      drawFunction={_draw}
      loop={play}
      hide={hide}
      canvasID={canvasID}
      onPlayButton={() => {
        if (angle.current >= spirografhLapsFromP(R, p) * Math.PI * 2) {
          angle.current = 0
          points.current = []
        }
        setPlay(!play)
      }}
      onHideButton={() => setHide(!hide)}
      onResetButton={() => {
        setPlay(true)
        angle.current = 0
        points.current = []
      }}
      info={`p: ${p}`}
    />
  )
}
export default Hypocycloid
