// Variables y Objetos globales.
var mapa = null;

function cargarMapa(){
	// Paraguay.
	var longitud = -58.4309129;
	var latitud = -23.8961407;

	var zoom = 6;
	var layerEstablecimientos;

	// Cluster de marcadores.
	var cluster_marcadores;

    // Se instancia el objeto mapa.
	mapa =  L.map('map-container', {
		minZoom: 4,
		maxZoom: 17
	}).setView([latitud, longitud], zoom);

	// Humanitarian Style.
	L.tileLayer('http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
		maxZoom: 18,
		attribution: 'Data \u00a9 <a href="http://www.openstreetmap.org/copyright">' +
          'OpenStreetMap Contributors </a> Tiles \u00a9 HOT'
	}).addTo(mapa);

	// Hacer llamada ajax.
	$.ajax({
		url: "recursos/datos/establecimientos.geojson",
		dataType: 'json',
		type: 'post',
		success: function(datos){
			layerEstablecimientos = L.geoJson(datos, {
				onEachFeature: onEachFeature,
				pointToLayer: function(p_feature, p_latlng) {
	                var v_icono =  L.icon({
	                    iconUrl: 'recursos/img/hospital_48px.png',
	                    iconSize: [48, 48]
	                });
	                return L.marker(p_latlng, {
	                	icon: v_icono
	                });
            	}
			});
			cluster_marcadores = L.markerClusterGroup();   				// Se crea un cluster group.
			cluster_marcadores.addLayer(layerEstablecimientos);   		// Agrega el Layer GeoJSON al cluster group.
			mapa.addLayer(cluster_marcadores);           				// Agrega el cluster group al mapa.
		},
		error: function(msg) {
			console.log("Error!!!");
		}
	});

	// Funcion que muestra informacion en un popup.
	function onEachFeature(p_feature, p_layer) {
		if (p_feature.properties) {
            var v_popupString = '<div class="popup">';

            for (var k in p_feature.properties) {
                var v = p_feature.properties[k];
                v_popupString += '<b>' + k + '</b>: ' + v + '<br />';
            }
            v_popupString += '</div>';
            p_layer.bindPopup(v_popupString);
        }
	}
}
