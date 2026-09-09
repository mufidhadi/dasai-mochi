import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { OledDisplay } from '../components/OledDisplay'

describe('OledDisplay Component', () => {
  it('renders correctly with idle emotion', () => {
    render(<OledDisplay emotion="idle" speed={0} />)
    expect(screen.getByTestId('oled-display')).toBeInTheDocument()
    expect(screen.getByTestId('eyes-container')).toBeInTheDocument()
  })

  it('renders happy emotion with blush cheeks', () => {
    render(<OledDisplay emotion="happy" speed={0} />)
    expect(screen.getByTestId('blush-cheeks')).toBeInTheDocument()
  })

  it('renders cool sunglasses when emotion is cool', () => {
    render(<OledDisplay emotion="cool" speed={0} />)
    expect(screen.getByTestId('sunglasses')).toBeInTheDocument()
  })

  it('renders sleep zzz bubbles when sleeping', () => {
    render(<OledDisplay emotion="sleeping" speed={0} />)
    expect(screen.getByTestId('sleeping-bubbles')).toBeInTheDocument()
  })

  it('renders speed lines when speed > 50 or driving emotion', () => {
    render(<OledDisplay emotion="driving" speed={80} />)
    expect(screen.getByTestId('speed-lines')).toBeInTheDocument()
  })
})
