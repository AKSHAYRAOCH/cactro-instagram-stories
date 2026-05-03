import { useState, useCallback, useRef, useEffect } from 'react'

const STORY_DURATION = 5000

export default function StoryViewer() {
  const [stories, setStories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [storyIndex, setStoryIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [imageLoading, setImageLoading] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startTimeRef = useRef(Date.now())

  useEffect(() => {
    fetch('/stories.json')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch stories')
        return res.json()
      })
      .then((data) => {
        setStories(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  const goToNext = useCallback(() => {
    if (storyIndex < stories.length - 1) {
      setStoryIndex((prev) => prev + 1)
    } else {
      setIsOpen(false)
    }
  }, [storyIndex, stories.length])

  const goToPrev = useCallback(() => {
    if (storyIndex > 0) {
      setStoryIndex((prev) => prev - 1)
    }
  }, [storyIndex])

  useEffect(() => {
    if (!isOpen) return

    startTimeRef.current = Date.now()
    setProgress(0)
    setImageLoading(true)

    if (timerRef.current) clearInterval(timerRef.current)

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current
      const newProgress = Math.min(elapsed / STORY_DURATION, 1)
      setProgress(newProgress)

      if (newProgress >= 1) {
        if (timerRef.current) clearInterval(timerRef.current)
        goToNext()
      }
    }, 16)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [storyIndex, isOpen, goToNext])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-800 rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Loading stories...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-3">
          <p className="text-red-500">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-sm text-gray-600 underline"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  if (!isOpen) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <h1 className="text-2xl font-bold">Cactro Instagram Stories</h1>
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scroll-smooth pb-2 flex-nowrap scrollbar-hide"
          style={{ scrollbarWidth: 'none' }}
        >
          {stories.map((story: any, i: number) => (
            <button
              key={i}
              onClick={() => {
                setStoryIndex(i)
                setIsOpen(true)
              }}
              className="flex flex-col items-center gap-1 flex-shrink-0"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 p-[2px]">
                <img
                  src={story.avatar}
                  alt={story.name}
                  className="w-full h-full rounded-full object-cover border-2 border-white"
                />
              </div>
              <span className="text-xs text-gray-500">{story.name}</span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  const currentStory = stories[storyIndex]

  return (
    <div className="relative w-full h-screen bg-black">
      {imageLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      )}

      <img
        src={currentStory.image}
        alt={currentStory.name}
        className="w-full h-full object-cover"
        onLoad={() => setImageLoading(false)}
      />

      <div
        className="absolute inset-y-0 left-0 w-1/3 cursor-pointer"
        onClick={goToPrev}
      />
      <div
        className="absolute inset-y-0 right-0 w-2/3 cursor-pointer"
        onClick={goToNext}
      />

      <div className="absolute top-0 left-0 right-0 p-3">
        <div className="w-full h-0.5 bg-white/30 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full"
            style={{
              width: `${progress * 100}%`,
            }}
          />
        </div>
      </div>

      <button
        onClick={() => setIsOpen(false)}
        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white"
      >
        ✕
      </button>
    </div>
  )
}
