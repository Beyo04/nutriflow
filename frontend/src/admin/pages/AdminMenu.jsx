import { useEffect, useState } from 'react'
import adminApi from '../adminApi'

const Card = ({ children, style = {} }) => (
  <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.07)', ...style }}>
    {children}
  </div>
)

const INITIAL_FORM = { name: '', description: '', price: '', category: '', isActive: true, image: '' }

export default function AdminMenu() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  // Modal state
  const [modal, setModal] = useState(null) // null | 'create' | 'edit'
  const [editItem, setEditItem] = useState(null)
  const [form, setForm] = useState(INITIAL_FORM)
  const [formError, setFormError] = useState('')
  const [formLoading, setFormLoading] = useState(false)

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const fetchItems = async () => {
    setLoading(true)
    setError('')
    try {
      // GET /menu is public — no auth required
      const res = await adminApi.get('/menu')
      setItems(res.data?.data ?? res.data ?? [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load menu items.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchItems() }, [])

  const openCreate = () => { setForm(INITIAL_FORM); setFormError(''); setEditItem(null); setModal('create') }
  const openEdit = (item) => {
    setForm({ name: item.name || '', description: item.description || '', price: item.price ?? '', category: item.category || '', isActive: item.isActive ?? true, image: item.image || '' })
    setEditItem(item)
    setFormError('')
    setModal('edit')
  }
  const closeModal = () => { setModal(null); setEditItem(null) }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    setFormError('')
    if (!form.name.trim()) { setFormError('Item name is required.'); return }
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) < 0) { setFormError('Enter a valid price.'); return }

    setFormLoading(true)
    try {
      const payload = { ...form, price: Number(form.price) }
      if (modal === 'create') {
        await adminApi.post('/menu', payload)
      } else {
        await adminApi.put(`/menu/${editItem._id}`, payload)
      }
      closeModal()
      fetchItems()
    } catch (err) {
      setFormError(err.response?.data?.message || 'Save failed.')
    } finally {
      setFormLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleteLoading(true)
    try {
      await adminApi.delete(`/menu/${deleteTarget._id}`)
      setDeleteTarget(null)
      fetchItems()
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed.')
    } finally {
      setDeleteLoading(false)
    }
  }

  const filtered = items.filter(item =>
    !search || item.name?.toLowerCase().includes(search.toLowerCase()) || item.category?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ padding: '32px 36px', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 800, color: '#0F172A' }}>Menu</h1>
          <p style={{ margin: '4px 0 0', color: '#64748B', fontSize: '14px' }}>Manage food items and availability</p>
        </div>
        <button onClick={openCreate}
          style={{ padding: '10px 20px', borderRadius: '10px', border: 'none', background: '#10B981', color: '#fff', fontWeight: 600, fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 12px rgba(16,185,129,0.3)', transition: 'opacity 0.2s' }}>
          + Add Item
        </button>
      </div>

      <Card style={{ marginBottom: '24px' }}>
        <input placeholder="Search by name or category…" value={search} onChange={e => setSearch(e.target.value)}
          style={{ width: '100%', boxSizing: 'border-box', padding: '10px 16px', borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '14px', color: '#334155', outline: 'none', fontFamily: 'inherit' }}
        />
      </Card>

      {error && <div style={{ background: '#FEE2E2', color: '#991B1B', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', fontSize: '13px' }}>{error}</div>}

      {loading ? (
        <p style={{ color: '#94A3B8', fontSize: '14px' }}>Loading menu…</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
          {filtered.length === 0 ? (
            <p style={{ color: '#94A3B8', fontSize: '14px', gridColumn: '1/-1' }}>No items found.</p>
          ) : filtered.map(item => (
            <div key={item._id} style={{
              background: '#fff', borderRadius: '16px', overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0,0,0,0.07)', transition: 'box-shadow 0.2s',
              opacity: item.isActive ? 1 : 0.6,
              border: item.isActive ? '1px solid transparent' : '1px solid #FEE2E2',
            }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.1)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.07)'}
            >
              {item.image && (
                <div style={{ height: '160px', overflow: 'hidden', background: '#F1F5F9' }}>
                  <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.currentTarget.style.display = 'none' }} />
                </div>
              )}
              {!item.image && (
                <div style={{ height: '100px', background: 'linear-gradient(135deg, #F0FDF4, #ECFDF5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '36px' }}>🥗</span>
                </div>
              )}
              <div style={{ padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                  <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0F172A', flex: 1 }}>{item.name}</h3>
                  <span style={{
                    fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '20px',
                    background: item.isActive ? '#D1FAE5' : '#FEE2E2',
                    color: item.isActive ? '#065F46' : '#991B1B', marginLeft: '8px', flexShrink: 0,
                  }}>
                    {item.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                {item.category && <p style={{ margin: '0 0 6px', fontSize: '12px', color: '#94A3B8', textTransform: 'capitalize' }}>{item.category}</p>}
                {item.description && <p style={{ margin: '0 0 12px', fontSize: '13px', color: '#64748B', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.description}</p>}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, fontSize: '17px', color: '#10B981' }}>₹{item.price}</span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => openEdit(item)}
                      style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #E2E8F0', background: '#F8FAFC', color: '#334155', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#10B981'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#10B981' }}
                      onMouseLeave={e => { e.currentTarget.style.background = '#F8FAFC'; e.currentTarget.style.color = '#334155'; e.currentTarget.style.borderColor = '#E2E8F0' }}>
                      Edit
                    </button>
                    <button onClick={() => setDeleteTarget(item)}
                      style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #FEE2E2', background: '#FFF5F5', color: '#991B1B', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#EF4444'; e.currentTarget.style.color = '#fff' }}
                      onMouseLeave={e => { e.currentTarget.style.background = '#FFF5F5'; e.currentTarget.style.color = '#991B1B' }}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Create / Edit Modal ── */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '24px' }}
          onClick={e => { if (e.target === e.currentTarget) closeModal() }}>
          <div style={{ background: '#fff', borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '480px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,0.18)' }}>
            <h3 style={{ margin: '0 0 24px', fontSize: '18px', fontWeight: 700, color: '#0F172A' }}>
              {modal === 'create' ? 'Add Menu Item' : 'Edit Menu Item'}
            </h3>
            {formError && <div style={{ background: '#FEE2E2', color: '#991B1B', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', fontSize: '13px' }}>{formError}</div>}
            <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { field: 'name', label: 'Name *', type: 'text', placeholder: 'e.g. Grilled Chicken Bowl' },
                { field: 'price', label: 'Price (₹) *', type: 'number', placeholder: '0' },
                { field: 'category', label: 'Category', type: 'text', placeholder: 'e.g. Lunch, Breakfast' },
                { field: 'image', label: 'Image URL', type: 'url', placeholder: 'https://...' },
              ].map(({ field, label, type, placeholder }) => (
                <div key={field}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>{label}</label>
                  <input type={type} placeholder={placeholder} value={form[field]}
                    onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                    style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '13px', fontFamily: 'inherit', outline: 'none' }}
                  />
                </div>
              ))}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Description</label>
                <textarea rows={3} placeholder="Short description…" value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '13px', fontFamily: 'inherit', resize: 'vertical', outline: 'none' }}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input type="checkbox" id="isActive" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} style={{ width: '16px', height: '16px', accentColor: '#10B981' }} />
                <label htmlFor="isActive" style={{ fontSize: '13px', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>Active (visible to customers)</label>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button type="button" onClick={closeModal} style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid #E2E8F0', background: '#fff', color: '#475569', fontWeight: 600, fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit' }}>
                  Cancel
                </button>
                <button type="submit" disabled={formLoading} style={{ flex: 1, padding: '10px', borderRadius: '10px', border: 'none', background: formLoading ? '#E2E8F0' : '#10B981', color: formLoading ? '#94A3B8' : '#fff', fontWeight: 600, fontSize: '14px', cursor: formLoading ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
                  {formLoading ? 'Saving…' : modal === 'create' ? 'Create' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirm Modal ── */}
      {deleteTarget && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '24px' }}
          onClick={e => { if (e.target === e.currentTarget) setDeleteTarget(null) }}>
          <div style={{ background: '#fff', borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '380px', boxShadow: '0 24px 64px rgba(0,0,0,0.18)', textAlign: 'center' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </div>
            <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: 700, color: '#0F172A' }}>Delete "{deleteTarget.name}"?</h3>
            <p style={{ margin: '0 0 24px', color: '#64748B', fontSize: '14px' }}>This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setDeleteTarget(null)} style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid #E2E8F0', background: '#fff', color: '#475569', fontWeight: 600, fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
              <button onClick={handleDelete} disabled={deleteLoading} style={{ flex: 1, padding: '10px', borderRadius: '10px', border: 'none', background: '#EF4444', color: '#fff', fontWeight: 600, fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit' }}>
                {deleteLoading ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
