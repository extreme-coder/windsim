import { Button, ButtonGroup, Card } from "react-bootstrap"

export default function Request ({ data, addTurbine }) {
  return (
    <>
      <p/>
      <Card style={{ width: 'flex' }} bg={'light'} border={'danger'} >
        <Card.Header>{data.name}</Card.Header>
          <Card.Body>
          <Card.Title>
            {data.status === 'WAITING' && <p>Waiting...</p>}
            {data.status === 'COMPLETED' && <p>Optimal point at {Math.round(data.highestX*100)/100},{Math.round(data.highestY*100)/100}</p>}
          </Card.Title>
          <p/>
          {data.status === 'COMPLETED' && <ButtonGroup>
            <Button variant="outline-primary" onClick={() => { addTurbine(data.highestX, data.highestY) }}>Add Turbine</Button>
          </ButtonGroup>}
        </Card.Body>
      </Card>
    </>
  )
}