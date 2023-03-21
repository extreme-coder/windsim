import { Button, Card, Col, Container, Row } from "react-bootstrap"

const Blog = () => {
  return (
    <Container>
      <Row>
        <Col>
          <Card style={{ width: 'fluid' }}>
            <Card.Img variant="top" src="holder.js/100px180" />
            <Card.Body>
              <Card.Title>wind good</Card.Title>
              <Card.Text>
                did you know that wind power is good?
              </Card.Text>
              <Button variant="outline-primary">Read More</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card style={{ width: 'fluid' }}>
            <Card.Img variant="top" src="holder.js/100px180" />
            <Card.Body>
              <Card.Title>oil bad</Card.Title>
              <Card.Text>
                did you know that fossil fuels is bad?
              </Card.Text>
              <Button variant="outline-primary">Read More</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default Blog