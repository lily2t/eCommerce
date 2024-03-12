document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            
            window.location.href = '/admin/dashboard';
        } else {
            alert(data.data.result);
        }
    } catch (error) {
        console.error('Error logging in:', error);
        alert('Error logging in. Please try again later.');
    }
});
