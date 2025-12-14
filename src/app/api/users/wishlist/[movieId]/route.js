import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuthUser, verifyToken } from '@/lib/auth';

/**
 * DELETE /api/users/wishlist/[movieId]
 * Remove movie from wishlist
 */
export async function DELETE(request, { params }) {
  try {
    // const token = request.headers.get('authorization')?.split(' ')[1];
    // if (!token) {
    //   return NextResponse.json(
    //     { success: false, message: 'Unauthorized' },
    //     { status: 401 }
    //   );
    // }

    // const decoded = verifyToken(token);
    const decoded = await requireAuthUser(request);
    const { movieId } = await params;

    // Get current wishlist
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { wishList: true }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Remove from wishlist
    const newWishList = user.wishList.filter(id => id !== movieId);

    await prisma.user.update({
      where: { id: decoded.id },
      data: {
        wishList: newWishList
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Removed from wishlist'
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}