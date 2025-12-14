import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getUserFromToken } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const movieId = searchParams.get("movie_id");

        if (!movieId) {
            return NextResponse.json(
                { message: "Movie ID is required" },
                { status: 400 }
            );
        }

        // Récupérer d'abord les commentaires avec leurs auteurs et réponses
        const comments = await prisma.comment.findMany({
            where: { movie_id: movieId },
            include: {
                user: { select: { id: true, username: true, image: true, role: true } },
                replies: {
                    include: { user: { select: { id: true, username: true, image: true, role: true } } },
                    orderBy: { created_at: 'asc' }
                }
            },
            orderBy: { created_at: 'desc' }
        });

        // Récupérer les ratings séparément (sans include pour éviter les erreurs de relation)
        const ratings = await prisma.rating.findMany({
            where: { movie_id: movieId },
            orderBy: { created_at: 'desc' }
        });

        // Récupérer les utilisateurs concernés par les ratings (batch)
        const ratingUserIds = Array.from(new Set(ratings.map(r => r.user_id))).filter(Boolean);
        let usersById = {};
        if (ratingUserIds.length > 0) {
            const users = await prisma.user.findMany({
                where: { id: { in: ratingUserIds } },
                select: { id: true, username: true, image: true, role: true }
            });
            usersById = users.reduce((acc, u) => { acc[u.id] = u; return acc; }, {});
        }

        // Attacher les ratings aux commentaires et aux replies
        const commentsWithRatings = comments.map(comment => {
            const commentRating = ratings.find(r => r.user_id === comment.user_id);
            const repliesWithRatings = (comment.replies || []).map(reply => {
                const replyRating = ratings.find(r => r.user_id === reply.user_id);
                return { ...reply, userRating: replyRating ? replyRating.rating : null };
            });
            return { ...comment, userRating: commentRating ? commentRating.rating : null, replies: repliesWithRatings };
        });

        // Construire les ratings standalone (utilisateurs qui ont noté sans commenter)
        const commentsUserIds = new Set(comments.map(c => c.user_id));
        const standAloneRatings = ratings
            .filter(r => !commentsUserIds.has(r.user_id))
            .map(r => ({
                id: `rating-${r.id}`,
                content: null,
                userRating: r.rating,
                user: usersById[r.user_id] || null,
                user_id: r.user_id,
                movie_id: movieId,
                created_at: r.created_at,
                updated_at: r.updated_at,
                parent_id: null,
                replies: [],
                isStandAloneRating: true
            }));

        // Fusionner et trier par date
        const allContent = [...commentsWithRatings, ...standAloneRatings].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        // Debug: log un aperçu du payload retourné (3 premiers éléments)
        try {
            console.log('GET /comments - returning items count:', allContent.length);
            console.log('GET /comments - sample items:', JSON.stringify(allContent.slice(0, 3), null, 2));
        } catch (e) {
            // ignore
        }

        return NextResponse.json(allContent, { status: 200 });

    } catch (error) {
        console.error(" GET /comments error:", error);
        return NextResponse.json({
            message: "Error fetching comments",
            error: error.message
        }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const body = await req.json();
        const { content, movie_id, user_id, parent_id, rating } = body;
        if (!content || !movie_id || !user_id) {
            return NextResponse.json(
                { message: "Missing required fields: content, movie_id, user_id" },
                { status: 400 }
            );
        }

        // Vérifier que l'utilisateur existe
        const user = await prisma.user.findUnique({
            where: { id: user_id }
        });

        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        const movie = await prisma.movie.findUnique({
            where: { id: movie_id }
        });

        if (!movie) {
            return NextResponse.json(
                { message: "Movie not found" },
                { status: 404 }
            );
        }

        // Vérifier le parent_id si fourni
        if (parent_id) {
            const parentComment = await prisma.comment.findUnique({
                where: { id: parent_id }
            });

            if (!parentComment) {
                return NextResponse.json(
                    { message: "Parent comment not found" },
                    { status: 404 }
                );
            }
        }

        // Créer le commentaire
        const newComment = await prisma.comment.create({
            data: {
                content: content.trim(),
                user_id: user_id,
                movie_id: movie_id,
                parent_id: parent_id || null,
                rating: rating || null,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        image: true,
                        role: true
                    },
                },
                movie: {
                    select: {
                        id: true,
                        title: true
                    }
                }
            },
        });
        return NextResponse.json(newComment, { status: 201 });

    } catch (error) {
        console.error("POST /comments error:", error);

        // Log plus détaillé pour les erreurs Prisma
        if (error.code) {
            console.error("Prisma error code:", error.code);
            console.error("Prisma error meta:", error.meta);
        }

        return NextResponse.json({
            message: "Error creating comment",
            error: error.message
        }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        const { searchParams } = new URL(req.url);
        const commentId = searchParams.get("id");

        if (!commentId) {
            return NextResponse.json(
                { message: "Missing comment ID" },
                { status: 400 }
            );
        }

        // Parse le body
        let body;
        try {
            body = await req.json();
        } catch (error) {
            console.error("Error parsing request body:", error);
            return NextResponse.json(
                { message: "Invalid JSON body" },
                { status: 400 }
            );
        }

        const { content, user_id } = body;

        // Validation des champs requis
        if (!content || content.trim() === "") {
            return NextResponse.json(
                { message: "Content is required" },
                { status: 400 }
            );
        }

        if (!user_id) {
            return NextResponse.json(
                { message: "User ID is required" },
                { status: 400 }
            );
        }

        // Récupérer le commentaire
        const comment = await prisma.comment.findUnique({
            where: { id: commentId }
        });

        if (!comment) {
            return NextResponse.json(
                { message: "Comment not found" },
                { status: 404 }
            );
        }

        // Récupérer l'utilisateur qui fait la requête
        const user = await prisma.user.findUnique({
            where: { id: user_id }
        });

        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        // Vérifier les permissions
        const isAuthor = comment.user_id === user_id;
        const isAdmin = user.role === "admin" || user.role === "ADMIN";

        // console.log("Permission check:", {
        //     commentUserId: comment.user_id,
        //     currentUserId: user_id,
        //     isAuthor,
        //     isAdmin,
        //     userRole: user.role
        // });

        if (!isAuthor && !isAdmin) {
            return NextResponse.json({
                message: "You can only modify your own comment"
            }, { status: 403 });
        }

        // Appliquer les modifications
        const updatedComment = await prisma.comment.update({
            where: { id: commentId },
            data: {
                content: content.trim(),
                updated_at: new Date()
            },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        image: true,
                        role: true
                    },
                },
            },
        });

        return NextResponse.json(updatedComment, { status: 200 });

    } catch (error) {
        console.error("PUT /comments error:", error);
        return NextResponse.json({
            message: "Error updating comment",
            error: error.message
        }, { status: 500 });
    }
}

