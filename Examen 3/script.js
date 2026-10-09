// Algoritmo Held-Karp para el Problema del Viajante de Comercio (TSP) con Programación Dinámica
class HeldKarpTSP {
  constructor(distMatrix, startIndex = 0) {
    this.distMatrix = distMatrix;
    this.n = distMatrix.length;
    this.startIndex = startIndex;
    this.memo = new Map(); // Para memoización: clave = mask + "," + u
    this.parent = new Map(); 
  }

  // Calcula la distancia mínima para visitar todos los lugares en 'mask' terminando en 'u'
  tsp(mask, u) {
    const key = `${mask},${u}`;

    // Si ya está calculado, devolverlo
    if (this.memo.has(key)) {
      return this.memo.get(key);
    }

    // Caso base: si todos los lugares han sido visitados
    if (mask === ((1 << this.n) - 1)) {
      return this.distMatrix[u][this.startIndex]; // Volver al inicio
    }

    let minDist = Infinity;
    let bestNext = -1;

    // Probar visitar cada lugar no visitado
    for (let v = 0; v < this.n; v++) {
      if (!(mask & (1 << v))) { // Si el lugar v no ha sido visitado
        const newMask = mask | (1 << v);
        const dist = this.distMatrix[u][v] + this.tsp(newMask, v);

        if (dist < minDist) {
          minDist = dist;
          bestNext = v;
        }
      }
    }

    // Guardar resultado y decisión óptima
    this.memo.set(key, minDist);
    this.parent.set(key, bestNext);

    return minDist;
  }

  // Reconstruye el camino óptimo
  reconstructPath() {
    const path = [this.startIndex];
    let mask = 1 << this.startIndex;
    let u = this.startIndex;

    while (mask !== ((1 << this.n) - 1)) {
      const key = `${mask},${u}`;
      const v = this.parent.get(key);
      path.push(v);
      mask |= (1 << v);
      u = v;
    }

    // Volver al inicio
    path.push(this.startIndex);
    return path;
  }

  // Resuelve el TSP y devuelve la distancia mínima y el camino
  solve() {
    const initialMask = 1 << this.startIndex;
    const minDistance = this.tsp(initialMask, this.startIndex);
    const path = this.reconstructPath();
    return { minDistance, path };
  }
}

// Función para calcular distancia Haversine entre dos coordenadas (fallback)
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radio de la Tierra en km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distancia en km
}

// Función para obtener distancia real de conducción entre dos coordenadas usando OSRM
async function getOSRMDistance(lat1, lon1, lat2, lon2) {
  try {
    const url = `http://router.project-osrm.org/route/v1/driving/${lon1},${lat1};${lon2},${lat2}?overview=false`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`OSRM error: ${response.status}`);
    const data = await response.json();
    return data.routes[0].distance / 1000; // Convertir de metros a kilómetros
  } catch (error) {
    console.warn('Error fetching OSRM distance, falling back to Haversine:', error);
    // Fallback a distancia Haversine si OSRM falla
    return haversineDistance(lat1, lon1, lat2, lon2);
  }
}

// Función para obtener la geometría real de la ruta entre dos puntos
async function getOSRMRoute(lat1, lon1, lat2, lon2) {
  try {
    const url = `http://router.project-osrm.org/route/v1/driving/${lon1},${lat1};${lon2},${lat2}?overview=full&geometries=geojson`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`OSRM error: ${response.status}`);
    const data = await response.json();
    // OSRM devuelve [lon, lat], necesitamos [lat, lng] para Leaflet
    return data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
  } catch (error) {
    console.warn('Error fetching OSRM route, falling back to straight line:', error);
    // Fallback a línea recta
    return [[lat1, lon1], [lat2, lon2]];
  }
}

