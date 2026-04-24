export async function getRoute(start: [number, number], end: [number, number]): Promise<[number, number][]> {
  try {
    const response = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`
    );
    const data = await response.json();
    
    if (data.code === "Ok" && data.routes.length > 0) {
      // OSRM returns coordinates as [lng, lat], Leaflet needs [lat, lng]
      return data.routes[0].geometry.coordinates.map((coord: [number, number]) => [coord[1], coord[0]]);
    }
  } catch (error) {
    console.error("Error fetching route:", error);
  }
  
  // Fallback: direct line if routing fails
  return [start, end];
}
