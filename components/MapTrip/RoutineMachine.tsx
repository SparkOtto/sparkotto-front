import L from "leaflet";
import { createControlComponent } from "@react-leaflet/core";
import "leaflet-routing-machine";


const createRoutingMachineLayer = (props: any) => {
  const { originAddress, destinationAddress } = props;

  // Ne pas créer le routing si l'une des coordonnées n'est pas définie
  if (!originAddress || !destinationAddress) {
    return null;
  }

  const instance = L.Routing.control({
    waypoints: [
      L.latLng(originAddress[0], originAddress[1]),
      L.latLng(destinationAddress[0], destinationAddress[1]),
    ],
    lineOptions: {
      styles: [{ color: "#68308E", weight: 8, opacity: 0.8, dashArray: "10,10" }],
    },
    language: 'fr',
    show: true,
    addWaypoints: false,
    routeWhileDragging: false,
    draggableWaypoints: true,
    fitSelectedRoutes: true,
    showAlternatives: false,
    containerClassName: 'leaflet-routing-container bg-white border rounded shadow p-1 mb-3',
  });

  return instance;
};

const RoutineMachine = createControlComponent(createRoutingMachineLayer);

export default RoutineMachine;