// Función para crear matriz de distancias usando OSRM (asíncrona)
async function createDistanceMatrixOSRM(places) {
  const n = places.length;
  const matrix = Array.from({ length: n }, () => Array(n).fill(0));

  // Mostrar indicador de cálculo de distancias
  document.getElementById('results').innerHTML = '<p>Calculando distancias reales de conducción...</p>';

  // Calcular todas las distancias pares (optimizado: solo mitad superior)
  const promises = [];
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      promises.push(
        getOSRMDistance(places[i].lat, places[i].lon, places[j].lat, places[j].lon)
          .then(distance => {
            matrix[i][j] = distance;
            matrix[j][i] = distance; // Matriz simétrica
          })
      );
    }
  }

  // Esperar a que todas las distancias se calculen
  await Promise.all(promises);

  return matrix;
}

// Función para obtener la geometría completa de la ruta óptima
async function getFullRouteGeometry(places, path) {
  const fullGeometry = [];

  // Para cada segmento consecutivo en la ruta óptima
  for (let i = 0; i < path.length - 1; i++) {
    const fromIndex = path[i];
    const toIndex = path[i + 1];
    const fromPlace = places[fromIndex];
    const toPlace = places[toIndex];

    // Obtener la geometría real de la ruta entre estos dos puntos
    const segmentGeometry = await getOSRMRoute(
      fromPlace.lat, fromPlace.lon,
      toPlace.lat, toPlace.lon
    );

    // Agregar a la geometría completa (evitar duplicar puntos intermedios)
    if (i === 0) {
      fullGeometry.push(...segmentGeometry);
    } else {
      fullGeometry.push(...segmentGeometry.slice(1)); // Saltar el primer punto (ya está al final del segmento anterior)
    }
  }

  return fullGeometry;
}

// Función para animar un auto moviéndose por la ruta
function animateCarOnRoute(map, routeGeometry, onComplete) {
  if (!routeGeometry || routeGeometry.length < 2) {
    if (onComplete) onComplete();
    return;
  }

  // Icono de auto (usando un emoji)
  const carIcon = L.divIcon({
    html: '🚗',
    className: 'car-marker',
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  });

  // Crear marcador del auto
  const carMarker = L.marker(routeGeometry[0], { icon: carIcon }).addTo(map);

  // Configuración de animación
  const totalDuration = 8000; // 8 segundos para toda la ruta (ajustable)
  const segmentDuration = totalDuration / (routeGeometry.length - 1);
  let startTime = null;
  let animationFrameId = null;

  function animateStep(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;

    // Calcular qué segmento estamos animando y el progreso dentro de ese segmento
    const segmentIndex = Math.floor(elapsed / segmentDuration);
    if (segmentIndex >= routeGeometry.length - 1) {
      // Animación completada
      carMarker.remove();
      if (onComplete) onComplete();
      return;
    }

    const segmentProgress = (elapsed % segmentDuration) / segmentDuration;
    const startPoint = routeGeometry[segmentIndex];
    const endPoint = routeGeometry[segmentIndex + 1];

    // Interpolar posición actual
    const currentLat = startPoint[0] + (endPoint[0] - startPoint[0]) * segmentProgress;
    const currentLng = startPoint[1] + (endPoint[1] - startPoint[1]) * segmentProgress;

    carMarker.setLatLng([currentLat, currentLng]);

    // Solicitar próximo frame
    animationFrameId = requestAnimationFrame(animateStep);
  }

  // Iniciar animación
  animationFrameId = requestAnimationFrame(animateStep);

  // Devolver función para detener animación si es necesario
  return () => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
    carMarker.remove();
  };
}

// Inicializar el mapa de Leaflet
let map;
let markers = [];
let routePolyline = null;
let carAnimationStopper = null;

// Coordenadas iniciales centrado en Medellín, Colombia
const initialPosition = [6.2473, -75.5782];

// Inicializar el mapa cuando se cargue la página
document.addEventListener('DOMContentLoaded', () => {
  initMap();
  loadPlaces();
  setupEventListeners();
});

