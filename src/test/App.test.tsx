import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from '../App'

describe('App Main Component', () => {
  it('renders header, mochi chassis, and control panels', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /DASAI MOCHI/i })).toBeInTheDocument()
    expect(screen.getByTestId('mochi-chassis')).toBeInTheDocument()
    expect(screen.getByText(/Driving Companion & G-Force HUD/i)).toBeInTheDocument()
    expect(screen.getByText(/Facial Expressions & Mood Matrix/i)).toBeInTheDocument()
    expect(screen.getByText(/Interchangeable Helmets & Gear/i)).toBeInTheDocument()
  })
})
