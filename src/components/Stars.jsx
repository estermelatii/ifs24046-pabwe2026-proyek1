const MAX_STARS = 5;

export const Stars = ({ rating }) => {
  const filled = Math.round(rating);
  return <span className="stars" aria-label={`Rating ${rating}`}>{'★'.repeat(filled)}{'☆'.repeat(MAX_STARS - filled)}</span>;
};
