import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  
  try {
    const genreDistribution = await prisma.genre.findMany({
        select: {
            name: true,
            _count: {
                select: {
                    movies: true 
                }
            }
        },
        orderBy: {
            movies: {
                _count: 'desc'
            }
        }
    });

    const formattedData = genreDistribution.map(g => ({
            name: g.name,
            count: g._count.movies,
        }))
        .filter(g => g.count > 0);  

    return NextResponse.json(formattedData, { status: 200 });
  } catch (error) {
    console.error('Error fetching genre distribution:', error);
    return NextResponse.json(
      { error: 'Failed to fetch genre distribution' },
      { status: 500 }
    );
  }
}