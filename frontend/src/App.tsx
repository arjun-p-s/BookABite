import { useEffect, useState } from "react";
    import axios from 'axios';
    
function App() {
  const [message, setMessage] = useState("");
  useEffect(() => {
    axios.get("http://localhost:3000/").then(res => setMessage(res.data));
  }, []);
  return <div><h1>Frontend Running ✅</h1><p>{message}</p></div>;
}
export default App;
