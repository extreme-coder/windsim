import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import WindMap from './WindMap';
import React, { ReactElement } from "react";

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
      <Wrapper apiKey="AIzaSyBUskhPL5cY5JADoaPrmaqA5IgdTlg7KVY" render={render}>
        {<WindMap center={center} zoom={zoom} />}
      </Wrapper>
    </div>
  );
};

export default App;
