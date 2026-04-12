let currentEditId = null;

function renderProducts() {
  const products = getProducts();
  const tbody = document.querySelector('#productsTable tbody');
  tbody.innerHTML = products.map(p => `
    <tr>
      <td style="font-size:1.8rem">${p.image || '📦'}</td>
      <td><strong>${p.name}</strong></td>
      <td>${formatCurrency(p.price)}</td>
      <td style="${p.stock < 20 ? 'color:#f43f5e; font-weight:bold' : ''}">${p.stock}</td>
      <td><span class="status-badge" style="background:#e0e7ff; color:#4f46e5">${p.category}</span></td>
      <td>
        <button class="btn btn-sm btn-outline edit-product" data-id="${p.id}"><i class="fas fa-edit"></i></button>
        <button class="btn btn-sm btn-danger delete-product" data-id="${p.id}"><i class="fas fa-trash"></i></button>
      </td>
    </tr>
  `).join('');
  attachProductEvents();
}

function attachProductEvents() {
  document.querySelectorAll('.edit-product').forEach(btn => {
    btn.addEventListener('click', () => openEditModal(parseInt(btn.dataset.id)));
  });
  document.querySelectorAll('.delete-product').forEach(btn => {
    btn.addEventListener('click', () => {
      if (confirm('Delete product?')) deleteProduct(parseInt(btn.dataset.id));
    });
  });
}

function openEditModal(id) {
  const product = getProducts().find(p => p.id === id);
  if (product) {
    currentEditId = id;
    document.getElementById('modalTitle').innerText = 'Edit Product';
    document.getElementById('productId').value = id;
    document.getElementById('productName').value = product.name;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productStock').value = product.stock;
    document.getElementById('productCategory').value = product.category;
    document.getElementById('productImage').value = product.image || '';
    document.getElementById('productModal').style.display = 'flex';
  }
}

function openAddModal() {
  currentEditId = null;
  document.getElementById('modalTitle').innerText = 'Add Product';
  document.getElementById('productId').value = '';
  document.getElementById('productName').value = '';
  document.getElementById('productPrice').value = '';
  document.getElementById('productStock').value = '';
  document.getElementById('productCategory').value = '';
  document.getElementById('productImage').value = '';
  document.getElementById('productModal').style.display = 'flex';
}

function saveProduct() {
  const name = document.getElementById('productName').value.trim();
  const price = parseFloat(document.getElementById('productPrice').value);
  const stock = parseInt(document.getElementById('productStock').value);
  const category = document.getElementById('productCategory').value.trim();
  const image = document.getElementById('productImage').value.trim() || '📦';
  if (!name || isNaN(price) || isNaN(stock)) return alert('Fill all fields');
  let products = getProducts();
  if (currentEditId) {
    const index = products.findIndex(p => p.id === currentEditId);
    if (index !== -1) products[index] = { ...products[index], name, price, stock, category, image };
    saveProducts(products);
  } else {
    const newId = products.length ? Math.max(...products.map(p => p.id)) + 1 : 5;
    products.push({ id: newId, name, price, stock, category, image });
    saveProducts(products);
  }
  closeModal();
  renderProducts();
}

function deleteProduct(id) {
  let products = getProducts();
  products = products.filter(p => p.id !== id);
  saveProducts(products);
  renderProducts();
}

function closeModal() {
  document.getElementById('productModal').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  document.getElementById('addProductBtn').addEventListener('click', openAddModal);
  document.getElementById('saveProductBtn').addEventListener('click', saveProduct);
  document.getElementById('closeModalBtn').addEventListener('click', closeModal);
});
