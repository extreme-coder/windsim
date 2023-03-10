import { useEffect, useState } from "react";
import { Wrapper, google } from "@googlemaps/react-wrapper";
import { propTypes } from "react-bootstrap/esm/Image";

const Marker = ({ options, position, map, id, isSelected, hasData, onDrag, select }) => {
  const [marker, setMarker] = useState();
  const [mRendered, setMRendered] = useState(false);
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
          animation: window.google.maps.Animation.DROP
        }));
    } 
    if (marker) {
      setMRendered(true)
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
      marker.setOptions({ position });
    }
  }, [marker, position]);

  useEffect(() => {
    if (mRendered) {
      marker.addListener("mouseover", () => { select(id, true) });
      marker.addListener("mouseout", () => { select(id, false) });
    }
  })
  return null;
}

export default Marker