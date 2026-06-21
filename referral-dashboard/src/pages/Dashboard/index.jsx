import React, { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import Navbar from '../../components/Navbar/index.jsx'
import { REFERRALS_URL, COOKIE_NAME, PAGE_SIZE } from '../../utils/constants.js'
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

export default function Dashboard() {
  const navigate = useNavigate()

  // Dashboard static data (metrics, serviceSummary, referral link/code)
  const [dashData, setDashData] = useState(null)
  const [dashLoading, setDashLoading] = useState(true)
  const [dashError, setDashError] = useState(null)

  // Referrals table state
  const [referrals, setReferrals] = useState([])
  const [tableLoading, setTableLoading] = useState(false)
  const [tableError, setTableError] = useState(null)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('desc')
  const [page, setPage] = useState(1)

  // Copy state
  const [copiedLink, setCopiedLink] = useState(false)
  const [copiedCode, setCopiedCode] = useState(false)

  // Fetch dashboard overview on mount
  useEffect(() => {
    async function fetchDash() {
      try {
        const token = Cookies.get(COOKIE_NAME)
        const res = await fetch(REFERRALS_URL, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const json = await res.json()
        if (!res.ok) {
          setDashError(`${json.message || 'Failed to load'} (${res.status})`)
          return
        }
        setDashData(json.data ?? json)
      } catch (err) {
        setDashError(err.message)
      } finally {
        setDashLoading(false)
      }
    }
    fetchDash()
  }, [])

  // Fetch referrals (search + sort)
  const fetchReferrals = useCallback(async (searchVal, sortVal) => {
    setTableLoading(true)
    setTableError(null)
    try {
      const token = Cookies.get(COOKIE_NAME)
      const params = new URLSearchParams()
      if (searchVal) params.set('search', searchVal)
      if (sortVal) params.set('sort', sortVal)
      const url = params.toString() ? `${REFERRALS_URL}?${params}` : REFERRALS_URL
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const json = await res.json()
      if (!res.ok) {
        setTableError(`${json.message || 'Error'} (${res.status})`)
        setReferrals([])
        return
      }
      const data = json.data ?? json
      const rows = data.referrals ?? (Array.isArray(data) ? data : [])
      setReferrals(rows)
      setPage(1)
    } catch (err) {
      setTableError(err.message)
      setReferrals([])
    } finally {
      setTableLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchReferrals('', 'desc')
  }, [fetchReferrals])

  function handleSearch(e) {
    const val = e.target.value
    setSearch(val)
    fetchReferrals(val, sort)
  }

  function handleSort(e) {
    const val = e.target.value
    setSort(val)
    fetchReferrals(search, val)
  }

  function copyToClipboard(text, setCopied) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  // Pagination
  const totalPages = Math.max(1, Math.ceil(referrals.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const from = referrals.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1
  const to = Math.min(safePage * PAGE_SIZE, referrals.length)
  const pageRows = referrals.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  return (
    <div className="dashboard">
      <Navbar />

      <main className="dashboard__main">
        <div className="dashboard__container">

          {/* Page Header */}
          <div className="dashboard__header">
            <h1 className="dashboard__heading">Referral Dashboard</h1>
            <p className="dashboard__subtitle">
              Track your referrals, earnings, and partner activity in one place.
            </p>
          </div>

          {dashLoading && <div className="dashboard__loading">Loading dashboard…</div>}

          {dashError && (
            <div className="dashboard__error" role="alert">{dashError}</div>
          )}

          {!dashLoading && !dashError && dashData && (
            <>
              {/* Overview Section */}
              {dashData.metrics && (
                <section
                  className="dashboard__section"
                  role="region"
                  aria-label="Overview metrics"
                >
                  <h2 className="dashboard__section-title">Overview</h2>
                  <div className="overview-grid">
                    {dashData.metrics.map((m) => (
                      <div key={m.id} className="overview-card">
                        <span className="overview-card__label">{m.label}</span>
                        <span className="overview-card__value">{m.value}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Service Summary Section */}
              {dashData.serviceSummary && (
                <section
                  className="dashboard__section"
                  aria-label="Service summary"
                >
                  <h2 className="dashboard__section-title">Service summary</h2>
                  <div className="service-table-wrap">
                    <table className="service-table">
                      <thead>
                        <tr>
                          <th className="service-table__th">Service</th>
                          <th className="service-table__th">Your Referrals</th>
                          <th className="service-table__th">Active Referrals</th>
                          <th className="service-table__th">Total Ref. Earnings</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="service-table__td">{dashData.serviceSummary.service}</td>
                          <td className="service-table__td">{dashData.serviceSummary.yourReferrals}</td>
                          <td className="service-table__td">{dashData.serviceSummary.activeReferrals}</td>
                          <td className="service-table__td">{dashData.serviceSummary.totalRefEarnings}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </section>
              )}

              {/* Share Referral Section */}
              {dashData.referral && (
                <section
                  className="dashboard__section"
                  aria-label="Share referral"
                >
                  <h2 className="dashboard__section-title">Refer friends and earn more</h2>
                  <div className="share-card">
                    <div className="share-field">
                      <label className="share-field__label">Your Referral Link</label>
                      <div className="share-field__row">
                        <input
                          className="share-field__input"
                          type="text"
                          value={dashData.referral.link}
                          readOnly
                        />
                        <button
                          className="share-field__copy"
                          onClick={() => copyToClipboard(dashData.referral.link, setCopiedLink)}
                        >
                          {copiedLink ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                    </div>
                    <div className="share-field">
                      <label className="share-field__label">Your Referral Code</label>
                      <div className="share-field__row">
                        <input
                          className="share-field__input"
                          type="text"
                          value={dashData.referral.code}
                          readOnly
                        />
                        <button
                          className="share-field__copy"
                          onClick={() => copyToClipboard(dashData.referral.code, setCopiedCode)}
                        >
                          {copiedCode ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                    </div>
                  </div>
                </section>
              )}
            </>
          )}

          {/* All Referrals Table */}
          <section className="dashboard__section">
            <h2 className="dashboard__section-title">All referrals</h2>

            <div className="table-toolbar">
              <input
                className="table-toolbar__search"
                type="text"
                placeholder="Name or service…"
                value={search}
                onChange={handleSearch}
                aria-label="Search referrals"
              />
              <label className="table-toolbar__sort-label">
                Sort by date
                <select
                  className="table-toolbar__sort-select"
                  value={sort}
                  onChange={handleSort}
                >
                  <option value="desc">Newest first</option>
                  <option value="asc">Oldest first</option>
                </select>
              </label>
            </div>

            {tableError && (
              <div className="dashboard__error" role="alert">{tableError}</div>
            )}

            <div className="ref-table-wrap">
              <table className="ref-table">
                <thead>
                  <tr>
                    <th className="ref-table__th">Name</th>
                    <th className="ref-table__th">Service</th>
                    <th className="ref-table__th">Date</th>
                    <th className="ref-table__th">Profit</th>
                  </tr>
                </thead>
                <tbody>
                  {tableLoading ? (
                    <tr>
                      <td colSpan={4} className="ref-table__empty">Loading…</td>
                    </tr>
                  ) : pageRows.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="ref-table__empty">No matching entries</td>
                    </tr>
                  ) : (
                    pageRows.map((row) => (
                      <tr
                        key={row.id}
                        className="ref-table__row"
                        onClick={() => navigate(`/referral/${row.id}`)}
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && navigate(`/referral/${row.id}`)}
                        aria-label={`View referral details for ${row.name}`}
                      >
                        <td className="ref-table__td">{row.name}</td>
                        <td className="ref-table__td">{row.serviceName}</td>
                        <td className="ref-table__td">{formatDate(row.date)}</td>
                        <td className="ref-table__td">{formatProfit(row.profit)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {!tableLoading && referrals.length > 0 && (
              <div className="pagination">
  <span className="pagination__summary">
    Showing {from}-{to} of {referrals.length} entries
  </span>

  <div className="pagination__controls">
    <button
      className="pagination__btn"
      disabled={safePage === 1}
      onClick={() => setPage(p => p - 1)}
    >
      Previous
    </button>

    {Array.from({length: totalPages}, (_, i) => (
      <button
        key={i + 1}
        className={`pagination__btn ${
          safePage === i + 1 ? "pagination__btn--active" : ""
        }`}
        onClick={() => setPage(i + 1)}
      >
        {i + 1}
      </button>
    ))}

    <button
      className="pagination__btn"
      disabled={safePage === totalPages}
      onClick={() => setPage(p => p + 1)}
    >
      Next
    </button>
  </div>
</div>
            )}
          </section>

        </div>
      </main>

      {/* Footer */}
      <footer className="dashboard-footer">
        <div className="dashboard-footer__inner">
          <span className="dashboard-footer__brand">Go Business</span>
          <nav className="dashboard-footer__nav" aria-label="Footer">
            <a href="#">About</a>
            <a href="#">Privacy</a>
          </nav>
          <span className="dashboard-footer__copy">© 2024 Go Business</span>
        </div>
      </footer>
    </div>
  )
}