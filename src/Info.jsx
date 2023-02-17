import { Col, Container, Form, Row } from "react-bootstrap"
import { Bar } from "react-chartjs-2"

const Info = ({turbine, handleChange, getChartData, s, handleHeightChange, height}) => {
  return (
    <>
      <Container>
        <Row>
          <Form.Group>
            <Form.Select value={turbine} onChange={handleChange}>
              <option>Bonus B82-2300</option>
              <option>Vestas V105-3450</option>
              <option>Vestas V110-2000</option>
              <option>Vestas V112-3450</option>
              <option>Vestas V117-3450</option>
              <option>Vestas V126-3450</option>
              <option>Vestas V80-2000</option>
              <option>Vestas V90-3000</option>
              <option>Siemens SWT-2.3-93</option>
              <option>Siemens SWT-3.0-101</option>
              <option>Siemens SWT-3.6-107</option>
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
        <Row>
          <Col>
            <h3>{Math.round(getChartData(s).map(a => a.power).reduce((a, b) => a + b, 0) / (12))} kWh of electricity per month</h3>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Range onChange={handleHeightChange} defaultValue={50} value={height-50} />
          </Col>
          <Col>
            <h3>{height}</h3>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default Info