// Inicializar el mapa de Leaflet
function initMap() {
  map = L.map('map').setView(initialPosition, 15);

  // Agregar capa de OpenStreetMap
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // Agregar control de escala
  L.control.scale().addTo(map);
}

// Cargar lugares (usando la variable global de places.js)
function loadPlaces() {
  try {
    // Verificar si window.places está disponible y es un array válido (definido en places.js)
    if (window.places && Array.isArray(window.places) && window.places.length > 0) {
      window.placesData = { places: window.places };
    } else {
      // Datos de respaldo si algo falla
      window.placesData = {
        places: [
          { name: "Plaza Botero", lat: 6.2473, lon: -75.5782 },
          { name: "Parque Explora", lat: 6.2505, lon: -75.5673 },
          { name: "Jardín Botánico", lat: 6.2322, lon: -75.5808 },
          { name: "Pueblito Paisa", lat: 6.2503, lon: -75.5635 },
          { name: "Catedral Metropolitana", lat: 6.2491, lon: -75.5707 }
        ]
      };
    }
    renderPlacesList();
  } catch (error) {
    console.error('Error loading places:', error);
    // Datos de respaldo
    window.placesData = {
      places: [
        { name: "Plaza Botero", lat: 6.2473, lon: -75.5782 },
        { name: "Parque Explora", lat: 6.2505, lon: -75.5673 },
        { name: "Jardín Botánico", lat: 6.2322, lon: -75.5808 },
        { name: "Pueblito Paisa", lat: 6.2503, lon: -75.5635 },
        { name: "Catedral Metropolitana", lat: 6.2491, lon: -75.5707 }
      ]
    };
    renderPlacesList();
  }
}

// Renderizar la lista de lugares en el sidebar
function renderPlacesList() {
  const placesList = document.getElementById('placesList');
  placesList.innerHTML = '';

  window.placesData.places.forEach((place, index) => {
    const li = document.createElement('li');
    li.className = 'place-item';
    li.innerHTML = `
      <span class="place-icon">${place.icon || '📍'}</span>
      <span class="place-name">${place.name}</span>
      <input type="checkbox" class="place-checkbox" data-index="${index}">
    `;
    placesList.appendChild(li);
  });
}

// Configurar eventos de la interfaz
function setupEventListeners() {
  // Botón para calcular ruta
  document.getElementById('calculateBtn').addEventListener('click', calculateOptimalRoute);

  // Botón para limpiar selección
  document.getElementById('clearBtn').addEventListener('click', clearSelection);

  // Evento de clic en el mapa para agregar lugares
  map.on('click', function (e) {
    const lat = e.latlng.lat;
    const lng = e.latlng.lng;
    addCustomMarker(lat, lng);
  });
}

// Agregar un marcador personalizado al mapa
function addCustomMarker(lat, lng) {
  const marker = L.marker([lat, lng]).addTo(map);
  marker.bindPopup(`Coordenadas: ${lat.toFixed(6)}, ${lng.toFixed(6)}`).openPopup();
  markers.push(marker);
}

// Limpiar selección y ruta
function clearSelection() {
  // Detener animación si está activa
  if (carAnimationStopper) {
    carAnimationStopper();
    carAnimationStopper = null;
  }

  // Remover todos los marcadores personalizados
  markers.forEach(marker => map.removeLayer(marker));
  markers = [];

  // Remover ruta si existe
  if (routePolyline) {
    map.removeLayer(routePolyline);
    routePolyline = null;
  }

  // Desmarcar todos los checkboxes
  document.querySelectorAll('.place-checkbox').forEach(checkbox => {
    checkbox.checked = false;
  });

  // Limpiar resultados
  document.getElementById('results').innerHTML = '';
}

