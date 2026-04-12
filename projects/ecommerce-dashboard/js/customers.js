function renderCustomers() {
  const customers = getCustomers();
  const tbody = document.querySelector('#customersTable tbody');
  tbody.innerHTML = customers.map(c => `
    <tr>
      <td>#${c.id}</td>
      <td><strong>${c.name}</strong></td>
      <td>${c.email}</td>
      <td>${formatCurrency(c.totalSpent)}</td>
      <td>${c.orders}</td>
      <td>${c.joinDate}</td>
    </tr>
  `).join('');
}
document.addEventListener('DOMContentLoaded', renderCustomers);
