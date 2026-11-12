// src/header.test.tsx
// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest'
import { afterEach, expect, test, vi } from 'vitest'
import { cleanup, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Header from './header'

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

  const screen = render(
    <Header title="Test Title" buttons={[{ title: 'Login', variant: 'primary', onClick: onClick }]} />
  )

  await userEvent.click(screen.getByRole('button', { name: 'Login' }))
  expect(onClick).toHaveBeenCalled()
})
