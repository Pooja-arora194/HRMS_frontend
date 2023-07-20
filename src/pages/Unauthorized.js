import React from 'react'
import { Link } from 'react-router-dom'
export default function Unauthorized() {
  return (
    <div>
        <h2>401 Unauthorized Access</h2>
        <button className='Unauthorized-btn'><Link to='/dashboardpage'>Home</Link></button>
        </div>
  )
}
