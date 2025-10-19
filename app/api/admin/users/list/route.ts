import { NextRequest, NextResponse } from 'next/server'
import { extractBearer, verifyToken } from '@/lib/jwt'
import { getSql } from '@/lib/db'

const ALLOWED_ORDER_BY = new Set(['created_at', 'updated_at', 'email', 'display_name', 'role'])

export async function GET(req: NextRequest) {
  try {
    const auth = extractBearer(req.headers)
    if (!auth) {
      return NextResponse.json({ ok: false, error: 'missing_bearer' }, { status: 401 })
    }
    const payload = await verifyToken(auth)
    const email = (payload?.email as string) || (payload?.sub as string) || ''
    const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    const isAdmin = (payload?.role === 'admin') || ADMIN_EMAILS.includes(email)
    if (!isAdmin) {
      return NextResponse.json({ ok: false, error: 'forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get('pageSize') || '10', 10)))
    const search = (searchParams.get('search') || '').trim()
    const role = (searchParams.get('role') || '').trim()
    const disabledParam = searchParams.get('disabled') || 'any'
    const orderBy = (searchParams.get('orderBy') || 'created_at').trim()
    const order = (searchParams.get('order') || 'desc').trim().toLowerCase()

    const orderBySafe = ALLOWED_ORDER_BY.has(orderBy) ? orderBy : 'created_at'
    const orderDirSafe = order === 'asc' ? 'asc' : 'desc'

    const offset = (page - 1) * pageSize

    const sql = await getSql()
    await sql`CREATE TABLE IF NOT EXISTS users (
      uid TEXT PRIMARY KEY,
      email TEXT,
      display_name TEXT,
      role TEXT,
      phone_number TEXT,
      disabled BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )`

    const whereClauses: string[] = []
    const params: any[] = []
    if (search) {
      whereClauses.push(`(email ILIKE $${params.length + 1} OR display_name ILIKE $${params.length + 2})`)
      params.push(`%${search}%`, `%${search}%`)
    }
    if (role) {
      whereClauses.push(`role = $${params.length + 1}`)
      params.push(role)
    }
    if (disabledParam !== 'any') {
      whereClauses.push(`disabled = $${params.length + 1}`)
      params.push(disabledParam === 'true')
    }

    const whereSql = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : ''

    const countQuery = `SELECT COUNT(*)::int AS total FROM users ${whereSql}`
    const countRows = await sql(countQuery, params)
    const total = (countRows?.[0]?.total as number) || 0

    const listQuery = `
      SELECT uid, email, display_name, role, phone_number, disabled, created_at, updated_at
      FROM users
      ${whereSql}
      ORDER BY ${orderBySafe} ${orderDirSafe}
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `
    const listRows = await sql(listQuery, [...params, pageSize, offset])

    return NextResponse.json({ ok: true, users: listRows, total })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || String(e) }, { status: 500 })
  }
}