import { useState } from 'react';

interface Item {
  _id: string;
  title: string;
  description?: string;
  completed?: boolean;
}

function EditForm({ item, onSave, onCancel }: { item: Item; onSave: (updates: { title: string; description: string }) => Promise<void> | void; onCancel: () => void }) {
  const [title, setTitle] = useState(item.title);
  const [description, setDescription] = useState(item.description || '');

  return (
    <div style={{ flex: 1 }}>
      <div className="form-group">
        <input value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div className="form-group">
        <textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div className="item-actions">
        <button onClick={() => onSave({ title, description })}>Save</button>
        <button className="secondary" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}

export default function ItemList({ items, onUpdate, onDelete }: { items: Item[]; onUpdate: (id: string, updates: Partial<Item>) => Promise<void> | void; onDelete: (id: string) => Promise<void> | void }) {
  const [editingId, setEditingId] = useState(null);

  if (items.length === 0) {
    return <p className="center-text" style={{ color: 'var(--text-dim)' }}>No items yet. Add your first one above.</p>;
  }

  return (
    <div>
      {items.map((item) => (
        <div key={item._id} className={`item ${item.completed ? 'completed' : ''}`}>
          {editingId === item._id ? (
            <EditForm
              item={item}
              onCancel={() => setEditingId(null)}
              onSave={async (updates) => {
                await onUpdate(item._id, updates);
                setEditingId(null);
              }}
            />
          ) : (
            <>
              <div>
                <h3>{item.title}</h3>
                {item.description && <p>{item.description}</p>}
              </div>
              <div className="item-actions">
                <button
                  className="secondary"
                  onClick={() => onUpdate(item._id, { completed: !item.completed })}
                >
                  {item.completed ? 'Undo' : 'Done'}
                </button>
                <button className="secondary" onClick={() => setEditingId(item._id)}>
                  Edit
                </button>
                <button className="danger" onClick={() => onDelete(item._id)}>
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
