"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function Home() {
  const [artistName, setArtistName] = useState("")
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const resultRef = useRef(null)

  // Scroll to results when they appear
  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }, [result])

  const handleCheckArtist = async () => {
    setError(null)
    setResult(null)

    if (!artistName.trim()) {
      setError("Please enter an artist name.")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/check-artist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ artistName }),
      })
      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Unknown error.")
      } else {
        setResult(data)
      }
    } catch (err) {
      console.error("Request error:", err)
      setError("Failed to call /api/check-artist")
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleCheckArtist()
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section with Gradient */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-green-900/30 to-black z-0"></div>
        <div className="relative z-10 px-4 py-16 sm:px-6 sm:py-24 lg:px-8 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-2">
              <span className="text-green-500">AI</span> Artist Detector
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-8">
              Discover if your favorite artist is an AI or is the real deal
            </p>

            <div className="max-w-md mx-auto">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-green-700 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-200"></div>
                <div className="relative flex items-center bg-black rounded-lg">
                  <svg
                    className="absolute left-3 text-gray-400 w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <input
                    type="text"
                    value={artistName}
                    onChange={(e) => setArtistName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter an artist name (e.g. Drake)"
                    className="pl-10 pr-4 py-6 bg-black border border-gray-800 rounded-lg text-white placeholder:text-gray-500 focus:ring-green-500 focus:border-green-500 w-full outline-none"
                  />
                </div>
              </div>

              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="mt-4">
                <button
                  onClick={handleCheckArtist}
                  disabled={loading}
                  className="w-full py-6 bg-green-500 hover:bg-green-600 text-black font-bold rounded-lg transition-all duration-200 flex items-center justify-center"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-black"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Analyzing...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                        />
                      </svg>
                      Analyze Artist
                    </span>
                  )}
                </button>
              </motion.div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-4 p-3 bg-red-900/50 border border-red-700 rounded-lg flex items-start"
                  >
                    <svg
                      className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-red-300 text-sm">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Results Section */}
      <AnimatePresence>
        {result && (
          <motion.div
            ref={resultRef}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="max-w-4xl mx-auto px-4 py-12"
          >
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
              <div className="p-6 pb-0">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                  {/* Artist Photo */}
                  {result.spotifyInfo?.photo ? (
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                      className="relative group"
                    >
                      <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-green-700 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-200"></div>
                      <img
                        src={result.spotifyInfo.photo || "/placeholder.svg"}
                        alt={result.artistName}
                        className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover relative"
                      />
                    </motion.div>
                  ) : (
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-zinc-800 flex items-center justify-center">
                      <svg className="h-16 w-16 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                        />
                      </svg>
                    </div>
                  )}

                  {/* Artist Info */}
                  <div className="flex-1 text-center md:text-left">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/30 text-green-400 border border-green-800 mb-2">
                      Analysis Result
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold mb-2">{result.artistName}</h2>

                    {/* Fake Score */}
                    <div className="mt-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm text-gray-400">AI Probability</span>
                        <span className="text-sm font-medium ml-auto">{result.fakeScore}%</span>
                      </div>
                      <div className="relative h-3 w-full bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className={`absolute top-0 left-0 h-full ${
                            result.fakeScore < 40
                              ? "bg-green-500"
                              : result.fakeScore < 70
                                ? "bg-yellow-500"
                                : "bg-red-500"
                          } transition-all duration-500`}
                          style={{ width: `${result.fakeScore}%` }}
                        ></div>
                      </div>
                      <div className="mt-2 text-sm">
                        <span
                          className={
                            result.fakeScore < 40
                              ? "text-green-500"
                              : result.fakeScore < 70
                                ? "text-yellow-500"
                                : "text-red-500"
                          }
                        >
                          {result.fakeScore < 40
                            ? "Likely Authentic"
                            : result.fakeScore < 70
                              ? "Possibly AI-Enhanced"
                              : "Likely AI-Generated"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {/* Analysis Text */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mb-6 bg-zinc-800/50 p-4 rounded-lg border border-zinc-700"
                >
                  <h3 className="text-lg font-semibold mb-2 text-green-400">Analysis</h3>
                  <p className="text-gray-300 leading-relaxed">{result.analysis}</p>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  {/* Spotify Information */}
                  {result.spotifyInfo && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700"
                    >
                      <h3 className="flex items-center text-lg font-semibold mb-3 text-green-400">
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                        </svg>
                        Spotify
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Followers</span>
                          <span className="font-medium">{result.spotifyInfo.followers.toLocaleString()}</span>
                        </div>
                        {result.spotifyInfo.monthlyListeners && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">Monthly Listeners</span>
                            <span className="font-medium">{result.spotifyInfo.monthlyListeners.toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Instagram Information */}
                  {result.instagramData && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700"
                    >
                      <h3 className="flex items-center text-lg font-semibold mb-3 text-green-400">
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                        </svg>
                        Instagram
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Followers</span>
                          <span className="font-medium">
                            {result.instagramData.followers ? result.instagramData.followers.toLocaleString() : "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Verified</span>
                          <span className="font-medium flex items-center">
                            {result.instagramData.verified ? (
                              <svg
                                className="h-4 w-4 text-green-500 mr-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <svg
                                className="h-4 w-4 text-red-500 mr-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            )}
                            {result.instagramData.verified ? "Yes" : "No"}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Wikipedia Information */}
                  {result.wikiData && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700"
                    >
                      <h3 className="flex items-center text-lg font-semibold mb-3 text-green-400">
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12.09 13.119c-.936 1.932-2.217 4.548-2.853 5.728-.616 1.074-1.127.931-1.532.029-1.406-3.321-4.293-9.144-5.651-12.409-.251-.601-.441-.987-.619-1.139-.181-.15-.554-.24-1.122-.271C.103 5.033 0 4.982 0 4.898v-.455l.052-.045c.924-.005 5.401 0 5.401 0l.051.045v.434c0 .084-.103.135-.208.157-.966.135-1.103.223-1.103.511 0 .271.208.906.570 1.703 1.108 2.445 3.124 7.023 3.821 8.452l.331-.669c.694-1.398 1.122-2.445 1.122-3.273 0-1.544-.532-2.207-1.594-2.445-.233-.045-.468-.09-.595-.09-.313 0-.522.068-.522.181v.324c0 .232-.104.349-.313.349-.233 0-.752-.117-1.101-.349-.468-.291-.789-.517-.789-.669 0-.068.052-.117.128-.117.077-.005.272-.005.376-.005 1.217 0 3.124.674 3.927 1.505.7.068.104.181.104.349-.104 1.295-.94 3.273-2.109 5.701l.879 1.721c1.39-3.273 3.28-8.227 3.28-8.227.233-.674.182-.906-.051-1.139-.128-.135-.233-.271-.233-.451 0-.068.052-.117.128-.117h3.280c.233 0 .441.021.441.103v.479c0 .083-.104.135-.207.157-.877.134-1.775 1.059-2.652 2.704-.49.916-1.383 2.945-2.362 5.175.4.895.7 1.48 1.007 1.763.285.271.570.355.936.355.774 0 1.485-.517 2.109-1.139v.355c0 .09-.052.181-.156.271-1.562.723-3.052.906-4.137.906-.981 0-1.804-.271-2.362-.764-.629-.526-1.343-1.398-2.047-2.643z" />
                        </svg>
                        Wikipedia
                      </h3>
                      {result.wikiData.hasWikipedia ? (
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Page Title</span>
                            <span className="font-medium">{result.wikiData.pageTitle}</span>
                          </div>
                          <div className="mt-2">
                            <a
                              href={result.wikiData.pageUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-green-400 hover:text-green-300 transition-colors"
                            >
                              View Wikipedia Article
                              <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                ></path>
                              </svg>
                            </a>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center text-gray-400">
                          <svg
                            className="h-4 w-4 text-red-500 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                          No Wikipedia page detected
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} Sola, A+ please?</p>
      </footer>
    </div>
  )
}

