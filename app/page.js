'use client';

import { useState } from 'react';

export default function Home() {
  const [artistName, setArtistName] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheckArtist = async () => {
    setError(null);
    setResult(null);

    if (!artistName.trim()) {
      setError('Please enter an artist name.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/check-artist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ artistName }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Unknown error.');
      } else {
        setResult(data);
      }
    } catch (err) {
      console.error('Request error:', err);
      setError('Failed to call /api/check-artist');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-gray-900 text-gray-100 min-h-screen flex flex-col items-center p-8">
      <h1 className="text-4xl font-bold mb-6">Fake Spotify Artist Detector</h1>
      <div className="flex flex-col items-center w-full max-w-md">
        <input
          type="text"
          value={artistName}
          onChange={(e) => setArtistName(e.target.value)}
          placeholder="Enter an artist name (e.g. Drake)"
          className="w-full p-2 mb-4 rounded bg-gray-800 text-white outline-none"
        />
        <button
          onClick={handleCheckArtist}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          {loading ? 'Checking...' : 'Check Artist'}
        </button>
      </div>

      {error && (
        <div className="mt-4 p-4 border border-red-500 text-red-300 rounded">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-6 p-4 w-full max-w-md bg-gray-800 rounded shadow">
          <h2 className="text-3xl text-center font-bold mb-6">Analysis Result</h2>
          
          <div className="flex flex-col items-center mb-6">
            {result.spotifyInfo?.photo && (
              <img
                src={result.spotifyInfo.photo}
                alt={result.artistName}
                className="w-24 h-24 rounded-full object-cover shadow-lg mb-4"
              />
            )}
            <h3 className="text-2xl font-bold">{result.artistName}</h3>

          </div>


          <p className="mb-3">
            <strong>Analysis:</strong>
            <br /> {result.analysis}
          </p>


          <div className="flex justify-between items-center mt-3 mb-3 bg-gray-700 rounded p-4">
            <div className="w-1/6"></div>
            <div className="text-center">
              <div className="text-xl font-bold mb-1">Fake Score</div>
              <div
                className={`text-4xl font-bold ${
                  result.fakeScore < 40
                    ? 'text-green-500'
                    : result.fakeScore < 70
                    ? 'text-yellow-500'
                    : 'text-red-500'
                }`}
              >
                {result.fakeScore}
              </div>
              <div className="text-sm text-gray-400">out of 100</div>
            </div>
            <div className="w-1/6 flex justify-end items-center">
              <div className="bg-gray-800 rounded h-24 w-6 relative overflow-hidden">
                <div
                  className={`absolute bottom-0 w-full ${
                    result.fakeScore < 40
                      ? 'bg-green-500'
                      : result.fakeScore < 70
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}
                  style={{ height: `${result.fakeScore}%` }}
                ></div>
              </div>
            </div>
          </div>

          {result.spotifyInfo && (
            <div className="mt-4 bg-gray-700 p-3 rounded">
              <h3 className="font-bold mb-2">Spotify Information</h3>
              <p className="mb-1">
                <strong>Followers:</strong>{' '}
                {result.spotifyInfo.followers.toLocaleString()}
              </p>
              {result.spotifyInfo.monthlyListeners && (
                <p className="mb-1">
                  <strong>Monthly Listeners:</strong>{' '}
                  {result.spotifyInfo.monthlyListeners.toLocaleString()}
                </p>
              )}
            </div>
          )}

          {result.wikiData && (
            <div className="mt-4 bg-gray-700 p-3 rounded">
              <h3 className="font-bold">Wikipedia Presence </h3>
              {result.wikiData.hasWikipedia ? (
                <div>
                  <p>
                    <strong>Page Title:</strong> {result.wikiData.pageTitle}
                  </p>
                  <a
                    href={result.wikiData.pageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 underline"
                  >
                    View Wikipedia Article
                  </a>
                </div>
              ) : (
                <p>No Wikipedia page detected. ❌</p>
              )}
            </div>
          )}
        </div>
      )}
    </main>
  );
}
