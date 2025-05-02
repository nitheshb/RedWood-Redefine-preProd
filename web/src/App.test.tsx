import { render, screen } from '@testing-library/react'
import App from './App'

describe('Test the AddTask component ', () => {
  test('render the AddTaskForm', () => {
    render(<App />)
    const linkElement = screen.getByText(/hello/i)
    expect(linkElement).toBeInTheDocument()
  })
})
