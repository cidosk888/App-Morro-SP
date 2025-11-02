let mapa = null;

async function initMap() {
    if (mapa) return;

    try {
        // Cria o mapa centralizado na ilha
        mapa = L.map("mapa", {
            dragging: true,           // Permite arrastar o mapa
            scrollWheelZoom: true,    // Zoom com roda do mouse
            doubleClickZoom: true,
            boxZoom: true,
            keyboard: true,
            touchZoom: true
        }).setView([-13.3765, -38.9125], 16);

        // Fundo OpenStreetMap
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19,
            attribution: '© OpenStreetMap contributors'
        }).addTo(mapa);

        // Desativa arrastar o mapa enquanto segura um marcador
        mapa.dragging.disable();

        // Carrega os pontos
        const response = await fetch("points.json");
        if (!response.ok) throw new Error("points.json não encontrado");

        const points = await response.json();

        points.forEach(p => {
            const cores = {
                praia: "blue",
                restaurante: "green",
                bar: "purple",
                ponto: "orange",
                embarque: "red"
            };
            const cor = cores[p.tipo] || "gray";

            // Marcador arrastável
            const marker = L.circleMarker([p.lat, p.lng], {
                color: cor,
                fillColor: cor,
                radius: 10,
                fillOpacity: 0.9,
                draggable: true
            }).addTo(mapa);

            // Ao começar a arrastar o marcador
            marker.on('dragstart', () => {
                mapa.dragging.disable(); // Bloqueia movimento do mapa
            });

            // Ao terminar de arrastar
            marker.on('dragend', (e) => {
                mapa.dragging.enable(); // Restaura movimento do mapa
                const pos = e.target.getLatLng();
                const lat = pos.lat.toFixed(6);
                const lng = pos.lng.toFixed(6);
                alert(`Marcador movido!\n\n"${p.nome}"\nLat: ${lat}\nLng: ${lng}\n\nCopie e cole no points.json`);
                console.log(`Atualize no points.json:\n"lat": ${lat},\n"lng": ${lng}`);
            });

            // Popup
            const googleLink = `https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lng}`;
            marker.bindPopup(`
                <b>${p.nome}</b><br>
                <img src="${p.imagem}" style="width:100%; max-height:150px; object-fit:cover; margin:5px 0; border-radius:8px;"><br>
                <small>${p.descricao}</small><br>
                <a href="${googleLink}" target="_blank" style="color:#007bff; text-decoration:none; font-weight:bold;">Abrir no Google Maps</a>
            `);
        });

        // Reativa o arrastar do mapa após carregar
        setTimeout(() => mapa.dragging.enable(), 500);

    } catch (error) {
        console.error("Erro ao carregar mapa:", error);
        document.getElementById("mapa").innerHTML = "<p style='text-align:center; color:red;'>Erro ao carregar o mapa.</p>";
    }
}

// Funções de navegação
function mostrarMapa() {
    document.getElementById("mapa").style.display = "block";
    document.getElementById("mares").style.display = "none";
    document.getElementById("guia").style.display = "none";
    if (!mapa) initMap();
    else {
        setTimeout(() => {
            mapa.invalidateSize();
            mapa.setView([-13.3765, -38.9125], 16);
            if (mapa.dragging) mapa.dragging.enable();
        }, 100);
    }
}

function mostrarMares() {
    document.getElementById("mapa").style.display = "none";
    document.getElementById("mares").style.display = "block";
    document.getElementById("guia").style.display = "none";
}

function mostrarGuia() {
    document.getElementById("mapa").style.display = "none";
    document.getElementById("mares").style.display = "none";
    document.getElementById("guia").style.display = "block";
}

window.onload = mostrarMapa;