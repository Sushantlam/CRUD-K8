import { useState } from 'react';

export default function ItemForm({ onCreate }: { onCreate: (payload: { title: string; description: string }) => Promise<void> }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    try {
      await onCreate({ title, description });
      setTitle('');
      setDescription('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card" style={{ marginBottom: '1.5rem' }}>
      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Finish k8s Ingress setup"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="description">Description (optional)</label>
        <textarea
          id="description"
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add details..."
        />
      </div>
      <button type="submit" disabled={submitting}>
        {submitting ? 'Adding...' : 'Add Item'}
      </button>
    </form>
  );
}
