import { Button, ButtonGroup, Card } from "react-bootstrap"

export default function Request ({ data, addTurbine }) {
  return (
    <>
      <p/>
      <Card style={{ width: 'flex' }} bg={'light'} border={'danger'} >
        <Card.Header>{data.name}</Card.Header>
          <Card.Body>
          <Card.Title>
            {data.status === 'WAITING' && <p>Calculation in Progress...</p>}
            {data.status === 'COMPLETED' && <p>Optimal location at {Math.round(data.highestX*100)/100},{Math.round(data.highestY*100)/100}</p>}
          </Card.Title>
          
          <p>
          {data.cycles_completed} of {data.cycles} cycles completed 
            </p>
            <p>
              Locations evaluated: {data.points_processed}               
            </p>
            <p>
              Highest Wind Speed: {Math.round(data.highestSpeed*100)/100} m/s
            </p>
          {data.status === 'COMPLETED' && <ButtonGroup>
            <Button variant="outline-primary" onClick={() => { addTurbine(data.highestX, data.highestY) }}>Add Turbine</Button>
          </ButtonGroup>}
        </Card.Body>
      </Card>
    </>
  )
}