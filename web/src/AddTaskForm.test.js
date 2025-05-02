import { render, screen } from '@testing-library/react'
import AddTaskForm from './components/A_TaskMan/AddTaskForm'

describe('Test the AddTask component ', () => {
  test('render the AddTaskForm', () => {
    render(<AddTaskForm />)
  })
})
