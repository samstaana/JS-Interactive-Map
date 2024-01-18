// map object
const myMap = {
    coordinates: [],
    businesses: [],
    map: {},
    markers: [], // Change this to an array

    // build leaflet map
    buildMap() {
        this.map = L.map('map', {
            center: this.coordinates,
            zoom: 11,
        });

        // add openstreetmap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            minZoom: '15',
        }).addTo(this.map);

        // create and add user geolocation marker
        const marker = L.marker(this.coordinates)
            .addTo(this.map)
            .bindPopup('<p1><b>You are here</b><br></p1>')
            .openPopup();
    },

    // add business markers
    addBusinessMarkers() {
        this.businesses.forEach((business) => {
            const { lat, lng } = business.location;
            const marker = L.marker([lat, lng]).addTo(this.map);
            this.markers.push(marker);
        });
    },
};

// get coordinates via geolocation api
async function getCoords() {
    const pos = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });
    return [pos.coords.latitude, pos.coords.longitude];
}

// get foursquare businesses and process foursquare array
async function fetchBusinesses(location, businessType) {
    const apiKey = 'fsq3yfu87Bx/QPemO1RyT5rpdDoYJOHDAAv+rKbaSCJJlE0=';
    const apiUrl = `https://api.foursquare.com/v2/venues/search?ll=${location[0]},${location[1]}&query=${businessType}&limit=10&client_id=${apiKey}&client_secret=${apiKey}&v=20230523`;
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data.response.venues;
    } catch (error) {
        console.error('Error fetching business data:', error);
        return [];
    }
}

// window load
window.onload = async () => {
    const coords = await getCoords();
    console.log(coords);
    myMap.coordinates = coords;
    myMap.buildMap();
    myMap.addBusinessMarkers(); // Call the function to add business markers
};

// business submit button
document.getElementById('submit').addEventListener('click', async (event) => {
    event.preventDefault();
    let business = document.getElementById('business').value;
    console.log(business);
});

