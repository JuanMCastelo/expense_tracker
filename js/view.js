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

function formatAmount(amount) {
  const num = parseFloat(amount);
  if (isNaN(num)) return amount;
  return num.toLocaleString('de-DE', {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3
  });
}

async function loadExpenses() {
  const tableContainer = document.getElementById('expenses-table-container');
  const monthInput = document.getElementById('month').value;
  let categoryFilter = document.getElementById('filter-category').value;

  // Si el usuario eligió "Todas", no enviar parámetro
  if (categoryFilter.toLowerCase() === 'todas') {
    categoryFilter = '';
  }

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
          <td>${row[1]}</td>
          <td>${row[2]}</td>
          <td>${formatAmount(row[3])}</td>
        </tr>
      `).join('');

      tableContainer.innerHTML = `
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
      `;
    }
  } catch (error) {
    tableContainer.innerHTML = '❌ Error al obtener datos.';
    console.error(error);
  }

  // Ocultar filtros y título cuando aparezca la tabla o el mensaje
  document.getElementById('view-title').style.display = 'none';
  document.getElementById('filters').style.display = 'none';
}
