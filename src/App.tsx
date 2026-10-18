import { useEffect, useState } from 'react'
import './App.css'
import { ProductForm } from './features/products/components/ProductForm'
import { deleteProduct, getProducts } from './features/products/services/productService'
import type { Product } from './features/products/types/product'

function App() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [productToEdit, setProductToEdit] = useState<Product | null>(null)

  async function loadProducts(signal?: AbortSignal) {
    try {
      setError('')
      setProducts(await getProducts(signal))
    } catch (loadError) {
      if (!(loadError instanceof Error && loadError.name === 'AbortError')) {
        setError(loadError instanceof Error ? loadError.message : 'Could not load products.')
      }
    } finally {
      if (!signal?.aborted) setLoading(false)
    }
  }

  useEffect(() => {
    const controller = new AbortController()

    const fetchProducts = async () => {
      await loadProducts(controller.signal)
    }

    void fetchProducts()

    return () => controller.abort()
  }, [])

  return (
    <main className="app-shell">
      <header className="page-header">
        <div>
          <p className="eyebrow">Inventory workspace</p>
          <h1>Products</h1>
          <p className="page-intro">Create and manage the products in your catalog.</p>
        </div>
        <div className="product-count">
          <strong>{products.length}</strong>
          <span>{products.length === 1 ? 'product' : 'products'}</span>
        </div>
      </header>

      <section className="content-grid" aria-label="Product management">
        <ProductForm
          key={productToEdit?.id ?? 'new'}
          onCreated={() => void loadProducts()}
          productToEdit={productToEdit}
          onCancelEdit={() => setProductToEdit(null)}
        />

        <section className="product-list-panel" aria-labelledby="product-list-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Catalog</p>
              <h2 id="product-list-title">All products</h2>
            </div>
            {!loading && <span className="list-status">Updated just now</span>}
          </div>

          {loading && <p className="empty-state">Loading products...</p>}
          {!loading && error && (
            <div className="empty-state error-state">
              <p role="alert">Could not load products: {error}</p>
              <button className="secondary-button" onClick={() => void loadProducts()}>
                Try again
              </button>
            </div>
          )}
          {!loading && !error && products.length === 0 && (
            <p className="empty-state">No products yet. Use the form to add your first product.</p>
          )}
          {!loading && !error && products.length > 0 && (
            <ul className="product-list">
              {products.map((product) => (
                <li className="product-row" key={product.id}>
                  <span className="product-icon" aria-hidden="true">
                    {product.name.charAt(0).toUpperCase()}
                  </span>
                  <span className="product-name">{product.name}</span>
                  <strong>${product.price.toFixed(2)}</strong>
                  <div className="product-actions">
                    <button
                      className="row-action"
                      type="button"
                      onClick={() => setProductToEdit(product)}
                    >
                      Edit
                    </button>
                    <button
                      className="row-action delete-action"
                      type="button"
                      onClick={async () => {
                        if (!window.confirm(`Delete "${product.name}"?`)) return

                        try {
                          setError('')
                          await deleteProduct(product.id)
                          if (productToEdit?.id === product.id) setProductToEdit(null)
                          await loadProducts()
                        } catch (deleteError) {
                          setError(
                            deleteError instanceof Error
                              ? deleteError.message
                              : 'Could not delete the product.',
                          )
                        }
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </section>
    </main>
  )
}

export default App
