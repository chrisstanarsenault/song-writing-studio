// src/App.test.tsx
// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest'
import { expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { routes } from './routes'

test('navigates from Library to Archive', async () => {
  const user = userEvent.setup()

  const router = createMemoryRouter(routes, {
    initialEntries: ['/']
  })

  render(<RouterProvider router={router} />)

  expect(await screen.findByRole('link', { name: 'Library' })).toBeInTheDocument()

  await user.click(screen.getByRole('link', { name: 'Archive' }))

  expect(await screen.findByRole('link', { name: 'Archive' })).toBeInTheDocument()

  expect(screen.getByRole('link', { name: 'Archive' })).toHaveAttribute('aria-current', 'page')
})
