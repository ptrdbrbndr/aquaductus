'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Nav() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: '/#diensten', label: 'Diensten' },
    { href: '/boeken', label: 'Boeken' },
    { href: '/blog', label: 'Blog' },
    { href: '/#contact', label: 'Contact' },
    { href: '/portal', label: 'Mijn portaal' },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
      }`}
      role="navigation"
      aria-label="Hoofdnavigatie"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className={`font-display text-2xl font-semibold transition-colors ${
              isScrolled ? 'text-water-deep' : 'text-white'
            }`}
            data-testid="nav-logo"
          >
            Aquaductus
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-body text-sm font-medium transition-colors hover:text-water ${
                  isScrolled ? 'text-text-primary' : 'text-white'
                }`}
                data-testid={`nav-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/boeken"
              className="bg-water text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-water-deep transition-colors"
              data-testid="nav-cta-boeken"
            >
              Plan een tocht
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className={`md:hidden p-2 rounded-md transition-colors ${
              isScrolled ? 'text-text-primary' : 'text-white'
            }`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Sluit menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
            data-testid="nav-hamburger"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div
            className="md:hidden bg-white border-t border-mist py-4"
            data-testid="nav-mobile-menu"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-4 py-2 text-text-primary hover:text-water font-body text-sm"
                onClick={() => setIsMenuOpen(false)}
                data-testid={`nav-mobile-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {link.label}
              </Link>
            ))}
            <div className="px-4 pt-2">
              <Link
                href="/boeken"
                className="block bg-water text-white px-4 py-2 rounded-lg text-sm font-medium text-center hover:bg-water-deep transition-colors"
                onClick={() => setIsMenuOpen(false)}
                data-testid="nav-mobile-cta"
              >
                Plan een tocht
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
