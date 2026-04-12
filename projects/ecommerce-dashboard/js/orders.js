function renderOrders() {
  const orders = getOrders();
  const tbody = document.querySelector('#ordersTable tbody');
  tbody.innerHTML = orders.map(order => `
    <tr>
      <td>#${order.id}</td>
      <td>${order.customer}</td>
      <td>${order.date}</td>
      <td>${formatCurrency(order.total)}</td>
      <td><span class="status-badge status-${order.status}">${order.status}</span></td>
      <td>
        <select class="status-select" data-id="${order.id}">
          <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
          <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Shipped</option>
          <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
        </select>
      </td>
    </tr>
  `).join('');

  // attach status change event
  document.querySelectorAll('.status-select').forEach(select => {
    select.addEventListener('change', (e) => {
      const orderId = parseInt(select.dataset.id);
      const newStatus = select.value;
      updateOrderStatus(orderId, newStatus);
    });
  });
}

function updateOrderStatus(orderId, newStatus) {
  let orders = getOrders();
  const orderIndex = orders.findIndex(o => o.id === orderId);
  if (orderIndex !== -1) {
    orders[orderIndex].status = newStatus;
    saveOrders(orders);
    renderOrders(); // re-render to update badge
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderOrders();
});
