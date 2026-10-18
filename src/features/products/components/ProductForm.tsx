import { useState } from 'react'
import type { FormEvent } from 'react'
import { createProduct, updateProduct } from '../services/productService'
import type { Product } from '../types/product'

interface ProductFormProps {
  onCreated: () => void
  productToEdit: Product | null
  onCancelEdit: () => void
}

interface FormValues {
  name: string
  price: string
}

const initialValues: FormValues = { name: '', price: '' }

export function ProductForm({ onCreated, productToEdit, onCancelEdit }: ProductFormProps) {
  const [values, setValues] = useState<FormValues>(() =>
    productToEdit
      ? { name: productToEdit.name, price: String(productToEdit.price) }
      : initialValues,
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  function updateField(field: keyof FormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }))
    if (error) setError('')
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const name = values.name.trim()
    const price = Number(values.price)

    if (!name) {
      setError('Enter a product name.')
      return
    }

    if (!values.price || !Number.isFinite(price) || price < 0) {
      setError('Enter a valid price of 0 or more.')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      if (productToEdit) {
        await updateProduct(productToEdit.id, { name, price })
      } else {
        await createProduct({ name, price })
      }
      setValues(initialValues)
      onCreated()
      onCancelEdit()
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : 'Could not create the product.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="product-form" onSubmit={handleSubmit} noValidate>
      <div className="form-heading">
        <div>
          <p className="eyebrow">Product catalog</p>
          <h2>{productToEdit ? 'Update product' : 'Create a product'}</h2>
        </div>
        <span className="form-badge">New</span>
      </div>

      <div className="form-fields">
        <label>
          Product name
          <input
            required
            value={values.name}
            onChange={(event) => updateField('name', event.target.value)}
            placeholder="e.g. Wireless headphones"
            autoComplete="off"
          />
        </label>
        <label>
          Price
          <div className="price-input">
            <span aria-hidden="true">$</span>
            <input
              required
              min="0"
              step="0.01"
              type="number"
              value={values.price}
              onChange={(event) => updateField('price', event.target.value)}
              placeholder="0.00"
              inputMode="decimal"
            />
          </div>
        </label>
      </div>

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <button className="primary-button" type="submit" disabled={isSubmitting}>
        {isSubmitting
          ? productToEdit
            ? 'Updating...'
            : 'Creating...'
          : productToEdit
            ? 'Update product'
            : 'Create product'}
      </button>
      {productToEdit && (
        <button
          className="cancel-button"
          type="button"
          onClick={() => {
            setValues(initialValues)
            setError('')
            onCancelEdit()
          }}
          disabled={isSubmitting}
        >
          Cancel
        </button>
      )}
    </form>
  )
}
