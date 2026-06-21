import React from 'react'
import { Link } from 'react-router-dom'
import './index.css'

export default function NotFound() {
  return (
    <div className="notfound-page">
      <div className="notfound-page__content">
        <span className="notfound-page__code">404</span>
        <h1 className="notfound-page__heading">Page not found</h1>
        <p className="notfound-page__desc">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="notfound-page__back">← Back to dashboard</Link>
      </div>
    </div>
  )
}