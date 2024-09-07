import { useState } from "react"

function App() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        fetch("http://localhost:8080/api/sessions/login/", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.status) {
                    localStorage.setItem('token', data.payload);
                    console.log('Token guardado en localStorage');
                } else {
                    localStorage.removeItem('token');
                    console.error(data.message);
                }
            })
            .catch((error) => console.error(error.message));
    };


    return (
        <>
            <h1>Hola Mundo React</h1>

            <h3>Inicio de sesión</h3>

            <div>
                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="password">Contraseña</label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button onClick={handleLogin}>Aceptar</button>
            </div>
    </>
    )
}

export default App
