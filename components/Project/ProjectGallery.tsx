"use client"

import { useCallback, useState } from "react"
import Image from "next/image"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"

export function ProjectGallery({
  images,
  title,
}: {
  images: string[]
  title: string
}) {
  const reduce = useReducedMotion()
  const [index, setIndex] = useState(0)

  const go = useCallback(
    (next: number) => {
      if (!images.length) return
      setIndex(((next % images.length) + images.length) % images.length)
    },
    [images.length],
  )

  if (!images.length) {
    return (
      <div className="flex aspect-[16/10] items-center justify-center border border-white/10 bg-neutral-900 text-neutral-600">
        No image
      </div>
    )
  }

  const current = images[index]!
  const spring = reduce
    ? { duration: 0.16 }
    : { type: "spring" as const, bounce: 0, duration: 0.4 }

  return (
    <div className="space-y-3">
      <div className="relative aspect-[16/10] overflow-hidden border border-white/10 bg-neutral-900">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={current}
            className="absolute inset-0"
            initial={{ opacity: 0, x: reduce ? 0 : 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: reduce ? 0 : -24 }}
            transition={spring}
            drag={images.length > 1 && !reduce ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.18}
            onDragEnd={(_, info) => {
              if (info.offset.x < -64 || info.velocity.x < -400) go(index + 1)
              if (info.offset.x > 64 || info.velocity.x > 400) go(index - 1)
            }}
          >
            <Image
              key={`${index}-${current}`}
              src={current}
              alt={`${title} ${index + 1}`}
              fill
              priority
              sizes="(max-width:1024px) 100vw, 66vw"
              className="pointer-events-none object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {images.length > 1 ? (
          <>
            <button
              type="button"
              aria-label="Previous image"
              onClick={() => go(index - 1)}
              className="absolute left-3 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white backdrop-blur-md transition-transform active:scale-95"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              aria-label="Next image"
              onClick={() => go(index + 1)}
              className="absolute right-3 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white backdrop-blur-md transition-transform active:scale-95"
            >
              <ChevronRight size={18} />
            </button>
            <p className="absolute bottom-3 right-3 rounded-full bg-black/50 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-white backdrop-blur-md">
              {index + 1} / {images.length}
            </p>
          </>
        ) : null}
      </div>

      {images.length > 1 ? (
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
          {images.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              aria-label={`Show image ${i + 1}`}
              aria-current={i === index ? true : undefined}
              onClick={() => setIndex(i)}
              className={`relative aspect-[16/10] overflow-hidden border transition-colors ${
                i === index ? "border-white" : "border-white/15"
              }`}
            >
              <Image src={src} alt="" fill sizes="160px" className="object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
