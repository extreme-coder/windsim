import React, { useEffect, useRef, useState } from "react";
import { Alert, Col, Container, Row } from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import Marker from './Marker';
import { useGetSpeedQuery } from './services/windsim';
import TurbineData from "./TurbineData";

function WindMap({ center, zoom, mapTypeId }: { center: google.maps.LatLngLiteral; zoom: number; }) {
  const ref = useRef();
  const [map, setMap] = useState()
  const [clicks, setClicks] = useState([]);
  const [coords, setCoords] = useState([]);
  const [currentCoord, setCurrentCoord] = useState({ lat: 0, lng: 0 })
  const chartData = (turbineData) => {
    let c = [
      { month: 'January', power: 0 },
      { month: 'February', power: 0 },
      { month: 'March', power: 0 },
      { month: 'April', power: 0 },
      { month: 'May', power: 0 },
      { month: 'June', power: 0 },
      { month: 'July', power: 0 },
      { month: 'August', power: 0 },
      { month: 'September', power: 0 },
      { month: 'October', power: 0 },
      { month: 'November', power: 0 },
      { month: 'December', power: 0 }
    ]
    turbineData.forEach((data) => {
      data.forEach((d, i) => {
        let dataOriginal = c[i]
        c[i] = { ...dataOriginal, power: dataOriginal.power + d.power }
      })
    })
    return c
  }

  const [turbineData, setTurbineData] = useState([])

  useEffect(() => {
    /*new window.google.maps.Map(ref.current, {
      center,
      zoom,
    });*/
    setMap(new window.google.maps.Map(ref.current, {
      center,
      zoom, mapTypeId
    }))
  }, [center, zoom]);

  const useOnClick = (e) => {
    console.log('test')
    setCoords([...coords, { lat: e.latLng.lat(), lng: e.latLng.lng(), latLng: e.latLng, id: Math.random() * 100.00, selected: false, hasData: true }])
    setClicks([...clicks, e.latLng]);
    setCurrentCoord({ lat: e.latLng.lat(), lng: e.latLng.lng() })
    return true
  };

  useEffect(() => {
    if (map) {
      ["click"].forEach((eventName) =>
        google.maps.event.clearListeners(map, eventName)
      );

      if (useOnClick) {
        map.addListener("click", useOnClick);
      }
    }
  }, [map, useOnClick])

  const useRemoveMarker = (id) => {
    setCoords(coords.filter((c, i) => i !== id))
    useState()
  }

  const select = (id, state) => {
    setCoords(coords.map((c, i) => (i === id) ? { ...c, selected: state } : { ...c, selected: false }))
  }

  const noData = (id) => {
    setCoords(coords.map((c, i) => (i === id) ? { ...c, hasData: false } : c))
    return
  }

  const updateChartData = (d, id) => {
    let copy = [...turbineData]
    copy[id] = d
    setTurbineData(copy)
  }

  const onDrag = (e) => {
    console.log(e)
    setCoords([...coords.filter(c => (c.latLng.lat !== e.latLng.lat() && c.latLng.lng !== e.latLng.lng())), { lat: e.latLng.lat(), lng: e.latLng.lng(), latLng: e.latLng, id: Math.random() * 100.00, selected: false, hasData: true }])
    setClicks([...clicks, e.latLng]);
    setCurrentCoord({ lat: e.latLng.lat(), lng: e.latLng.lng() })
    return true
  }

  return <>
    <Container fluid>
      <Row>
        <Col>
          <div ref={ref} id="map" style={{ width: `${window.innerHeight * (5 / 4) * 0.925}px`, height: `${window.innerHeight * 0.925}px` }} />
          {coords.map((c, i) => (<Marker key={i} position={c.latLng} map={map} id={i} isSelected={c.selected} hasData={c.hasData} onDrag={onDrag} />))}
        </Col>
        {coords.length > 0 && <>
          <Col sm={2} id={"customscroll"} style={{ overflow: 'auto', height: `${window.innerHeight * 0.925}px` }}>
            {coords.map((c, i) => <TurbineData coords={c} id={i} removeMarker={useRemoveMarker} select={select} noData={noData} updateData={updateChartData} />)}
          </Col>
          <Col>
            {coords.length > 0 && <Bar
              options={{
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }}
              data={{
                labels: chartData(turbineData).map(a => a.month),
                datasets: [{
                  label: "Average Power Output (kWh)",
                  data: chartData(turbineData).map(a => a.power)
                }]
              }}
            />}
            <h5>{coords.length} turbine{(coords.length === 1) ? '' : 's'} generating {Math.round(chartData(turbineData).map(a => a.power).reduce((a, b) => a + b, 0) / (12))} kWh of electricity per month, enough to power {Math.round(chartData(turbineData).map(a => a.power).reduce((a, b) => a + b, 0) / (886 * 12))} home{(coords.length === 1) ? '' : 's'}</h5>
          </Col>
        </>}
        {coords.length === 0 && <Col><h4>No turbines yet. Click on the map to place one!</h4></Col>}
      </Row>
    </Container>
  </>;
}

export default WindMap