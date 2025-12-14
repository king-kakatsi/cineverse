import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    
    const where = {};
    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }
    
    const persons = await prisma.person.findMany({
      where,
      orderBy: { name: 'asc' },
      take: 50
    });

    return NextResponse.json({
      success: true,
      data: persons
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}