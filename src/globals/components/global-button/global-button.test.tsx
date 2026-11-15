// src/globals/components/global-button/global-button.test.tsx
// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest'
import { expect, test, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { GlobalButton } from '#globals/components/global-button/global-button'
import styles from '#globals/components/global-button/global-button.module.css'

test('Button renders with correct text', async () => {
  render(<GlobalButton variant="primary">Test Button</GlobalButton>)

  expect(await screen.findByRole('button', { name: 'Test Button' })).toBeInTheDocument()
})

test.each(['primary', 'secondary', 'alert'] as const)('Button renders %s variant class', async variant => {
  render(<GlobalButton variant={variant}>Test Button</GlobalButton>)

  expect(await screen.findByRole('button', { name: 'Test Button' })).toHaveClass(styles[variant])
})

test('Button triggers onClick when clicked', async () => {
  const user = userEvent.setup()
  const onClick = vi.fn()

  render(
    <GlobalButton variant="primary" onClick={onClick}>
      Test Button
    </GlobalButton>
  )

  expect(onClick).not.toHaveBeenCalled()
  await user.click(screen.getByRole('button', { name: 'Test Button' }))
  expect(onClick).toHaveBeenCalledTimes(1)
})

test('Button is disabled, when disabled is true, and clicking does not invoke the callback', async () => {
  const user = userEvent.setup()
  const onClick = vi.fn()

  render(
    <GlobalButton variant="primary" disabled onClick={onClick}>
      Test Button
    </GlobalButton>
  )

  const button = screen.getByRole('button', { name: 'Test Button' })

  expect(button).toBeDisabled()
  await user.click(button)
  expect(onClick).not.toHaveBeenCalled()
})

test('Button defaults to type="button"', () => {
  render(<GlobalButton variant="primary">Test Button</GlobalButton>)

  const button = screen.getByRole('button', { name: 'Test Button' })

  expect(button).toHaveAttribute('type', 'button')
})

test('Button supports type="submit", and when placed in a form, clicking triggers that form’s submission without needing an onClick.', async () => {
  const user = userEvent.setup()
  const onSubmit = vi.fn()

  render(
    <form onSubmit={onSubmit}>
      <GlobalButton variant="primary" type="submit">
        Test Button
      </GlobalButton>
    </form>
  )

  const button = screen.getByRole('button', { name: 'Test Button' })

  await user.click(button)

  expect(onSubmit).toHaveBeenCalledTimes(1)
})
