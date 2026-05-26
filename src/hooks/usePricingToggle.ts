'use client'

import { useState } from 'react'

type Billing = 'monthly' | 'annual'

const ANNUAL_DISCOUNT = 0.3

export function usePricingToggle() {
  const [billing, setBilling] = useState<Billing>('monthly')

  function getPrice(monthlyPrice: number): number {
    if (billing === 'annual') {
      return Math.round(monthlyPrice * (1 - ANNUAL_DISCOUNT))
    }
    return monthlyPrice
  }

  return { billing, setBilling, getPrice, discount: ANNUAL_DISCOUNT }
}
