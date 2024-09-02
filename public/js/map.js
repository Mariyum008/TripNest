
    // let mapToken =  mapToken;
	mapboxgl.accessToken = mapToken;
    console.log(mapToken);

    const map = new mapboxgl.Map({
        container: 'map', // container ID
        center: [72.84055556 , 19.05444444  ], // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 9 // starting zoom
    });
