import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
    return NextResponse.json({
        status: "ok",
        message: "Debug route is working",
        env: process.env.NODE_ENV
    })
}
