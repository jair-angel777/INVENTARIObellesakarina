const seed = async () => {
  const locations = [
    { nombre: 'Almacén Central', direccion: 'Av. Industrial 123', tipo: 'ALMACEN' },
    { nombre: 'Tienda Principal', direccion: 'Centro Comercial Real Plaza', tipo: 'TIENDA' }
  ];

  for (const loc of locations) {
    try {
      const res = await fetch('https://backen-inventario.vercel.app/api/locations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loc)
      });
      const data = await res.json();
      console.log(`Resultado para ${loc.nombre}:`, data);
    } catch (e) {
      console.error(`Error creando ${loc.nombre}:`, e.message);
    }
  }
};

seed();
