import './Home.css'
import ProductCard from './ProductCard'
import productImages from '../utils/productImages'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

interface Recommendation {
  brand: string
  category: string
  subcategory: string
  similarity?: number
  rating?: number
  reason: string
}

export default function Home() {
  const [customerId, setCustomerId] = useState('')
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const fetchRecommendations = async () => {
    setError('')
    setMessage('')
    if (!customerId.trim()) {
      setError('⚠️ Please enter a valid Customer ID.')
      return
    }

    setLoading(true)
    try {
      const res = await axios.post('http://localhost:5000/recommend', {
        customer_id: customerId.trim(),
      })
      setRecommendations(res.data.recommendations)
      setMessage(res.data.message || '🛍️ Personalized Recommendations Generated!')
    } catch {
      setError('⚠️ Unable to fetch recommendations. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-amazonLight text-gray-800">
      {/* Navbar */}
      <nav className="bg-amazonBlue text-white px-6 py-4 shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1
            className="text-2xl font-bold tracking-wider cursor-pointer"
            onClick={() => navigate('/')}
          >
            🛍️ ShopSage AI
          </h1>
          <div className="space-x-6">
            <button onClick={() => navigate('/about')} className="hover:text-amazonYellow font-medium">About</button>
            <button onClick={() => navigate('/contact')} className="hover:text-amazonYellow font-medium">Contact</button>
            <button onClick={() => navigate('/support')} className="hover:text-amazonYellow font-medium">Support</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-amazonYellow py-16 text-center">
        <h2 className="text-4xl font-bold mb-4 text-gray-900">Your Smart Shopping Assistant</h2>
        <p className="text-gray-700 text-lg max-w-2xl mx-auto">
          Discover curated product recommendations tailored just for you.
        </p>
      </section>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg -mt-8 z-10 relative">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-semibold mb-2">Enter Your Customer ID</h3>
          <p className="text-gray-500">We’ll generate AI-powered suggestions from your past purchases.</p>
        </div>

        {/* Input and Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
          <input
            type="text"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            placeholder="e.g. CUST12345"
            className="border border-gray-300 px-4 py-2 rounded-md w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-amazonYellow"
          />
          <button
            onClick={fetchRecommendations}
            disabled={loading}
            className="bg-amazonYellow text-black hover:bg-yellow-400 px-6 py-2 rounded-md font-semibold transition disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Get Recommendations'}
          </button>
          <button
            onClick={() => {
              if (!customerId.trim()) {
                setError('⚠️ Please enter a valid Customer ID.')
                return
              }
              setError('')
              navigate(`/history/${customerId.trim()}`)
            }}
            className="bg-gray-900 text-white hover:bg-gray-800 px-6 py-2 rounded-md font-semibold"
          >
            View History
          </button>
        </div>

        {/* Messages */}
        <div className="mt-4 text-center">
          {loading && <p className="text-gray-500 animate-pulse">⏳ Fetching recommendations...</p>}
          {error && <p className="text-red-600 font-medium">{error}</p>}
          {message && <p className="text-green-600 font-medium">{message}</p>}
        </div>

        {/* Product Cards View */}
<div className="mt-8 overflow-x-auto px-4">
  <div className="flex space-x-4 py-4 whitespace-nowrap">
    {recommendations.map((rec, i) => {
      const imageUrl =
        productImages[rec.subcategory.toLowerCase()] ||
        `https://source.unsplash.com/200x180/?${rec.subcategory},product`

      return (
        <ProductCard
          key={i}
          brand={rec.brand}
          category={rec.category}
          subcategory={rec.subcategory}
          similarity={rec.similarity}
          rating={rec.rating}
          reason={rec.reason}
          imageUrl={imageUrl}
          price={(Math.random() * 1000 + 499).toFixed(0)}
        />
      )
    })}
  
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-amazonBlue text-white text-center py-4 mt-12">
        <p className="text-sm">© 2025 Recommendo AI — Smart Shopping, Powered by You.</p>
      </footer>
    </div>
  )
}