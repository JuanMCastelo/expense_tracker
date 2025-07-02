const API_URL = 'https://script.google.com/macros/s/AKfycbzg_V1u_Rf8wtRSATBAXFl66zlcDUSnW-nUq68YiFZ9RVraz--AFnz0-tUl0PpY4ut3/exec';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('expense-form');
  const status = document.getElementById('status');
  const dateInput = document.getElementById('date');
  const categorySelect = document.getElementById('category');
  const subcategorySelect = document.getElementById('subcategory');
  const amountInput = document.getElementById('amount');
  const resetBtn = document.getElementById('reset-btn');

  if (!form) return;

  // Set min date
  const today = new Date().toISOString().split('T')[0];
  dateInput.setAttribute('min', today);

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

  categorySelect.addEventListener("change", () => {
    const selected = categorySelect.value;
    const data = subcategoriesByCategory[selected];

    subcategorySelect.innerHTML = '<option value="" disabled selected>Seleccionar subcategoría</option>';

    if (!data || data.items.length === 0) {
      subcategorySelect.disabled = true;
      return;
    }

    data.items.forEach(sub => {
      const option = document.createElement("option");
      option.value = sub;
      option.textContent = sub.charAt(0).toUpperCase() + sub.slice(1);
      if (sub === data.default) option.selected = true;
      subcategorySelect.appendChild(option);
    });

    subcategorySelect.disabled = false;
  });

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(form).entries());

    // Normalizar el monto (reemplazar coma por punto)
    const rawAmount = data.amount.trim();
    const normalizedAmount = rawAmount.replace(',', '.');
    const parsedAmount = parseFloat(normalizedAmount);

    if (isNaN(parsedAmount)) {
      status.innerText = '❌ El monto ingresado no es válido.';
      return;
    }

    data.amount = parsedAmount;

    // Validar que la fecha no sea pasada
    const selectedDate = new Date(data.date);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    if (selectedDate < now) {
      status.innerText = '⚠️ La fecha no puede estar en el pasado.';
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(data).toString()
      });

      const result = await response.json();
      if (result.result === 'Success') {
        status.innerText = '✅ Gasto registrado exitosamente.';
        form.reset();
        subcategorySelect.disabled = true;
      } else {
        status.innerText = '⚠️ Error inesperado.';
      }
    } catch (err) {
      console.error(err);
      status.innerText = '❌ Error al enviar el formulario.';
    }
  });

  resetBtn.addEventListener('click', () => {
    form.reset();
    subcategorySelect.disabled = true;
    status.innerText = '';
  });
});
