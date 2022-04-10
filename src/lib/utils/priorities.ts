import { SubRole } from '../interfaces/types'

export const resolvePriorities = (roleA: SubRole, roleB: SubRole) => {
  switch (roleA.pos) {
    case 'mt':
      return -1
    case 'h2':
      return 1
    default:
      if (roleB.pos === 'mt') return 1
      if (roleB.pos === 'h2') return -1
      if (roleA.pos === 'h1') return 1
      if (roleB.pos === 'h1') return -1
      if (roleA.pos === 'st') return -1
      if (roleB.pos === 'st') return 1

      const positionA = parseInt(roleA.pos.slice(-1), 10)
      const positionB = parseInt(roleB.pos.slice(-1), 10)

      return positionA <= positionB ? -1 : 1
  }
}
