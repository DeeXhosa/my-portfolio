let currentEditId = null;

function renderProducts() {
  const products = getProducts();
  const tbody = document.querySelector('#productsTable tbody');
  tbody.innerHTML = products.map(p => `
    <tr>
      <td>${p.id}</td>
      <td>${p.name}</td>
      <td>${formatCurrency(p.price)}</td>
      <td>${p.stock}</td>
      <td>${p.category}</td>
      <td>
        <button class="btn btn-sm btn-outline edit-product" data-id="${p.id}"><i class="fas fa-edit"></i></button>
        <button class="btn btn-sm btn-danger delete-product" data-id="${p.id}"><i class="fas fa-trash"></i></button>
      </td>
    </tr>
  `).join('');

  // attach events
  document.querySelectorAll('.edit-product').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(btn.dataset.id);
      openEditModal(id);
    });
  });
  document.querySelectorAll('.delete-product').forEach(btn => {
    btn.addEventListener('click', () => {
      if (confirm('Delete this product?')) {
        deleteProduct(parseInt(btn.dataset.id));
      }
    });
  });
}

function openEditModal(id) {
  const products = getProducts();
  const product = products.find(p => p.id === id);
  if (product) {
    currentEditId = id;
    document.getElementById('modalTitle').innerText = 'Edit Product';
    document.getElementById('productId').value = id;
    document.getElementById('productName').value = product.name;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productStock').value = product.stock;
    document.getElementById('productCategory').value = product.category;
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
  document.getElementById('productModal').style.display = 'flex';
}

function saveProduct() {
  const name = document.getElementById('productName').value.trim();
  const price = parseFloat(document.getElementById('productPrice').value);
  const stock = parseInt(document.getElementById('productStock').value);
  const category = document.getElementById('productCategory').value.trim();
  if (!name || isNaN(price) || isNaN(stock)) {
    alert('Please fill all fields correctly');
    return;
  }
  let products = getProducts();
  if (currentEditId) {
    // update
    const index = products.findIndex(p => p.id === currentEditId);
    if (index !== -1) {
      products[index] = { ...products[index], name, price, stock, category };
      saveProducts(products);
    }
  } else {
    // add new
    const newId = products.length ? Math.max(...products.map(p => p.id)) + 1 : 4;
    products.push({ id: newId, name, price, stock, category });
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
  // close on outside click
  window.addEventListener('click', (e) => {
    const modal = document.getElementById('productModal');
    if (e.target === modal) closeModal();
  });
});
