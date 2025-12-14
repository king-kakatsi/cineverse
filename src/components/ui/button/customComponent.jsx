import { CommentReply } from "@/components/reviews/commentReply";
import { RATING_EMOJIS } from "@/helpers/constants";
import { useState, useEffect } from "react";
import { getFullDate } from "@/helpers/dateHelper";
import { ModifyButton } from "./modifyButton";
import { Trash } from "./trashButton";
/* eslint-disable react-hooks/set-state-in-effect */

export const createPageUrl = (path) => `/mock-link/${path}`;
export const toast = { success: (msg) => console.log("TOAST:", msg) };
export const RatingEmoji = ({ rating, size = "md" }) => {
  const emoji = RATING_EMOJIS[Math.round(rating)]?.emoji || "N/A";
  const className =
    size === "sm" ? "text-sm" : size === "md" ? "text-lg" : "text-2xl";
  return <span className={className}>{emoji}</span>;
};

export const CustomCard = ({ title, children }) => (
  <div className="bg-gray-900/50 border border-gray-800 rounded-lg shadow-xl">
    <div className="p-4 border-b border-gray-800">
      <h3 className="text-xl font-semibold text-white">{title}</h3>
    </div>
    <div className="p-6">{children}</div>
  </div>
);
export const CustomButton = ({ onClick, children, className }) => (
  <button
    onClick={onClick}
    className={`flex items-center justify-center px-4 py-2 rounded-md transition-colors ${className}`}
  >
    {children}
  </button>
);

export const X = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" />
  </svg>
);
export const User = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
export const Mail = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);
export const Save = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v13a2 2 0 0 1-2 2z" />
    <path d="M17 21v-8H7v8" />
    <path d="M7 3v4h6" />
  </svg>
);
export const MessageSquare = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);
export const Film = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="20" x="2" y="2" rx="2.18" ry="2.18" />
    <line x1="7" x2="7" y1="2" y2="22" />
    <line x1="17" x2="17" y1="2" y2="22" />
    <line x1="2" x2="22" y1="12" y2="12" />
    <line x1="2" x2="22" y1="7" y2="7" />
    <line x1="2" x2="22" y1="17" y2="17" />
  </svg>
);
export const Calendar = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
  </svg>
);

