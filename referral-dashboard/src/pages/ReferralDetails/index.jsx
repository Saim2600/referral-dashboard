import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Cookies from 'js-cookie'
import Navbar from '../../components/Navbar/index.jsx'
import { REFERRALS_URL, COOKIE_NAME } from '../../utils/constants.js'
import './index.css'

function formatDate(dateStr) {
  if (!dateStr) return ''
  return dateStr.replace(/-/g, '/')
}

function formatProfit(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount)
}

export default function ReferralDetails() {
  const { id } = useParams()
  const [referral, setReferral] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    async function fetchDetail() {
      try {
        const token = Cookies.get(COOKIE_NAME)
        const res = await fetch(`${REFERRALS_URL}?id=${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const json = await res.json()

        if (!res.ok) {
          setNotFound(true)
          return
        }

        const data = json.data ?? json

        // Shape 1: data is the row directly (id matches)
        if (data && data.id !== undefined && String(data.id) === String(id)) {
          setReferral(data)
        // Shape 2: data.referrals array
        } else if (data?.referrals) {
          const found = data.referrals.find((r) => String(r.id) === String(id))
          found ? setReferral(found) : setNotFound(true)
        } else {
          setNotFound(true)
        }
      } catch {
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }
    fetchDetail()
  }, [id])

  return (
    <div className="detail-page">
      <Navbar />
      <main className="detail-page__main">
        <div className="detail-page__container">

          {loading && <div className="detail-page__loading">Loading…</div>}

          {!loading && notFound && (
            <div className="detail-page__not-found">
              <h1 className="detail-page__not-found-heading">Referral not found</h1>
              <Link to="/" className="detail-page__back">← Back to dashboard</Link>
            </div>
          )}

          {!loading && referral && (
            <div className="detail-card">
              <Link to="/" className="detail-card__back">← Back to dashboard</Link>
              <h1 className="detail-card__heading">Referral Details</h1>
              <h2 className="detail-card__name">{referral.name}</h2>
              <dl className="detail-card__dl">
                <div className="detail-card__dl-row">
                  <dt className="detail-card__dt">Referral ID</dt>
                  <dd className="detail-card__dd">{referral.id}</dd>
                </div>
                <div className="detail-card__dl-row">
                  <dt className="detail-card__dt">Service Name</dt>
                  <dd className="detail-card__dd">{referral.serviceName}</dd>
                </div>
                <div className="detail-card__dl-row">
                  <dt className="detail-card__dt">Date</dt>
                  <dd className="detail-card__dd">{formatDate(referral.date)}</dd>
                </div>
                <div className="detail-card__dl-row">
                  <dt className="detail-card__dt">Profit</dt>
                  <dd className="detail-card__dd">{formatProfit(referral.profit)}</dd>
                </div>
              </dl>
            </div>
          )}

        </div>
      </main>

      <footer className="detail-footer">
        <div className="detail-footer__inner">
          <span className="detail-footer__brand">Go Business</span>
          <nav className="detail-footer__nav" aria-label="Footer">
            <a href="#">About</a>
            <a href="#">Privacy</a>
          </nav>
          <span className="detail-footer__copy">© 2024 Go Business</span>
        </div>
      </footer>
    </div>
  )
}