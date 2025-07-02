const API_URL = 'https://script.google.com/macros/s/AKfycbyVDjdqMgiBaDjEWh8tiBOG1nd4awOCHNZNYRAsF3gPCpsTvXGRg5_lDBFuLNrq1VWZ/exec';
const form = document.getElementById('expense-form');
const status = document.getElementById('status');
// Set today's date as minimum
const today = new Date().toISOString().split('T')[0];
document.getElementById('date').setAttribute('min', today);

form.addEventListener('submit', async function (e) {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());

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
    } else {
      status.innerText = '⚠️ Unexpected response.';
    }
  } catch (error) {
    console.error('❌ Error:', error);
    status.innerText = '❌ Error submitting the form.';
  }
});
// Optional: Add a reset button to clear the form
const resetButton = document.createElement('button');
resetButton.innerText = 'Reset';
resetButton.type = 'button';
resetButton.addEventListener('click', function () {
  form.reset();
  status.innerText = '';
});
document.querySelector('.container').appendChild(resetButton);