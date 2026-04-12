function loadDashboardMetrics() {
  const products = getProducts();
  const orders = getOrders();

  const totalProducts = products.length;
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const lowStock = products.filter(p => p.stock < 20).length;

  const metrics = [
    { label: 'Total Products', value: totalProducts, icon: 'fas fa-cube' },
    { label: 'Total Orders', value: totalOrders, icon: 'fas fa-shopping-cart' },
    { label: 'Revenue', value: formatCurrency(totalRevenue), icon: 'fas fa-dollar-sign' },
    { label: 'Low Stock Items', value: lowStock, icon: 'fas fa-exclamation-triangle' }
  ];

  const grid = document.getElementById('metricsGrid');
  grid.innerHTML = metrics.map(m => `
    <div class="metric-card">
      <h3><i class="${m.icon}"></i> ${m.label}</h3>
      <div class="metric-value">${m.value}</div>
    </div>
  `).join('');
}

function loadRecentOrders() {
  const orders = getOrders();
  const recent = [...orders].sort((a,b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
  const tbody = document.querySelector('#recentOrdersTable tbody');
  tbody.innerHTML = recent.map(order => `
    <tr>
      <td>#${order.id}</td>
      <td>${order.customer}</td>
      <td>${formatCurrency(order.total)}</td>
      <td><span class="status-badge status-${order.status}">${order.status}</span></td>
    </tr>
  `).join('');
}

function renderSalesChart() {
  const orders = getOrders();
  // group by month (last 6 months)
  const months = {};
  const today = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const key = d.toLocaleString('default', { month: 'short' });
    months[key] = 0;
  }
  orders.forEach(order => {
    const date = new Date(order.date);
    const monthKey = date.toLocaleString('default', { month: 'short' });
    if (months[monthKey] !== undefined) months[monthKey] += order.total;
  });
  const labels = Object.keys(months);
  const data = Object.values(months);
  const ctx = document.getElementById('salesChart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Revenue ($)',
        data: data,
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37,99,235,0.05)',
        tension: 0.3,
        fill: true
      }]
    },
    options: { responsive: true, maintainAspectRatio: true }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadDashboardMetrics();
  loadRecentOrders();
  renderSalesChart();
});