export const DeleteModal = ({ isOpen, onClose, onConfirm, itemId, label }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full dark:bg-gray-800">
        <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">
          Confirm Deletion
        </h2>
        <p className="text-gray-700 mb-6 dark:text-gray-300">
          Are you sure you want to delete **{label}**? This action cannot be
          undone.
        </p>
        <div className="flex justify-end space-x-4">
          <CustomButton
            onClick={onClose}
            className="border border-gray-300 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700"
          >
            Cancel
          </CustomButton>
          <CustomButton
            onClick={onConfirm}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            Delete
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

export const UpdateModal = ({
  isOpen,
  onClose,
  onConfirm,
  input,
  label,
  action,
}) => {
  const [textValue, setTextValue] = useState(input);

  useEffect(() => {
    setTextValue(input);
  }, [input, isOpen]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(textValue);
    if (action === "reply") setTextValue("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="relative w-full max-w-md p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
        <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">
          {label}
        </h2>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X className="w-6 h-6" />
        </button>
        <textarea
          className="mt-3 mb-3 w-full border-gray-400 border rounded text-black overflow-auto p-3 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
          value={textValue}
          onChange={(e) => setTextValue(e.target.value)}
          rows={action === "update" ? 6 : 4}
        />
        <div className="flex justify-end space-x-4">
          <CustomButton
            onClick={onClose}
            className="border border-gray-300 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700"
          >
            Cancel
          </CustomButton>
          <CustomButton
            onClick={handleConfirm}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            Save
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

export const ReviewItemProfil = ({
  review,
  user,
  handleDeleteClick,
  handleOpenUpdateModal,
}) => {
  const film = review.movie;
  console.log(review);
  const canManageReview =
    user?.email === review.user_email || user?.role === "admin";
  return (
    <div className="bg-gray-900/50 border-gray-800 p-6 rounded-lg">
      <div className="flex items-start justify-between mb-3">
        <div className="flex flex-col gap-1">
          <a
            href={`movies/${film?.id}`}
            className="text-xl font-bold text-white hover:text-red-500 transition-colors"
          >
            {film?.title || "Unknown Film"}
          </a>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <RatingEmoji rating={review.rating} size="sm" />
              {/* <span className="text-sm font-medium text-white">
                {RATING_EMOJIS[review.rating]}
              </span> */}
            </div>
            <span className="text-xs text-gray-500">
              {getFullDate(new Date(review.created_at))}
            </span>
          </div>
        </div>

        <div className="flex flex-row gap-1">
          <span
            onClick={() =>
              handleOpenUpdateModal(review, "reply", "Write your comment...")
            }
          >
            <button className="justify-self-start mt-0 px-2 cursor-pointer hover:underline hover:text-red-500">
              reply
            </button>
          </span>

          {canManageReview && (
            <span onClick={() => handleDeleteClick(review.id, "your review")}>
              <Trash className="text-gray-400 hover:text-red-500 w-4 h-4 border" />
            </span>
          )}

          {user?.email === review.user_email && (
            <div>
              <span
                onClick={() =>
                  handleOpenUpdateModal(
                    review,
                    "update",
                    "Update your review..."
                  )
                }
              >
                <ModifyButton className="text-gray-400 hover:text-red-500 w-4 h-4 border" />
              </span>
            </div>
          )}
        </div>
      </div>
      {review.comment && <p className="text-gray-300 mb-4">{review.comment}</p>}

      {review.replies && review.replies.length > 0 && (
        <div className="mt-4">
          {review.replies.map((reply) => (
            <CommentReply
              key={reply.id}
              reply={reply}
              user={user}
              onModifyReply={handleOpenUpdateModal}
              onDeleteReply={handleDeleteClick}
              handleOpenUpdateModal={handleOpenUpdateModal}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const AllReviewsContainer = ({ user, userReviews }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState("");
  const [itemLabel, setItemLabel] = useState("your review");

  const handleDeleteClick = (itemId, itemLabel = "your review") => {
    setItemToDelete(itemId);
    setItemLabel(itemLabel);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    console.log(
      `ACTION: Confirmed deletion of ${itemLabel} ID: ${itemToDelete}`
    );
    setIsDeleteModalOpen(false);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const [isUpdateModalOpen, setisUpdateModalOpen] = useState(false);
  const [modalProps, setModalProps] = useState({
    item: null,
    label: "",
    action: "",
  });

  const handleOpenUpdateModal = (item, actionType, labelText) => {
    setModalProps({ item: item, action: actionType, label: labelText });
    setisUpdateModalOpen(true);
  };

  const handleCloseUpdateModal = () => {
    setisUpdateModalOpen(false);
    setModalProps({ item: null, label: "", action: "" });
  };

  const handleConfirmUpdateOrReply = (updatedText) => {
    const type = modalProps.item.film_id ? "Review" : "Reply";
    console.log(
      `ACTION: Confirmed ${modalProps.action} on ${type} ID ${modalProps.item.id} with text: "${updatedText}"`
    );
    handleCloseUpdateModal();
  };

  const inputProp =
    modalProps.action === "update" ? modalProps.item?.comment : "";

  return (
    <CustomCard title={`My Reviews (${userReviews.length})`}>
      {userReviews.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare className="w-16 h-16 text-gray-700 mx-auto mb-4" />
          <p className="text-gray-500">
            You haven&apos;t written any reviews yet
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {userReviews.map((review) => (
            <ReviewItemProfil
              key={review.id}
              review={review}
              user={user}
              handleDeleteClick={handleDeleteClick}
              handleOpenUpdateModal={handleOpenUpdateModal}
            />
          ))}
        </div>
      )}

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        itemId={itemToDelete}
        label={itemLabel}
      />

      <UpdateModal
        isOpen={isUpdateModalOpen}
        onClose={handleCloseUpdateModal}
        onConfirm={handleConfirmUpdateOrReply}
        input={inputProp}
        label={modalProps.label}
        action={modalProps.action}
      />
    </CustomCard>
  );
};
