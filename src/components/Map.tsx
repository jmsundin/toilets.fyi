import { Fragment, useRef, useEffect } from "react";
import ReactDOMServer from 'react-dom/server';
// import NearMeIcon from '@mui/icons-material/NearMe';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';

import Script from 'next/script';

let map: google.maps.Map, infoWindow: google.maps.InfoWindow;

declare global {
    interface Window {
        google: any;
        initMap: () => void;
    }
}

export default function Map() {
    useEffect(() => {
        const div = document.getElementById('__next');
        div!.classList.add('h-full');

        window.initMap = () => {
            const google = window.google;
            map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
                center: { lat: -34.397, lng: 150.644 },
                zoom: 6,
            });
            infoWindow = new google.maps.InfoWindow();

            const locationButton = document.createElement("button");

            locationButton.textContent = "Get My Current Location";
            locationButton.style.color = "rgb(0, 0, 0)";

            map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);

            locationButton.addEventListener("click", () => {
            // Try HTML5 geolocation.
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                (position: GeolocationPosition) => {
                    const pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    };

                    infoWindow.setPosition(pos);
                    infoWindow.setContent("Location found.");
                    infoWindow.open(map);
                    map.setCenter(pos);
                },
                () => {
                    handleLocationError(true, infoWindow, map.getCenter()!);
                }
                );
            } else {
                // Browser doesn't support Geolocation
                handleLocationError(false, infoWindow, map.getCenter()!);
            }
            });
        };

        function handleLocationError(
            browserHasGeolocation: boolean,
            infoWindow: google.maps.InfoWindow,
            pos: google.maps.LatLng
        ) {
            infoWindow.setPosition(pos);
            infoWindow.setContent(
            browserHasGeolocation
                ? "Error: The Geolocation service failed."
                : "Error: Your browser doesn't support geolocation."
            );
            infoWindow.open(map);
        }
    }, []);

    return (
        <div id="map" className="w-full h-full"></div>
    );
}