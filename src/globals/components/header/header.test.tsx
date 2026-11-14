// src/header.test.tsx
// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest'
import { afterEach, expect, test, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { createMemoryRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import userEvent from '@testing-library/user-event'
import Header from './header'
import { routes } from '#routes'

afterEach(() => {
  cleanup()
})

test('Shows title, description and buttons', async () => {
  const screen = render(
    <Header
      title="Test Title"
      description="Test Description"
      buttons={[{ title: 'Login', variant: 'primary', onClick: () => {} }]}
    />
  )

  expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument()
  expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument()

  expect(screen.getByText('Test Title')).toBeInTheDocument()
  expect(screen.getByText('Test Description')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument()
})

test("Doesn't show buttons or description if not provided", async () => {
  const screen = render(<Header title="Test Title" />)

  expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument()
  expect(screen.getByText('Test Title')).toBeInTheDocument()

  expect(screen.queryByRole('button')).not.toBeInTheDocument()
  expect(screen.queryByRole('heading', { level: 3 })).not.toBeInTheDocument()
})

test('Calls onClick when button is clicked', async () => {
  const onClick = vi.fn()

  const newScreen = render(
    <Header title="Test Title" buttons={[{ title: 'Login', variant: 'primary', onClick: onClick }]} />
  )

  await userEvent.click(newScreen.getByRole('button', { name: 'Login' }))
  expect(onClick).toHaveBeenCalled()
})

test('Navigates from Library to Archive', async () => {
  const user = userEvent.setup()

  const router = createMemoryRouter(routes, {
    initialEntries: ['/']
  })

  render(<RouterProvider router={router} />)

  expect(await screen.findByRole('heading', { name: 'Song Library' })).toBeInTheDocument()

  await user.click(screen.getByRole('link', { name: 'Archive' }))

  expect(await screen.findByRole('heading', { name: 'Archive' })).toBeInTheDocument()

  expect(screen.queryByRole('heading', { name: 'Song Library' })).not.toBeInTheDocument()

  expect(screen.getByRole('link', { name: 'Archive' })).toHaveAttribute('aria-current', 'page')
})
