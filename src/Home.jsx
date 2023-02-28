import { Badge, Button, Carousel, Col, Container, Image, Row } from "react-bootstrap"
import turbineIcon from './unselected.png';
import simulateIcon from './unselected.png';
import learnIcon from './unselected.png';
import './Features.css';

const Home = (props) => {
  return (
    <div>
      <Container fluid style={{backgroundImage: 'wind-energy-banner-1920x560_m.png', height: window.innerWidth/2.5}}>
        <Row style={{margin: 'auto', height: '100%'}}>
          <Col>
            <div style={{ margin: 'auto', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
              <div>
                <h1 style={{textAlign: 'center', fontFamily: 'archivo-black', fontSize: window.innerWidth/24}}>BRINGING CLEAN ENERGY TO LIFE</h1>
                <p style={{ textAlign: 'center', fontFamily: 'archivo-black', fontSize: window.innerWidth/72, margin: '5%'}}>
                  WINDSIM is an easy to use application for simulating wind turbine performance in a variety of locations and configurations.
                </p>
                <Button style={{ textAlign: 'center', fontFamily: 'archivo-black', fontSize: window.innerWidth/72}} variant="outline-dark" size="lg" href="/app">TRY FOR FREE</Button>
              </div>
            </div>
          </Col>
          <Col style={{position: 'relative'}}>
            <Image style={{ margin: 0, height: window.innerWidth/2.6, position: 'absolute', bottom: 0, right: window.innerWidth/8 }} src="homepage.png" alt="Wind Energy Banner" />
          </Col>
        </Row>
      </Container>
      <Container fluid className="Features">
      <Row>
        <Col xs={12} md={4}>
          <Badge bg="secondary" className="Features-icon">
            <Image src={turbineIcon} alt="Turbine Icon" />
          </Badge>
          <h3 className="Features-title">Wind Turbine Simulation</h3>
          <p className="Features-description">
            Simulate the performance and output of wind turbines under different weather conditions and configurations.
          </p>
        </Col>
        <Col xs={12} md={4}>
          <Badge bg="secondary" className="Features-icon">
            <Image src={simulateIcon} alt="Simulate Icon" />
          </Badge>
          <h3 className="Features-title">Realistic Simulation</h3>
          <p className="Features-description">
            Experience realistic simulation based on actual wind turbine data and real-world scenarios.
          </p>
        </Col>
        <Col xs={12} md={4}>
          <Badge bg="secondary" className="Features-icon">
            <Image src={learnIcon} alt="Learn Icon" />
          </Badge>
          <h3 className="Features-title">Learn and Improve</h3>
          <p className="Features-description">
            Learn and improve your understanding of wind turbine performance, and apply what you've learned to real-world scenarios.
          </p>
        </Col>
      </Row>
    </Container>
    </div>
  )
}

export default Home