import { useEffect, useState } from "react";
import { useGetSpeedQuery } from "./services/windsim";
import Chart from 'chart.js/auto'
import { Bar } from 'react-chartjs-2';
import { Alert, Button, ButtonGroup, Card, Col, Container, Form, Modal, Row, Spinner } from "react-bootstrap";

const TurbineData = (props) => {


  const getChartData = (s) => {
    return s.slice(0, 12).map(a => ({
      month: monthMap[a.datetime],
      speed: parseFloat(a.wind_speed),
      power: Math.round(a.capacity_factor*3450*100)/100
    }))
  }

  const speedDesc = (s) => {
    let avg = getChartData(s).map(a => a.speed).reduce((a, b) => a + b, 0) / 12.00
    if(avg > 9.25){return "Very High Wind"}
    else if (avg > 8) { return "High Wind" }
    else if(avg > 7){return "Medium Wind"}
    else {return "Low Wind"}
  }

  const [turbine, setTurbine] = useState('Vestas V126-3450')
  const [height, setHeight] = useState(100)
  const { data: s, error } = useGetSpeedQuery({ ...props.coords, turbine: turbine, height: height })
 
  const monthMap = {
    "2019-01-31": "January",
    "2019-02-28": "February",
    "2019-03-31": "March",
    "2019-04-30": "April",
    "2019-05-31": "May",
    "2019-06-30": "June",
    "2019-07-31": "July",
    "2019-08-31": "August",
    "2019-09-30": "September",
    "2019-10-31": "October",
    "2019-11-30": "November",
    "2019-12-31": "December"
  }

  const [showAlert, setShowAlert] = useState(true)
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [showCard, setShowCard] = useState(true)
  const handleCloseAlert = () => {
    props.removeMarker(props.id)
  }
  const [color, setColor] = useState('')
  const [counted, setCounted] = useState(false)

  useEffect(() => {
    if (error) {
      props.noData(props.id)
    }
    if (s && !counted) {
      setCounted(true)
      props.updateData(getChartData(s), props.id)
    }
  }, [error, s]);

  const handleChange = (event) => {
    console.log(event.target.value)
    setTurbine(event.target.value)
    props.updateData(getChartData(s), props.id)
  }

  const handleHeightChange = (event) => {
    setHeight(event.target.value*2)
  }
  
  return (
    <div>
      {s && showCard && <Card style={{ width: '18rem' }} bg={color} onMouseEnter={() => { props.select(props.id, true); setColor('info') }} onMouseLeave={() => { props.select(props.id, false); setColor('') }}>
        <Card.Body>
          <Card.Title>{`(${Math.round(props.coords.lat*100)/100}, ${Math.round(props.coords.lng*100)/100})`}</Card.Title>
          <Card.Text>{Math.round(100 * getChartData(s).map(a => a.speed).reduce((a, b) => a + b, 0) / 12) / 100.00} m/s - {speedDesc(s)}</Card.Text>
          {/*<Form.Select value={turbine} onChange={handleChange}>
            <option>Vestas V126-3450</option>
            <option>Vestas V105-3450</option>
            <option>Vestas V110-2000</option>
          </Form.Select>*/}
          <p/>
          <ButtonGroup>
            <Button variant="outline-primary" onClick={handleShow}>View Data</Button>
            <Button variant="outline-danger" onClick={() => {
              props.updateData(getChartData(s))
              props.removeMarker(props.id)
            }}>Delete</Button>
          </ButtonGroup>
        </Card.Body>
      </Card>}
      {error && showAlert && <Alert variant="danger" onClose={handleCloseAlert} dismissible>
        <Alert.Heading>No data available for this location</Alert.Heading>
      </Alert>}
      {s && <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{Math.round(100 * getChartData(s).map(a => a.speed).reduce((a, b) => a + b, 0) / 12) / 100.00} m/s - {speedDesc(s)}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row>
              <Form.Group>
                <Form.Select value={turbine} onChange={handleChange}>
                  <option>Vestas V126-3450</option>
                  <option>Vestas V105-3450</option>
                  <option>Vestas V110-2000</option>
                </Form.Select>
              </Form.Group>
            </Row>
            <Row>
              {s && <Bar
                options={{
                  scales: {
                    y: {
                      beginAtZero: true
                    }
                  }
                }}
                data={{
                  labels: getChartData(s).map(a => a.month),
                  datasets: [{
                    label: "Average Wind Speed (m/s)",
                    data: getChartData(s).map(a => a.speed)
                  }]
                }}
              />}
              {s && <Bar
                options={{
                  scales: {
                    y: {
                      beginAtZero: true
                    }
                  }
                }}
                data={{
                  labels: getChartData(s).map(a => a.month),
                  datasets: [{
                    label: "Average Power Output (kWh)",
                    data: getChartData(s).map(a => a.power)
                  }]
                }}
              />}
            </Row>
          </Container>
          <Form.Range onChange={handleHeightChange} defaultValue={50} /> 
        </Modal.Body>
      </Modal>}
      {!s && !error && <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>}
    </div>
  )
}

export default TurbineData