import React, { useEffect, useRef, useState } from "react";
import { Alert, Button, ButtonGroup, Col, Container, Form, Modal, Row, Tab, Tabs } from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import Marker from './Marker';
import Request from "./Requests";
import { useGetSpeedQuery, useAddAreaRequestMutation, useGetAreaRequestsQuery } from './services/windsim';
import TurbineData from "./TurbineData";

function WindMap({ center, zoom, mapTypeId }: { center: google.maps.LatLngLiteral; zoom: number; }) {
  if (window.localStorage.getItem('session_id') === null) {
    window.localStorage.setItem('session_id', Math.round(Math.random()*100000000000.0))
  }

  const ref = useRef();
  const [map, setMap] = useState()
  const [clicks, setClicks] = useState([]);
  const [coords, setCoords] = useState([]);
  const [currentCoord, setCurrentCoord] = useState({ lat: 0, lng: 0 })
  const [areaMode, setAreaMode] = useState(false)
  const [rect, setRect] = useState(null)
  const [addAreaRequest] = useAddAreaRequestMutation() 
  const { data: requests } = useGetAreaRequestsQuery({session_id: window.localStorage.getItem('session_id')})
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [step, setStep] = useState(0.1)
  const [cycles, setCycles] = useState(10)
  const [name, setName] = useState('My Calculation')

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

  const getBounds = (map) => {
    let b = map.getBounds()
    let north = b.Ja.lo
    let south = b.Ja.hi
    let west = b.Va.lo
    let east = b.Va.hi
    let centerX = (north + south) / 2
    let centerY = (east + west) / 2
    b.Ja.lo = centerX + (north - centerX) * 0.5
    b.Ja.hi = centerX + (south - centerX) * 0.5
    b.Va.lo = centerY + (west - centerY) * 0.5
    b.Va.hi = centerY + (east - centerY) * 0.5
    return b
  }

  const addArea = ((e) => {
    setRect(new google.maps.Rectangle({
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#FF0000",
      fillOpacity: 0.35,
      map,
      bounds: getBounds(map),
      editable: true,
      draggable: true,
    }))
    setAreaMode(true)
  })

  const removeArea = (e) => {
    rect.setMap(null)
    setAreaMode(false)
  }

  const calculate = () => {
    let b = rect.getBounds()
    let y1 = b.Ja.lo
    let y2 = b.Ja.hi
    let x1 = b.Va.lo
    let x2 = b.Va.hi
    addAreaRequest({
      body: {
        data: {
          x1,
          x2,
          y1,
          y2,
          step: step,
          cycles: cycles,
          name: name,
          session_id: window.localStorage.getItem('session_id')
        }
      }
    })
    removeArea()
  }

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

  const addOptimalTurbine = (lat, lng) => {
    setCoords([...coords, { lat: lat, lng: lng, latLng: new google.maps.LatLng(lat, lng), id: Math.random() * 100.00, selected: false, hasData: true }])
    setClicks([...clicks, new google.maps.LatLng(lat, lng)]);
    setCurrentCoord({ lat: lat, lng: lng })
    return true
  }

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
          {coords.map((c, i) => (<Marker key={i} position={c.latLng} map={map} id={i} isSelected={c.selected} hasData={c.hasData} onDrag={onDrag} select={select} />))}
        </Col>
        {requests && (coords.length > 0 || requests.data.length > 0)&& <>
          <Col sm={2} id={"customscroll"} style={{ overflow: 'auto', height: `${window.innerHeight * 0.925}px` }}>
            <p/>
            <Tabs
              defaultActiveKey="turbines"
            >
              <Tab eventKey="turbines" title="Turbines">
                {coords.map((c, i) => <TurbineData coords={c} id={i} removeMarker={useRemoveMarker} select={select} noData={noData} updateData={updateChartData} isSelected={c.selected} />)}
              </Tab>
              <Tab eventKey="requests" title="Calculations">
                {requests && requests.data.map((r) => <Request data={r.attributes} addTurbine={addOptimalTurbine} />)}
              </Tab>
            </Tabs>
          </Col>
          {/*<Col sm={2} id={"customscroll"} style={{ overflow: 'auto', height: `${window.innerHeight * 0.925}px` }}>
            {coords.map((c, i) => <TurbineData coords={c} id={i} removeMarker={useRemoveMarker} select={select} noData={noData} updateData={updateChartData} isSelected={c.selected} />)}
          </Col>*/}
        </>}
        {coords.length > 0 && <Col>
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
          {areaMode && <ButtonGroup>
            <Button variant="outline-primary" onClick={handleShow}>Calculate</Button>
            <Button variant="outline-danger" onClick={removeArea}>Exit</Button>
          </ButtonGroup>}
          {!areaMode && <Button variant="outline-primary" onClick={addArea}>Add Area</Button>}
        </Col>}
        {coords.length === 0 && <Col>
          <h4>No turbines yet. Click on the map to place one!</h4>
          {areaMode && <ButtonGroup>
            <Button variant="outline-primary" onClick={handleShow}>Calculate</Button>
            <Button variant="outline-danger" onClick={removeArea}>Exit</Button>
          </ButtonGroup>}
          {!areaMode && <Button variant="outline-primary" onClick={addArea}>Add Area</Button>}
        </Col>}
      </Row>
    </Container>

    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>New Calculation</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group>
          <Form.Label><b>Step:</b></Form.Label>
          <Form.Control type="text" placeholder="" onChange={(e)=>{setStep(e.target.value)}} />
          <Form.Text className="text-muted">
            The step value decides how precise the calculation is. Smaller step values will give results which are more precise, but could be inaccurate if the area size is too big.
          </Form.Text>
        </Form.Group>
        <Form.Group>
          <Form.Label><b>Number of Cycles:</b></Form.Label>
          <Form.Control type="text" placeholder="" onChange={(e)=>{setCycles(e.target.value)}} />
          <Form.Text className="text-muted">
            The number of cycles decides how many times the calculation will be repeated. The more cycles, the more accurate the result will be, but the more time it will take to calculate.
          </Form.Text>
        </Form.Group>
        <Form.Group>
          <Form.Label><b>Label:</b></Form.Label>
          <Form.Control type="text" placeholder="" onChange={(e)=>{setName(e.target.value)}}/>
          <Form.Text className="text-muted">
            Pick a label so you can identify your calculation later.
          </Form.Text>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="outline-primary" onClick={
          () => {
            handleClose()
            calculate()
          }
        }>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  </>;
}

export default WindMap