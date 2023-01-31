import { useEffect, useState } from "react";
import { Wrapper, google } from "@googlemaps/react-wrapper";
import { propTypes } from "react-bootstrap/esm/Image";

const Marker = ({ options, position, map, id, isSelected, hasData, onDrag }) => {
  const [marker, setMarker] = useState();
  const iconBase = "/icons";
  const icons = {
    'unselected': iconBase + "/unselected.png",
    'selected': iconBase + "/selected.png",
    'nodata': iconBase + "/nodata.png"
  };

  useEffect(() => {
    if (!marker) {
        setMarker(new window.google.maps.Marker({
          map: map,
          //draggable: true,
          //animation: google.maps.Animation.DROP
        }));
    } 
    if (marker) {
      marker.addListener("drag", onDrag);
    }
    return () => {
      if (marker) {
        marker.setMap(null);
      }
    };
  }, [marker, map]);


  useEffect(() => {
    if (marker) {
      if (!hasData) {
        marker.setOptions({icon: icons.nodata})
      } else {
        if (isSelected) {
          marker.setOptions({icon: icons.selected})
        } else {
          marker.setOptions({icon: icons.unselected})
        }
      }
    }
  }, [marker, isSelected, hasData]);


  useEffect(() => {
    if (marker) {
      marker.setOptions({position});
    }
  }, [marker, position]);
  return null;
}

export default Marker