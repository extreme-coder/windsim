import { Carousel } from "react-bootstrap"

const Home = (props) => {
  return (
    <Carousel>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="/0621-CW-scaled.jpg"
          alt="First slide"
        />
        <Carousel.Caption>
          <h1 style={{fontSize: '72px', fontFamily: 'carouselCaption'}}>EMPOWERING A SUSTAINABLE TOMORROW</h1>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="/Wind homepage banner.jpg"
          alt="Second slide"
        />

        <Carousel.Caption>
          <h1 style={{fontSize: '72px'}}>REVOLUTIONIZING THE FUTURE OF RENEWABLE ENERGY</h1>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="/wind-energy-banner-1920x560_m.jpg"
          alt="Third slide"
        />

        <Carousel.Caption>
          <h1 style={{fontSize: '72px'}}>BRINGING CLEAN ENERGY TO LIFE</h1>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  )
}

export default Home