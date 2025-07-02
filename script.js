const form = document.getElementById('expense-form');
const status = document.getElementById('status');

form.addEventListener('submit', async function (e) {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());

  try {
    const response = await fetch('https://script.google.com/macros/s/AKfycbyfzgp2CfLJFIVNe9EY0qN_lR6raF0ieONUJoAkcbvDjXki2OHlBRnQDKSBUALcehq72/exec', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (result.result === 'Success') {
      status.innerText = '✅ Expense registered successfully!';
      form.reset();
    } else {
      status.innerText = '⚠️ Unexpected response.';
    }
  } catch (error) {
    console.error('❌ Error:', error);
    status.innerText = '❌ Error submitting the form.';
  }
});
