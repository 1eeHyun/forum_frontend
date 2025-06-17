export default function PostContent({ content }) {
    return (
      <div className="px-4 py-3">
        <p className="text-muted text-sm line-clamp-5 break-words">
          {content}
        </p>
      </div>
    );
  }
  