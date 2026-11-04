let contadorPedidos = 1;

// 1. Registro y Procesamiento del Pedido
document.getElementById('pedidoForm').addEventListener('submit', function (e) {
  e.preventDefault();

  // Obtener datos del formulario
  const cliente = document.getElementById('cliente').value;
  const selectProducto = document.getElementById('producto');
  const productoNombre = selectProducto.options[selectProducto.selectedIndex].getAttribute('data-nombre');
  const precio = parseFloat(selectProducto.options[selectProducto.selectedIndex].getAttribute('data-precio'));
  const cantidad = parseInt(document.getElementById('cantidad').value);
  const metodoPago = document.querySelector('input[name="metodoPago"]:checked').value;

  // Cálculos (Puntos 3 y 4)
  const subtotal = precio * cantidad;
  let descuento = 0;

  if (cantidad >= 5) {
    descuento = subtotal * 0.10;
  }

  const total = subtotal - descuento;

  // Generar código con formato 001, 002...
  const codigo = String(contadorPedidos).padStart(3, '0');
  contadorPedidos++;

  // Estructura en formato TXT (Punto 5)
  const registroTxt = `${codigo}|${cliente}|${productoNombre}|${cantidad}|${precio.toFixed(2)}|${subtotal.toFixed(2)}|${descuento.toFixed(2)}|${total.toFixed(2)}|${metodoPago}`;
  console.log('Registro para pedidos.txt:', registroTxt);

  // Mostrar el pedido registrado en pantalla (Punto 6)
  document.getElementById('ticketCliente').textContent = cliente;
  document.getElementById('ticketProducto').textContent = productoNombre;
  document.getElementById('ticketCantidad').textContent = cantidad;
  document.getElementById('ticketSubtotal').textContent = subtotal.toFixed(2);
  document.getElementById('ticketDescuento').textContent = descuento.toFixed(2);
  document.getElementById('ticketTotal').textContent = total.toFixed(2);
  document.getElementById('ticketPago').textContent = metodoPago;

  document.getElementById('ticketContainer').classList.remove('hidden');

  // Limpiar formulario
  document.getElementById('pedidoForm').reset();
});

// 2. Lectura y Procesamiento del archivo TXT (Puntos 7 y ⭐ Reto Adicional)
document.getElementById('archivoTxt').addEventListener('change', function (e) {
  const archivo = e.target.files[0];
  if (!archivo) return;

  const lector = new FileReader();

  lector.onload = function (evento) {
    const contenido = evento.target.result;
    const lineas = contenido.split('\n');

    const tablaBody = document.querySelector('#tablaPedidos tbody');
    tablaBody.innerHTML = ''; // Limpiar tabla previa

    let acumuladorVentas = 0;
    let contadorRegistros = 0;

    lineas.forEach(linea => {
      // Ignorar líneas vacías
      if (linea.trim() === '') return;

      // Separar por el caracter "|"
      const datos = linea.split('|');

      if (datos.length >= 9) {
        const codigo = datos[0];
        const cliente = datos[1];
        const producto = datos[2];
        const cantidad = datos[3];
        const total = parseFloat(datos[7]);

        // Crear fila en la tabla
        const fila = document.createElement('tr');
        fila.innerHTML = `
          <td>${codigo}</td>
          <td>${cliente}</td>
          <td>${producto}</td>
          <td>${cantidad}</td>
          <td>$${total.toFixed(2)}</td>
        `;
        tablaBody.appendChild(fila);

        // Acumular datos para el reto adicional
        acumuladorVentas += total;
        contadorRegistros++;
      }
    });

    // Mostrar Resumen de Ventas
    document.getElementById('totalPedidos').textContent = contadorRegistros;
    document.getElementById('totalVentas').textContent = acumuladorVentas.toFixed(2);
    document.getElementById('resumenVentas').classList.remove('hidden');
  };

  lector.readAsText(archivo);
});