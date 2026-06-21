import React from 'react'
import {useNavigate} from 'react-router-dom'
import Cookies from 'js-cookie'
import {COOKIE_NAME} from '../../utils/constants'
import './index.css'

const Navbar = () => {
  const navigate = useNavigate()

  const handleLogout = () => {
    Cookies.remove(COOKIE_NAME)
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="navbar__inner">
        <h1 className="navbar__brand">
          Go Business
        </h1>

        <div className="navbar__actions">
          <button
            type="button"
            className="navbar__trial"
          >
            Try for free
          </button>

          <button
            type="button"
            className="navbar__logout"
            onClick={handleLogout}
          >
            Log out
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar