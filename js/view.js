const API_URL = 'https://script.google.com/macros/s/AKfycbzg_V1u_Rf8wtRSATBAXFl66zlcDUSnW-nUq68YiFZ9RVraz--AFnz0-tUl0PpY4ut3/exec';

document.addEventListener('DOMContentLoaded', () => {
  const monthInput = document.getElementById('month');
  const now = new Date();
  const maxMonth = now.toISOString().slice(0, 7);
  monthInput.setAttribute('max', maxMonth);
});

function formatDate(dateStr) {
  const date = new Date(dateStr);
  if (isNaN(date)) return dateStr;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
}

function capitalize(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : '';
}

function formatAmount(amount) {
  const num = parseFloat(String(amount).replace(',', '.'));
  if (isNaN(num)) return amount;
  return "$ " + num.toLocaleString('de-DE', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });
}

function generateTotals(data) {
  let total = 0;
  const categoryTotals = {};
  const subcategoryTotals = {};

  for (const row of data) {
    const category = capitalize(row[1]);
    const subcategory = capitalize(row[2]);
    const amount = parseFloat(String(row[3]).replace(',', '.')) || 0;

    total += amount;
    categoryTotals[category] = (categoryTotals[category] || 0) + amount;
    const key = `${category} > ${subcategory}`;
    subcategoryTotals[key] = (subcategoryTotals[key] || 0) + amount;
  }

  return { total, categoryTotals, subcategoryTotals };
}

function renderTotals(totals) {
  const categoryContainer = document.getElementById('category-total-container');
  const subcategoryContainer = document.getElementById('subcategory-total-container');
  const monthlyContainer = document.getElementById('monthly-total-container');

  categoryContainer.innerHTML = `
    <table class="totals-table">
      <thead><tr><th>Categoría</th><th>Total</th></tr></thead>
      <tbody>
        ${Object.entries(totals.categoryTotals).map(([cat, amt]) => `
          <tr><td>${cat}</td><td>${formatAmount(amt)}</td></tr>
        `).join('')}
      </tbody>
    </table>
  `;

  subcategoryContainer.innerHTML = `
    <table class="totals-table">
      <thead><tr><th>Subcategoría</th><th>Total</th></tr></thead>
      <tbody>
        ${Object.entries(totals.subcategoryTotals).map(([sub, amt]) => `
          <tr><td>${sub}</td><td>${formatAmount(amt)}</td></tr>
        `).join('')}
      </tbody>
    </table>
  `;

  monthlyContainer.innerHTML = `
    <table class="totals-table">
      <tr><td>${formatAmount(totals.total)}</td></tr>
    </table>
  `;

  document.getElementById('totals-section').style.display = 'block';
}

async function loadExpenses() {
  const tableContainer = document.getElementById('expenses-table-container');
  const monthInput = document.getElementById('month').value;
  let categoryFilter = document.getElementById('filter-category').value;

  if (categoryFilter.toLowerCase() === 'todas') categoryFilter = '';

  tableContainer.innerHTML = 'Cargando...';

  try {
    const url = `${API_URL}?month=${monthInput}${categoryFilter ? `&category=${encodeURIComponent(categoryFilter)}` : ''}`;
    const response = await fetch(url);
    const result = await response.json();
    const data = result.data || [];

    if (data.length === 0) {
      tableContainer.innerHTML = 'No hay datos para mostrar.';
    } else {
      const html = data.map(row => `
        <tr>
          <td>${formatDate(row[0])}</td>
          <td>${capitalize(row[1])}</td>
          <td>${capitalize(row[2])}</td>
          <td>${formatAmount(row[3])}</td>
        </tr>
      `).join('');

     const tableHtml = `
        <div class="table-container">
          <h3 class="table-title">Gastos</h3>
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Categoría</th>
                <th>Subcategoría</th>
                <th>Monto</th>
              </tr>
            </thead>
            <tbody>${html}</tbody>
          </table>
        </div>
      `;

      tableContainer.innerHTML = tableHtml;

      const totals = generateTotals(data);
      renderTotals(totals);
    }
  } catch (error) {
    tableContainer.innerHTML = '❌ Error al obtener datos.';
    console.error(error);
  }

  const title = document.getElementById('view-title');
  const filters = document.getElementById('filters');
  if (title) title.style.display = 'none';
  if (filters) filters.style.display = 'none';
}
