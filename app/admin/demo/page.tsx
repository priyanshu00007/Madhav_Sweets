'use client';

import { useState, useEffect } from 'react';

export default function DbDemoPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/categories')
      ]);

      if (!prodRes.ok || !catRes.ok) throw new Error('Failed to fetch data');

      const prodData = await prodRes.json();
      const catData = await catRes.json();

      setProducts(prodData);
      setCategories(catData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newProductName,
          price: parseFloat(newProductPrice),
          category_id: parseInt(selectedCategory),
          description: 'Added via demo page'
        })
      });

      if (res.ok) {
        setNewProductName('');
        setNewProductPrice('');
        fetchData(); // Refresh list
      } else {
        const data = await res.json();
        alert('Error: ' + data.message);
      }
    } catch (err: any) {
      alert('Failed to add product: ' + err.message);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto bg-slate-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-amber-400">Database Connection Demo</h1>

      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-200 p-4 rounded mb-6">
          <strong>Database Connection Error:</strong> {error}
          <p className="text-sm mt-2">Make sure your MySQL server is running and .env is configured correctly.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Side: Fetch and Display */}
        <section className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-xl">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Live Products from MySQL
          </h2>
          
          {loading ? (
            <div className="animate-pulse text-slate-400">Loading products...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-700 text-slate-300">
                  <tr>
                    <th className="p-2">ID</th>
                    <th className="p-2">Name</th>
                    <th className="p-2">Price</th>
                    <th className="p-2">Category</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p: any) => (
                    <tr key={p.id} className="border-b border-slate-700 hover:bg-slate-750">
                      <td className="p-2">{p.id}</td>
                      <td className="p-2 font-medium">{p.name}</td>
                      <td className="p-2">₹{p.price}</td>
                      <td className="p-2 text-slate-400">{p.category || 'N/A'}</td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-4 text-center text-slate-500">No products found. Run seed.sql in your DB!</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Right Side: Insert Demo */}
        <section className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-xl">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            Test Database Insert
          </h2>
          
          <form onSubmit={handleAddProduct} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Product Name</label>
              <input 
                type="text" 
                value={newProductName}
                onChange={(e) => setNewProductName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded p-2 focus:border-amber-500 outline-none"
                placeholder="e.g. Special Barfi"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm text-slate-400 mb-1">Price (₹)</label>
              <input 
                type="number" 
                value={newProductPrice}
                onChange={(e) => setNewProductPrice(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded p-2 focus:border-amber-500 outline-none"
                placeholder="0.00"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-1">Category</label>
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded p-2 focus:border-amber-500 outline-none"
                required
              >
                <option value="">Select Category</option>
                {categories.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <button 
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2 px-4 rounded transition-colors"
            >
              Insert into MySQL
            </button>
          </form>

          <div className="mt-8 p-4 bg-slate-900/50 rounded border border-slate-700">
            <h3 className="text-sm font-bold text-amber-500 mb-2 uppercase tracking-wider">Instructions</h3>
            <ul className="text-xs text-slate-400 space-y-1 list-disc pl-4">
              <li>Ensure MySQL is running on your machine.</li>
              <li>Database: <code className="text-slate-200">ambrosia_db</code></li>
              <li>Check your <code className="text-slate-200">.env</code> file for credentials.</li>
              <li>Run <code className="text-slate-200">db/schema.sql</code> first, then <code className="text-slate-200">db/seed.sql</code>.</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
