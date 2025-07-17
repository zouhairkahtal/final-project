
import {  useNavigate } from "react-router-dom";

import { useEffect } from "react";

export function Dashboard() {
const navigate = useNavigate();
  useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/login"); 
  }
}, []);
    return (
        <>
      <div>
    vrfvre
      </div>
        </>
        )
}