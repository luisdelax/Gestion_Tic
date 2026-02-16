import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

export function authMiddleware(request) {
  const token = request.cookies.get('token')?.value

  if (!token) {
    return NextResponse.json(
      { error: 'No autorizado' },
      { status: 401 }
    )
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    return { user: decoded }
  } catch (error) {
    return NextResponse.json(
      { error: 'Token inválido' },
      { status: 401 }
    )
  }
}

export function roleMiddleware(...allowedRoles) {
  return (request, response) => {
    const authResult = authMiddleware(request)
    
    if (authResult instanceof NextResponse) {
      return authResult
    }

    if (!allowedRoles.includes(authResult.user.rol)) {
      return NextResponse.json(
        { error: 'Acceso denegado' },
        { status: 403 }
      )
    }

    return null
  }
}
