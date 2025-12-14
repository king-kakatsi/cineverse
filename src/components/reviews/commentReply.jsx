// src/components/reviews/commentReply.jsx
"use client";
import React, { useState } from "react";
import { MessageSquare, Reply, Edit, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import UpdateModal from "../ui/modals/updateModal";
import DeleteModal from "../ui/modals/deleteModal";
import { RatingEmoji } from "../ui/button/ratingEmoji";
import { RATING_EMOJIS } from "@/helpers/constants";

export const CommentReply = ({ comment, user, onReply, onEdit, onDelete, depth = 0 }) => {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [replyContent, setReplyContent] = useState("");
    const [isSubmittingReply, setIsSubmittingReply] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [showReplies, setShowReplies] = useState(false); 
    console.log('DEBUG - user rating', comment);
    const canModify = user && (user.id === comment.user_id || user.role === "ADMIN");

    const hasReplies = comment.replies && comment.replies.length > 0;

    const handleSubmitReply = async () => {
        if (!replyContent.trim()) {
            alert("Please write a reply");
            return;
        }

        setIsSubmittingReply(true);
        try {
            await onReply(comment.id, replyContent);
            setReplyContent("");
            setShowReplyForm(false);
            if (!showReplies) {
                setShowReplies(true);
            }
        } catch (error) {
            console.error("Error submitting reply:", error);
        } finally {
            setIsSubmittingReply(false);
        }
    };

    const handleEditConfirm = (newContent) => {
        if (newContent && newContent.trim() && newContent !== comment.content) {
            onEdit({ ...comment, content: newContent });
        }
        setIsUpdateModalOpen(false);
    };

    const handleDeleteConfirm = () => {
        onDelete(comment.id);
        setIsDeleteModalOpen(false);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const toggleReplies = () => {
        setShowReplies(!showReplies);
    };

    return (
        <>
            {/* Commentaire principal */}
            <div className={`bg-gray-900/30 rounded-lg p-4 ${depth > 0 ? 'ml-8 mt-3' : ''}`}>
                {/* En-tête du commentaire */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-white">
                                {comment.user?.username || "Anonymous"}
                            </span>
                            {comment.user?.role === "ADMIN" && (
                                <span className="bg-[#e50914] text-xs text-white px-2 py-1 rounded">
                                    ADMIN
                                </span>
                            )}
                        </div>
                        {/* Afficher le rating emoji si présent */}
                        {comment.rating && (
                            <div className="flex items-center gap-1 bg-gray-800/50 px-2 py-1 rounded">
                                <span className="text-lg">{RATING_EMOJIS[comment.rating].emoji}</span>
                                <span className="text-xs text-gray-300">{RATING_EMOJIS[comment.rating].label}</span>
                            </div>
                        )}
                        <span className="text-gray-400 text-sm">
                            {formatDate(comment.created_at || comment.createdAt)}
                        </span>
                    </div>

                    {/* Actions */}
                    {canModify && (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setIsUpdateModalOpen(true)}
                                className="text-gray-400 hover:text-blue-400 transition-colors"
                                title="Edit comment"
                            >
                                <Edit size={16} />
                            </button>
                            <button
                                onClick={() => {
                                    if (!comment || !comment.id) {
                                        console.error("Cannot delete - invalid comment:", comment);
                                        return;
                                    }
                                    onDelete(comment);
                                }}
                                className="text-gray-400 hover:text-red-500 transition-colors"
                                title="Delete comment"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    )}
                </div>

                {/* Contenu du commentaire */}
                {comment.content ? (
                    <div className="text-white mb-3 whitespace-pre-wrap">
                        {comment.content}
                    </div>
                ) : comment.isStandAloneRating ? (
                    <div className="text-gray-400 italic mb-3 text-center py-2">
                        <p>Rated without a comment</p>
                    </div>
                ) : null}

                <div className="flex items-center gap-4 mt-3">
                    {/* Bouton Reply - seulement pour les vrais commentaires */}
                    {depth < 3 && user && comment.content && (
                        <button
                            onClick={() => setShowReplyForm(!showReplyForm)}
                            className="flex cursor-pointer items-center gap-2 text-gray-400 hover:text-[#e50914] transition-colors"
                        >
                            <Reply size={16} />
                            <span>Reply</span>
                        </button>
                    )}

                    {/* Bouton View Replies  */}
                    {hasReplies && (
                        <button
                            onClick={toggleReplies}
                            className="flex cursor-pointer items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors"
                        >
                            {showReplies ? (
                                <>
                                    <ChevronUp size={16} />
                                    <span>Hide {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}</span>
                                </>
                            ) : (
                                <>
                                    <ChevronDown size={16} />
                                    <span>View {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}</span>
                                </>
                            )}
                        </button>
                    )}
                </div>

                {/* Formulaire de réponse */}
                {showReplyForm && user && (
                    <div className="mt-4 ml-4 p-4 bg-gray-800/50 rounded-lg">
                        <textarea
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            placeholder="Write your reply..."
                            className="w-full bg-black/50 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:border-[#e50914] resize-none"
                            rows={3}
                        />
                        <div className="flex justify-end gap-2 mt-2">
                            <button
                                onClick={() => setShowReplyForm(false)}
                                className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmitReply}
                                disabled={isSubmittingReply || !replyContent.trim()}
                                className="px-4 py-2 bg-[#e50914] hover:bg-[#b20710] text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmittingReply ? "Posting..." : "Post Reply"}
                            </button>
                        </div>
                    </div>
                )}

                {/* Réponses imbriquées  */}
                {hasReplies && showReplies && (
                    <div className="mt-4 space-y-3">
                        {comment.replies.map((reply) => (
                            <CommentReply
                                key={reply.id}
                                comment={reply}
                                user={user}
                                onReply={onReply}
                                onEdit={onEdit}
                                onDelete={onDelete}
                                depth={depth + 1}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Modals */}
            <UpdateModal
                isOpen={isUpdateModalOpen}
                onClose={() => setIsUpdateModalOpen(false)}
                onConfirm={handleEditConfirm}
                input={comment.content}
                label="Edit Comment"
                action="update"
            />

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                itemId={`comment by ${comment.user?.username}`}
                label=""
            />
        </>
    );
};