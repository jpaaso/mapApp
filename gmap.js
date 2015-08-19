var screen;
function setScreenWidth () {
	if (window.screen.width > 1000) {
		screen = 'lg';
	} else if (window.screen.width > 700) {
		screen = 'md';
	} else {
		screen = 'sm';
	}
}

function initialize() {
	var mapCenter = new google.maps.LatLng(60.1733239, 24.9410248);
	var mapOptions = { zoom: 14, center: mapCenter, disableDefaultUI: true };
	var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

	var temppelinaukio = new google.maps.LatLng(60.173012, 24.9251964);
	var metroasema = new google.maps.LatLng(60.16898, 24.931733);
	var kansallismuseo = new google.maps.LatLng(60.1749786,24.9316106);

	new CustomMarker(temppelinaukio, map, { marker_id: '1', rooms: '1', price: 100000 });
	new CustomMarker(metroasema, map, { marker_id: '2', rooms: '2', price: 150000 });
	new CustomMarker(kansallismuseo, map, { marker_id: '2', rooms: '5', price: 700000 });

	setScreenWidth();
}
google.maps.event.addDomListener(window, 'load', initialize);

function CustomMarker(latlng, map, args) {
	this.latlng = latlng;	
	this.args = args;	
	this.setMap(map);	
}

function setMarkerColor(div, price) {
	div.style.background = 'white';
	var border = '3px solid ';
	if (price <= 100000) {
		border += 'green';
	} else if (price >= 100000 && price < 200000) {
		border += 'red';
	} else {
		border += 'black';
	}
	div.style.border = border;
}

function setMarkerStyle(div, args) {
	div.className = 'marker';	
	div.innerHTML = args.rooms;
	setMarkerColor(div, args.price);
}

CustomMarker.prototype = new google.maps.OverlayView();

CustomMarker.prototype.draw = function() {
	
	var self = this;	
	var div = this.div;
	
	if (!div) {
	
		div = this.div = document.createElement('div');
		setMarkerStyle(div, self.args);
		
		if (typeof(self.args.marker_id) !== 'undefined') {
			div.dataset.marker_id = self.args.marker_id;
		}
		
		google.maps.event.addDomListener(div, "click", function(event) {
			alert('You clicked on a custom marker!');			
			google.maps.event.trigger(self, "click");
		});
		
		var panes = this.getPanes();
		panes.overlayImage.appendChild(div);
	}
	
	var point = this.getProjection().fromLatLngToDivPixel(this.latlng);
	
	if (point) {
		div.style.left = (point.x - 10) + 'px';
		div.style.top = (point.y - 20) + 'px';
	}
};

CustomMarker.prototype.remove = function() {
	if (this.div) {
		this.div.parentNode.removeChild(this.div);
		this.div = null;
	}	
};

CustomMarker.prototype.getPosition = function() {
	return this.latlng;	
};