import { POST_LABELS } from "./postLabels";

export const TITLE_MAX = 150;
export const CONTENT_MAX = 5000;

export const POST_VISIBILITY_OPTIONS = [
  { value: "PUBLIC", label: POST_LABELS.VISIBILITY_PUBLIC },
  { value: "PRIVATE", label: POST_LABELS.VISIBILITY_PRIVATE },
  { value: "COMMUNITY", label: POST_LABELS.VISIBILITY_COMMUNITY },
];

export const DEFAULT_FORM = {
  title: "",
  content: "",
  visibility: "PUBLIC",
  communityId: null,
};