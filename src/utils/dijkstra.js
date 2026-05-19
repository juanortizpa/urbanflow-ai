// Algoritmo de Dijkstra para optimizacion de rutas urbanas

export function dijkstra(graph, startNode, endNode) {
  const distances = {};
  const previous = {};
  const visited = new Set();
  const nodes = Object.keys(graph);

  nodes.forEach(node => {
    distances[node] = node === startNode ? 0 : Infinity;
    previous[node] = null;
  });

  while (visited.size < nodes.length) {
    const currentNode = nodes
      .filter(n => !visited.has(n))
      .reduce((minNode, n) => (distances[n] < distances[minNode] ? n : minNode), nodes[0]);

    if (distances[currentNode] === Infinity || currentNode === endNode) break;
    visited.add(currentNode);

    const neighbors = graph[currentNode] || {};
    Object.entries(neighbors).forEach(([neighbor, weight]) => {
      const newDist = distances[currentNode] + weight;
      if (newDist < distances[neighbor]) {
        distances[neighbor] = newDist;
        previous[neighbor] = currentNode;
      }
    });
  }

  const path = [];
  let current = endNode;
  while (current) {
    path.unshift(current);
    current = previous[current];
  }

  return {
    path: path[0] === startNode ? path : [],
    distance: distances[endNode],
    cost: distances[endNode] !== Infinity ? distances[endNode] : null,
  };
}

// Construir grafo de ciudad simulado
export function buildCityGraph(trafficData = {}) {
  const baseGraph = {
    'Terminal Norte': { 'Av. Universitaria': 2.1, 'Zona Industrial': 5.3 },
    'Av. Universitaria': { 'Terminal Norte': 2.1, 'Hospital Regional': 1.8, 'Plaza Central': 3.2 },
    'Hospital Regional': { 'Av. Universitaria': 1.8, 'Barrio Las Palmas': 2.4, 'Mercado Sur': 3.1 },
    'Plaza Central': { 'Av. Universitaria': 3.2, 'Parque Central': 0.8, 'Centro Comercial': 2.6, 'Barrio Las Palmas': 1.9 },
    'Parque Central': { 'Plaza Central': 0.8, 'Museo Ciudad': 0.5 },
    'Museo Ciudad': { 'Parque Central': 0.5, 'Plaza Central': 1.2 },
    'Barrio Las Palmas': { 'Hospital Regional': 2.4, 'Plaza Central': 1.9, 'Centro Comercial': 1.5 },
    'Centro Comercial': { 'Plaza Central': 2.6, 'Barrio Las Palmas': 1.5, 'Zona Industrial': 4.2 },
    'Mercado Sur': { 'Hospital Regional': 3.1, 'Terminal Sur': 1.4 },
    'Terminal Sur': { 'Mercado Sur': 1.4, 'Zona Industrial': 6.1 },
    'Zona Industrial': { 'Terminal Norte': 5.3, 'Centro Comercial': 4.2, 'Terminal Sur': 6.1 },
  };

  // Ajustar pesos segun trafico
  const adjustedGraph = {};
  Object.entries(baseGraph).forEach(([node, neighbors]) => {
    adjustedGraph[node] = {};
    Object.entries(neighbors).forEach(([neighbor, dist]) => {
      const trafficMultiplier = trafficData[node]?.congestion
        ? 1 + (trafficData[node].congestion / 100) * 1.5
        : 1;
      adjustedGraph[node][neighbor] = dist * trafficMultiplier;
    });
  });

  return adjustedGraph;
}

export function calculateOptimalRoute(from, to, trafficZones = []) {
  const trafficData = {};
  trafficZones.forEach(zone => {
    trafficData[zone.name] = { congestion: zone.congestion };
  });

  const graph = buildCityGraph(trafficData);
  const nodes = Object.keys(graph);

  const fromNode = nodes.find(n => n.toLowerCase().includes(from.toLowerCase())) || nodes[0];
  const toNode = nodes.find(n => n.toLowerCase().includes(to.toLowerCase())) || nodes[nodes.length - 1];

  const result = dijkstra(graph, fromNode, toNode);

  const estimatedTime = Math.round(result.distance * 3.5);
  const estimatedCost = (result.distance * 0.08).toFixed(2);

  return {
    ...result,
    from: fromNode,
    to: toNode,
    estimatedTime,
    estimatedCost,
    alternatives: generateAlternatives(fromNode, toNode, graph),
  };
}

function generateAlternatives(from, to, graph) {
  return [
    { name: 'Ruta Express', time: 15, cost: 0.50, traffic: 'low', type: 'taxi' },
    { name: 'Ruta Economica', time: 28, cost: 0.25, traffic: 'medium', type: 'bus' },
    { name: 'Ruta Bicicleta', time: 22, cost: 0, traffic: 'none', type: 'bike' },
  ];
}

export function predictTraffic(hour, dayOfWeek) {
  const peakHours = [7, 8, 9, 13, 17, 18, 19];
  const isPeak = peakHours.includes(hour);
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

  let baseTraffic = 30;
  if (isPeak && !isWeekend) baseTraffic = 85;
  else if (isPeak && isWeekend) baseTraffic = 60;
  else if (isWeekend) baseTraffic = 45;

  const noise = (Math.random() - 0.5) * 15;
  return Math.min(100, Math.max(0, baseTraffic + noise));
}
