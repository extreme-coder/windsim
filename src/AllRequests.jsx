import { useReducer, useState } from "react";
import { Button } from "react-bootstrap";
import Request from "./Requests";

export default function AllRequests({ data, addTurbine }) {
  return (
    <>
      {data.map((request) => (
        <Request data={request.attributes} addTurbine={addTurbine} />
      ))}
      <p/>
      <Button size="lg" variant="outline-secondary" onClick={()=>(window.location.reload())}>
        Refresh
      </Button>
    </>
  )
}