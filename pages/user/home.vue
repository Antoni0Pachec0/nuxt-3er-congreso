<template>
    <main class="home-page">
        <div class="container">
            <h1>Bienvenido al 3er Congreso Internacional</h1>
            <div class="button-group">
                <button class="btn primary" @click="goToGame">Game</button>
                <button class="btn danger" @click="logout">Cerrar Sesión</button>
            </div>
        </div>
    </main>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

function goToGame() {
    // Redirect to the game page
    // You can change this route to the actual game route when it's created
    alert('¡Redirigiendo al juego!');
}

function logout() {
    // Clear authentication tokens
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    
    // Redirect to login page
    router.push('/login');
}
</script>

<style scoped>
.home-page {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #f5f5f5;
}
.container {
    text-align: center;
    padding: 2rem;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    max-width: 500px;
    width: 100%;
}
h1 {
    margin-bottom: 2rem;
    color: #333;
}
.button-group {
    display: flex;
    gap: 1rem;
    justify-content: center;
}
.btn {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
    transition: background-color 0.2s;
}
.primary {
    background-color: #4CAF50;
    color: white;
}
.primary:hover {
    background-color: #45a049;
}
.danger {
    background-color: #f44336;
    color: white;
}
.danger:hover {
    background-color: #d32f2f;
}
</style>

