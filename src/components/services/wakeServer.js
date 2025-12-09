export async function wakeServer() {
  const endpoint = 'https://cestificacoesiso-back.onrender.com/';

  try {
    await fetch(endpoint);
  } catch (error) {
    // ...existing code...
  }
}
