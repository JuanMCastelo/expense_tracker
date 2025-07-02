const API_URL = 'https://script.google.com/macros/s/AKfycbyVDjdqMgiBaDjEWh8tiBOG1nd4awOCHNZNYRAsF3gPCpsTvXGRg5_lDBFuLNrq1VWZ/exec';

const form = document.getElementById('expense-form');
const status = document.getElementById('status');
const dateInput = document.getElementById('date');
const categorySelect = document.getElementById('category');
const subcategorySelect = document.getElementById('subcategory');

// Set today's date as minimum
const today = new Date().toISOString().split('T')[0];
dateInput.setAttribute('min', today);

// Mapeo de subcategorías por categoría
const subcategoriesByCategory = {
  hogar: {
    items: ["alquiler", "telefono", "luz", "gas", "agua", "television", "ABL", "mantenimiento o reparaciones"],
    default: "alquiler"
  },
  entretenimiento: {
    items: ["streaming", "cine", "recitales", "eventos deportivos", "teatro"],
    default: "streaming"
  },
  transporte: {
    items: ["sube", "taxi", "uber"],
    default: "sube"
  },
  "tarjetas de credito": {
    items: ["personal", "visa", "mastercard"],
    default: "visa"
  },
  comida: {
    items: ["alimentos", "restaurantes", "pedidos ya/rappi"],
    default: "alimentos"
  },
  "ahorros o inversiones": {
    items: ["cuenta de inversion", "cuenta de ahorro", "cuenta de viaje"],
    default: "cuenta de ahorro"
  },
  "cuidado personal": {
    items: ["salud", "pelo", "ropa", "gimnasio"],
    default: "salud"
  },
  regalos: {
    items: [],
    default: null
  }
};

// Lógica para actualizar subcategorías al seleccionar categoría
categorySelect.addEventListener("change", () => {
  const selectedCategory = categorySelect.value;
  const data = subcategoriesByCategory[selectedCategory];

  // Limpiar subcategorías anteriores
  subcategorySelect.innerHTML = '<option value="" disabled selected>Select subcategory</option>';

  if (!data || data.items.length === 0) {
    subcategorySelect.disabled = true;
    return;
  }

  // Agregar nuevas subcategorías
  data.items.forEach(sub => {
    const option = document.createElement("option");
    option.value = sub;
    option.textContent = sub.charAt(0).toUpperCase() + sub.slice(1);
    if (sub === data.default) {
      option.selected = true;
    }
    subcategorySelect.appendChild(option);
  });

  subcategorySelect.disabled = false;
});

// Validar y enviar el formulario
form.addEventListener('submit', async function (e) {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());

  // Validar que la fecha no sea anterior a hoy
  const selectedDate = new Date(data.date);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  if (selectedDate < now) {
    status.innerText = '⚠️ Date cannot be in the past.';
    return;
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams(data).toString()
    });

    const result = await response.json();

    if (result.result === 'Success') {
      status.innerText = '✅ Expense registered successfully!';
      form.reset();

      // Resetear subcategoría
      subcategorySelect.innerHTML = '<option value="" disabled selected>Select subcategory</option>';
      subcategorySelect.disabled = true;
    } else {
      status.innerText = '⚠️ Unexpected response.';
    }
  } catch (error) {
    console.error('❌ Error:', error);
    status.innerText = '❌ Error submitting the form.';
  }
});

// Botón reset adicional
const resetButton = document.createElement('button');
resetButton.innerText = 'Reset';
resetButton.type = 'button';
resetButton.style.marginTop = '10px';
resetButton.addEventListener('click', function () {
  form.reset();
  status.innerText = '';
  subcategorySelect.innerHTML = '<option value="" disabled selected>Select subcategory</option>';
  subcategorySelect.disabled = true;
});
document.querySelector('.container').appendChild(resetButton);
