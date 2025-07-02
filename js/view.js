const API_URL = 'https://script.google.com/macros/s/AKfycbwNQBsym9kN9nYpsnzbbsuXWG5dDmOxvuEWRW2ykRPqiaDpiAw532gj-rmaR0-yl71A/exec';

document.addEventListener('DOMContentLoaded', () => {
  const monthInput = document.getElementById('month');

  // Limitar selección al mes actual o anteriores
  const now = new Date();
  const maxMonth = now.toISOString().slice(0, 7); // yyyy-mm
  monthInput.setAttribute('max', maxMonth);
});

async function loadExpenses() {
  const tableContainer = document.getElementById('expenses-table-container');
  const monthInput = document.getElementById('month').value;
  const categoryFilter = document.getElementById('filter-category').value;

  tableContainer.innerHTML = 'Cargando...';

  try {
    const response = await fetch(`${API_URL}?month=${monthInput}&category=${categoryFilter}`);
    const result = await response.json();
    const data = result.data || result.values || [];

    const rows = data.slice(1); // saltar encabezado

    const filtered = rows.filter(row => {
      const rawDate = String(row[0] || '').trim(); // Asegura que sea string
      const category = row[1];

      const rowMonth = rawDate.slice(0, 7); // "YYYY-MM"

      const matchMonth = !monthInput || rowMonth === monthInput;
      const matchCategory = !categoryFilter || category === categoryFilter;

      return matchMonth && matchCategory;
    });

    if (filtered.length === 0) {
      tableContainer.innerHTML = 'No hay datos para mostrar.';
      return;
    }

    const html = filtered.map(row => `
      <tr>
        <td>${row[0]}</td>
        <td>${row[1]}</td>
        <td>${row[2]}</td>
        <td>${row[3]}</td>
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
  } catch (error) {
    tableContainer.innerHTML = '❌ Error al obtener datos.';
    console.error(error);
  }
}
