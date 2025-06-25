export const POST_LABELS = {
  LIKES: "likes",
  COMMENTS: "comments",
  VIEWS: "views",
  AUTHOR_PREFIX: "•",

  VISIBILITY: "Post visibility",
  VISIBILITY_PUBLIC: "Public",
  VISIBILITY_PRIVATE: "Private",
  VISIBILITY_COMMUNITY: "Community",

  TITLE: "Post title",
  CONTENT: "Content",

  SELECT_CATEGORY: "Select a category",
  CHOOSE_CATEGORY: "Choose a category",
  NO_CATEGORY_WARNING:
    "This community has no categories. You cannot create a post in this community.",

  CREATE_POST_HEADING: "Create a new post",
};

export const POST_ERRORS = {
  TITLE_REQUIRED: "Title is required.",
  TITLE_TOO_LONG: (max) => `Title must be ${max} characters or fewer.`,
  CONTENT_TOO_LONG: (max) => `Content must be ${max} characters or fewer.`,
  COMMUNITY_REQUIRED: "Please select a community.",
  POST_FAILED: "Post failed",
};