export async function DELETE(req) {
    let commentId;

    try {
        const { searchParams } = new URL(req.url);
        commentId = searchParams.get("id");

        // Validation de l'ID
        if (!commentId || commentId === "undefined" || commentId === "null") {
            return NextResponse.json({ message: "Invalid comment ID" }, { status: 400 });
        }

        const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(commentId);
        if (!isValidObjectId) {
            return NextResponse.json({ message: "Invalid comment ID format" }, { status: 400 });
        }

        // Récupérer le body
        let body;
        try {
            body = await req.json();
        } catch (error) {
            return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
        }

        const { user_id } = body;

        if (!user_id || !/^[0-9a-fA-F]{24}$/.test(user_id)) {
            return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
        }

        const comment = await prisma.comment.findUnique({
            where: { id: commentId },
            include: {
                replies: {
                    select: { id: true }
                }
            }
        });

        if (!comment) {
            return NextResponse.json({ message: "Comment not found" }, { status: 404 });
        }

        const user = await prisma.user.findUnique({
            where: { id: user_id }
        });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // Vérifier les permissions
        const isAuthor = comment.user_id === user_id;
        const isAdmin = user.role === "admin" || user.role === "ADMIN";

        if (!isAuthor && !isAdmin) {
            return NextResponse.json({ message: "You can only delete your own comment" }, { status: 403 });
        }

        if (comment.replies && comment.replies.length > 0) {

            const deleteCommentAndReplies = async (commentId) => {
                const directReplies = await prisma.comment.findMany({
                    where: { parent_id: commentId },
                    select: { id: true }
                });

                for (const reply of directReplies) {
                    await deleteCommentAndReplies(reply.id);
                }
                await prisma.comment.delete({
                    where: { id: commentId }
                });

            };

            await deleteCommentAndReplies(commentId);

        } else {
            await prisma.comment.delete({
                where: { id: commentId }
            });
        }

        return NextResponse.json({
            success: true,
            message: "Comment and all replies deleted successfully"
        }, { status: 200 });

    } catch (error) {
        console.error("Error message:", error.message);
        console.error("Error code:", error.code);

        if (error.code === 'P2014') {
            return NextResponse.json({
                success: false,
                message: "Cannot delete comment because it has replies. Please try again.",
                error: "Foreign key constraint violation"
            }, { status: 500 });
        }

        if (error.code === 'P2025') {
            return NextResponse.json({
                success: false,
                message: "Comment not found or already deleted",
                error: "Record not found"
            }, { status: 404 });
        }

        return NextResponse.json({
            success: false,
            message: "Error deleting comment with replies",
            error: error.message,
            code: error.code
        }, { status: 500 });
    }
}