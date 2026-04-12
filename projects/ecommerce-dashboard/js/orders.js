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
  document.querySelectorAll('.status-select').forEach(sel => {
    sel.addEventListener('change', (e) => {
      const orderId = parseInt(sel.dataset.id);
      const newStatus = sel.value;
      let orders = getOrders();
      const idx = orders.findIndex(o => o.id === orderId);
      if (idx !== -1) orders[idx].status = newStatus;
      saveOrders(orders);
      renderOrders();
    });
  });
}
document.addEventListener('DOMContentLoaded', renderOrders);
