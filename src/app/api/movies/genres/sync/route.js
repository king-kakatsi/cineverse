import { NextResponse } from 'next/server';
import { syncGenres } from '@/lib/sync';
import { requireAdminUser } from '@/lib/auth';

export async function POST(request) {
  try {    
    const decoded = requireAdminUser(request); // will throw exception if user isn't admin
    if (decoded.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, message: 'Admin only' },
        { status: 403 }
      );
    }
    
    const synced = await syncGenres();
    
    return NextResponse.json({
      success: true,
      message: `Synced ${synced.length} genres`,
      data: synced
    });
    
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}