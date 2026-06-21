import React from 'react'
import Cookies from 'js-cookie'
import { Navigate } from 'react-router-dom'
import { COOKIE_NAME } from '../../utils/constants.js'

export default function ProtectedRoute({ children }) {
  const token = Cookies.get(COOKIE_NAME)
  if (!token) return <Navigate to="/login" replace />
  return children
}