import { render } from '@redwoodjs/testing/web'

import SUserSignup from './SCompanySignup'

describe('SUserSignup', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<SUserSignup />)
    }).not.toThrow()
  })
})
