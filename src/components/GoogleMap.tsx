import { useEffect } from 'react'
import Script from 'next/script'

declare global {
   interface Window {
     initMap: () => void;
   }
}

interface MapProps {
   lat: number;
   lon: number;
   center_name: string;
   zoom: number;
   height: string;
   coords: any
}

export default function Map({ lat, lon, center_name, zoom, height, coords }: MapProps) {
   useEffect(() => {
      const initMap = () => {
         const mapOptions = {
            zoom: zoom,
            center: new google.maps.LatLng(lat, lon),
            styles: [
               { "featureType": "all", "elementType": "geometry.fill", "stylers": [{ "weight": "2.00" }] },
               { "featureType": "all", "elementType": "geometry.stroke", "stylers": [{ "color": "#9c9c9c" }] },
               { "featureType": "all", "elementType": "labels.text", "stylers": [{ "visibility": "on" }] },
               { "featureType": "landscape", "elementType": "all", "stylers": [{ "color": "#f2f2f2" }] },
               { "featureType": "landscape", "elementType": "geometry.fill", "stylers": [{ "color": "#ffffff" }] },
               { "featureType": "landscape.man_made", "elementType": "geometry.fill", "stylers": [{ "color": "#ffffff" }] },
               { "featureType": "poi", "elementType": "all", "stylers": [{ "visibility": "off" }] },
               { "featureType": "road", "elementType": "all", "stylers": [{ "saturation": -100 }, { "lightness": 45 }] },
               { "featureType": "road", "elementType": "geometry.fill", "stylers": [{ "color": "#eeeeee" }] },
               { "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#7b7b7b" }] },
               { "featureType": "road", "elementType": "labels.text.stroke", "stylers": [{ "color": "#ffffff" }] },
               { "featureType": "road.highway", "elementType": "all", "stylers": [{ "visibility": "simplified" }] },
               { "featureType": "road.arterial", "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] },
               { "featureType": "transit", "elementType": "all", "stylers": [{ "visibility": "off" }] },
               { "featureType": "water", "elementType": "all", "stylers": [{ "color": "#46bcec" }, { "visibility": "on" }] },
               { "featureType": "water", "elementType": "geometry.fill", "stylers": [{ "color": "#c8d7d4" }] },
               { "featureType": "water", "elementType": "labels.text.fill", "stylers": [{ "color": "#070707" }] },
               { "featureType": "water", "elementType": "labels.text.stroke", "stylers": [{ "color": "#ffffff" }] }
            ]
         }


         const mapElement: any = document.getElementById('map');
         if(mapElement) {
            const map = new google.maps.Map(mapElement!, mapOptions)

            new google.maps.Marker({
               position: new google.maps.LatLng(lat, lon),
               map: map,
               title: center_name
            })

            for(var i = 0; i < coords.length; i++) {
               new google.maps.Marker({
                  position: new google.maps.LatLng(coords[i].lat, coords[i].lon),
                  map: map,
                  title: coords[i].name
               })
            }
         }
         
      }

      if (window.google) {
         initMap()
      } else {
         window.initMap = initMap
      }
   }, [])

   return (
      <>
         <Script src="https://maps.googleapis.com/maps/api/js?key=&callback=initMap" strategy="lazyOnload" />
         <div id="map" style={{ width: '100%', height: height }}></div>
      </>
   )
}