// Calcular la ruta óptima usando Held-Karp con distancias reales de OSRM
async function calculateOptimalRoute() {
  // Detener cualquier animación previa
  if (carAnimationStopper) {
    carAnimationStopper();
    carAnimationStopper = null;
  }

  // Remover ruta y marcadores previos
  if (routePolyline) {
    map.removeLayer(routePolyline);
    routePolyline = null;
  }
  markers.forEach(marker => map.removeLayer(marker));
  markers = [];

  // Obtener lugares seleccionados
  const selectedPlaces = [];
  const checkboxes = document.querySelectorAll('.place-checkbox:checked');

  checkboxes.forEach(checkbox => {
    const index = parseInt(checkbox.dataset.index);
    selectedPlaces.push(window.places[index]);
  });

  // Validar selección
  if (selectedPlaces.length < 2) {
    alert('Por favor seleccione al menos 2 lugares para calcular una ruta');
    return;
  }

  try {
    // Mostrar indicador de carga
    document.getElementById('results').innerHTML = '<p>Calculando distancias reales de conducción...</p>';

    // Crear matriz de distancias usando OSRM (asíncrona)
    const distMatrix = await createDistanceMatrixOSRM(selectedPlaces);

    // Resolver TSP con Held-Karp (empezar desde el primer lugar seleccionado)
    const tspSolver = new HeldKarpTSP(distMatrix, 0);
    const result = tspSolver.solve();

    // Mostrar resultados básicos primero
    document.getElementById('results').innerHTML = `
      <h3>Resultado de la Optimización</h3>
      <p><strong>Distancia mínima:</strong> ${result.minDistance.toFixed(2)} km</p>
      <p><strong>Secuencia de visita óptima:</strong></p>
      <ol>
        ${result.path.map((index, i) =>
          `<li>${i + 1}. ${selectedPlaces[index].name}</li>`).join('')}
      </ol>
      <p><em>Algoritmo: Held-Karp con Programación Dinámica (Bitmask DP)</em></p>
      <p><em>Complejidad: O(N²·2ᴺ) donde N = ${selectedPlaces.length}</em></p>
      <p><em>Distancias calculadas usando OSRM (rutas reales de conducción)</em></p>
    `;

    // Obtener la geometría completa de la ruta óptima
    document.getElementById('results').innerHTML += '<p>Obteniendo geometría real de la ruta...</p>';
    const fullRouteGeometry = await getFullRouteGeometry(selectedPlaces, result.path);

    // Dibujar ruta real en el mapa
    drawRealRouteOnMap(fullRouteGeometry, selectedPlaces);

    // Animar auto moviéndose por la ruta
    document.getElementById('results').innerHTML += '<p>Iniciando animación de recorrido...</p>';
    carAnimationStopper = animateCarOnRoute(
      map,
      fullRouteGeometry,
      () => {
        document.getElementById('results').innerHTML += '<p><em>Animación completada.</em></p>';
      }
    );

  } catch (error) {
    console.error('Error calculating route:', error);
    document.getElementById('results').innerHTML =
      '<p>Error al calcular la ruta. Por favor intente con menos lugares o verifique su conexión a internet.</p>';
  }
}

// Dibujar la ruta real (siguiendo calles) en el mapa
function drawRealRouteOnMap(routeGeometry, places) {
  // Remover ruta anterior si existe
  if (routePolyline) {
    map.removeLayer(routePolyline);
  }

  // Remover marcadores previos
  markers.forEach(marker => map.removeLayer(marker));
  markers = [];

  // Dibujar polilínea con la geometría real de la ruta
  routePolyline = L.polyline(routeGeometry, {
    color: '#ff7800',
    weight: 6,
    opacity: 0.9
  }).addTo(map);

  // Agregar marcadores numerados en cada lugar
  places.forEach((place, index) => {
    const marker = L.marker([place.lat, place.lon]).addTo(map);
    marker.bindPopup(`
      <b>${index + 1}. ${place.name}</b>
    `).openPopup();
    markers.push(marker);
  });

  // Ajustar el viewport para mostrar toda la ruta
  if (routeGeometry.length > 0) {
    map.fitBounds(routeGeometry, { padding: [50, 50] });
  }
}
