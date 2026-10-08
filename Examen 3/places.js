// Lugares de interés en Medellín, Colombia
window.places = [
  { name: "Plaza Botero", lat: 6.2473, lon: -75.5782, type: "historico", icon: "🎨" },
  { name: "Parque Explora", lat: 6.2505, lon: -75.5673, type: "cultural", icon: "🔬" },
  { name: "Jardín Botánico", lat: 6.2322, lon: -75.5808, type: "natural", icon: "🌹" },
  { name: "Pueblito Paisa", lat: 6.2503, lon: -75.5635, type: "historico", icon: "🏘️" },
  { name: "Catedral Metropolitana", lat: 6.2491, lon: -75.5707, type: "historico", icon: "⛪" },
  { name: "Museo de Antioquia", lat: 6.2482, lon: -75.5728, type: "museo", icon: "🏛️" },
  { name: "Parque Lleras", lat: 6.2055, lon: -75.5705, type: "cultural", icon: "🌳" },
  { name: "Biblioteca España", lat: 6.3010, lon: -75.5430, type: "cultural", icon: "📚" },
  { name: "Parque Norte", lat: 6.2800, lon: -75.5600, type: "natural", icon: "🌳" },
  { name: "Universidad de Antioquia", lat: 6.2510, lon: -75.5650, type: "cultural", icon: "🎓" }
];

// Función para obtener coordenadas de un lugar por nombre
window.getPlaceByName = function(name) {
  return window.places.find(place => place.name === name);
};

// Función para obtener todos los lugares de un tipo específico
window.getPlacesByType = function(type) {
  return window.places.filter(place => place.type === type);
};