const form = document.getElementById('expense-form');
const status = document.getElementById('status');

form.addEventListener('submit', async function (e) {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());

  try {
    const response = await fetch('https://script.google.com/macros/s/AKfycbz6CjzQLw82g9XDw8vYzsBjScAvKXPqGKsF5lb8V0rrrC7NazrodN1mraBPiKJfocAK/exec', {
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
