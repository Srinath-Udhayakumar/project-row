import { useEffect, useState } from "react";
import {
  addCartItem,
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "../services/api";
import { getRole } from "../util/auth";

const emptyProduct = { name: "", description: "", price: "", stock: "" };

function Products() {
  const isAdmin = getRole() === "ADMIN";
  const [name, setName] = useState("");
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [adminForm, setAdminForm] = useState(emptyProduct);
  const [editId, setEditId] = useState(null);

  const loadProducts = async (searchName = "") => {
    try {
      const { data } = await getProducts(searchName);
      setProducts(data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load products");
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const onSearch = async (e) => {
    e.preventDefault();
    setError("");
    await loadProducts(name);
  };

  const onAddToCart = async (productId) => {
    try {
      await addCartItem({ productId, quantity: 1 });
      alert("Added to cart");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to add to cart");
    }
  };

  const onAdminSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const payload = {
      ...adminForm,
      price: Number(adminForm.price),
      stock: Number(adminForm.stock),
    };

    try {
      if (editId) {
        await updateProduct(editId, payload);
      } else {
        await createProduct(payload);
      }
      setAdminForm(emptyProduct);
      setEditId(null);
      await loadProducts(name);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to save product");
    }
  };

  const onEdit = (product) => {
    setEditId(product.id);
    setAdminForm({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
    });
  };

  const onDelete = async (id) => {
    try {
      await deleteProduct(id);
      await loadProducts(name);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete product");
    }
  };

  return (
    <section>
      <h2>Products</h2>
      <form className="row" onSubmit={onSearch}>
        <input
          placeholder="Search by name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {error && <p className="error">{error}</p>}

      <div className="grid">
        {products.map((product) => (
          <article key={product.id} className="card product-card">
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p>Price: ${product.price}</p>
            <p>Stock: {product.stock}</p>
            <div className="row">
              <button type="button" onClick={() => onAddToCart(product.id)}>
                Add to Cart
              </button>
              {isAdmin && (
                <>
                  <button type="button" onClick={() => onEdit(product)}>
                    Edit
                  </button>
                  <button type="button" className="danger" onClick={() => onDelete(product.id)}>
                    Delete
                  </button>
                </>
              )}
            </div>
          </article>
        ))}
      </div>

      {isAdmin && (
        <section className="card">
          <h3>{editId ? "Update Product" : "Add Product"}</h3>
          <form className="admin-form" onSubmit={onAdminSubmit}>
            <input
              placeholder="Name"
              value={adminForm.name}
              onChange={(e) => setAdminForm((p) => ({ ...p, name: e.target.value }))}
              required
            />
            <input
              placeholder="Description"
              value={adminForm.description}
              onChange={(e) => setAdminForm((p) => ({ ...p, description: e.target.value }))}
              required
            />
            <input
              placeholder="Price"
              type="number"
              min="0"
              step="0.01"
              value={adminForm.price}
              onChange={(e) => setAdminForm((p) => ({ ...p, price: e.target.value }))}
              required
            />
            <input
              placeholder="Stock"
              type="number"
              min="0"
              value={adminForm.stock}
              onChange={(e) => setAdminForm((p) => ({ ...p, stock: e.target.value }))}
              required
            />
            <button type="submit">{editId ? "Update" : "Create"}</button>
          </form>
        </section>
      )}
    </section>
  );
}

export default Products;