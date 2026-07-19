import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import ItemForm from '../components/ItemForm';
import ItemList from '../components/ItemList';

interface Item {
  _id: string;
  title: string;
  description?: string;
  completed?: boolean;
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const loadItems = async () => {
    setLoading(true);
    try {
      const res = await api.get('/items');
      setItems(res.data.items);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleCreate = async (payload) => {
    const res = await api.post('/items', payload);
    setItems((prev) => [res.data.item, ...prev]);
  };

  const handleUpdate = async (id, updates) => {
    const res = await api.put(`/items/${id}`, updates);
    setItems((prev) => prev.map((it) => (it._id === id ? res.data.item : it)));
  };

  const handleDelete = async (id) => {
    await api.delete(`/items/${id}`);
    setItems((prev) => prev.filter((it) => it._id !== id));
  };

  return (
    <div className="container">
      <div className="topbar">
        <div>
          <h1 style={{ marginBottom: 0 }}>Tasks</h1>
          <p style={{ color: 'var(--text-dim)', margin: 0 }}>Signed in as {user?.email}</p>
        </div>
        <button className="secondary" onClick={logout}>Log out</button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <ItemForm onCreate={handleCreate} />

      {loading ? (
        <p className="center-text">Loading...</p>
      ) : (
        <ItemList items={items} onUpdate={handleUpdate} onDelete={handleDelete} />
      )}
    </div>
  );
}
