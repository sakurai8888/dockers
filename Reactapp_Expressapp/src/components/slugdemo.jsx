import { useParams } from "react-router-dom";

export function Subfunctiontest() {
  return (
    <div>Testing an inside function</div>
  )
}



export default function Slugdemo() {
  let params = useParams();
  return (
    <div style={{ textAlign: "center" }}>
      <h1>This is a new Parameter</h1>
      <p>It's id is {params.id}</p>
      <p>It's hash is {params.hash}</p>
      <Subfunctiontest />
    </div>
  );
}


