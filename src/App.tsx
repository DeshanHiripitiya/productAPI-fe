import { useEffect, useState } from 'react'

type Product = {
  id: number
  name: string
  price: number
}

// Replace this with the API URL and port from your .NET project.
const API_URL = 'http://localhost:5041/api/products'

function App() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function loadProducts() {
      try {
        const response = await fetch(API_URL, {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error(`API returned HTTP ${response.status}`)
        }

        const data = (await response.json()) as Product[]
        setProducts(data)
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          setError(err.message)
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    void loadProducts()

    return () => controller.abort()
  }, [])

  if (loading) return <p>Loading products...</p>
  if (error) return <p role="alert">Could not load products: {error}</p>

  return (
    <main>
      <h1>Products</h1>
      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <ul>
          {products.map((product) => (
            <li key={product.id}>
              {product.name} — ${product.price.toFixed(2)}
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}

export default App