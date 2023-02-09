import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import WindMap from './WindMap';
import React, { ReactElement } from "react";
import { Container, Nav, Navbar } from 'react-bootstrap';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Home';

const render = (status: Status): ReactElement => {
  if (status === Status.LOADING) return <h3>{status} ..</h3>;
  if (status === Status.FAILURE) return <h3>{status} ...</h3>;
  return null;
};

const App = () => {
  const center = { lat: 49, lng: -123 };
  const zoom = 7

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <Navbar bg="dark" variant="dark" sticky="top">
        <Container>
          <Navbar.Brand href="">WINDSIM</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="">Home</Nav.Link>
            <Nav.Link href="app">App</Nav.Link>
            <Nav.Link href="about">About Us</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <BrowserRouter>
        <Routes>
          <Route path='' element={
            <Home/>
          } />
          <Route path='app' element={
            <Wrapper apiKey="AIzaSyBUskhPL5cY5JADoaPrmaqA5IgdTlg7KVY" render={render}>
              {<WindMap center={center} zoom={zoom} />}
            </Wrapper>
          } />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
