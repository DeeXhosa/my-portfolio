function loadMetrics() {
  const products = getProducts();
  const orders = getOrders();
  const customers = getCustomers();

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.length;
  const totalCustomers = customers.length;
  const lowStock = products.filter(p => p.stock < 20).length;

  const metrics = [
    { label: 'Revenue', value: formatCurrency(totalRevenue), icon: 'fas fa-dollar-sign', color: '#10b981' },
    { label: 'Orders', value: totalOrders, icon: 'fas fa-shopping-cart', color: '#4f46e5' },
    { label: 'Customers', value: totalCustomers, icon: 'fas fa-users', color: '#f59e0b' },
    { label: 'Low Stock', value: lowStock, icon: 'fas fa-exclamation-triangle', color: '#f43f5e' }
  ];

  const grid = document.getElementById('metricsGrid');
  grid.innerHTML = metrics.map(m => `
    <div class="metric-card">
      <h3><i class="${m.icon}" style="color:${m.color}"></i> ${m.label}</h3>
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
  const last6Months = [];
  const today = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    last6Months.push(d.toLocaleString('default', { month: 'short' }));
  }
  const monthlyData = last6Months.map(month => {
    let total = 0;
    orders.forEach(order => {
      const orderMonth = new Date(order.date).toLocaleString('default', { month: 'short' });
      if (orderMonth === month) total += order.total;
    });
    return total;
  });
  const ctx = document.getElementById('salesChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: last6Months,
      datasets: [{
        label: 'Revenue ($)',
        data: monthlyData,
        backgroundColor: 'rgba(79, 70, 229, 0.7)',
        borderRadius: 12,
        borderSkipped: false,
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        tooltip: { callbacks: { label: (ctx) => `$${ctx.raw.toFixed(2)}` } }
      }
    }
  });
}

document.getElementById('dateBadge').innerHTML = `<i class="fas fa-calendar"></i> ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`;

loadMetrics();
loadRecentOrders();
renderSalesChart();
