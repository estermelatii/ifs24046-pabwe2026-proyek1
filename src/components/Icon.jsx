import PropTypes from "prop-types";

const ICON_PATHS = {
  search: <><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></>,
  bag: <><path d="M2.5 4h2.6l2.2 10.6a1.6 1.6 0 001.6 1.3h8.2a1.6 1.6 0 001.6-1.2L20.6 7.5H6" /><circle cx="9.5" cy="19.7" r="1.3" /><circle cx="16.5" cy="19.7" r="1.3" /></>,
  home: <path d="M4 11l8-7 8 7v9H4z" />,
  shop: <><rect x="4" y="4" width="7" height="7" /><rect x="13" y="4" width="7" height="7" /><rect x="4" y="13" width="7" height="7" /><rect x="13" y="13" width="7" height="7" /></>,
  heart: <path d="M12 20s-8-5-8-11a4.5 4.5 0 018-2 4.5 4.5 0 018 2c0 6-8 11-8 11z" />,
  trash: <path d="M5 7h14M10 7V4h4v3M7 7l1 13h8l1-13" />,
  truck: <><path d="M3 6h11v10H3zM14 10h4l3 3v3h-7" /><circle cx="7" cy="17" r="1.6" /><circle cx="17" cy="17" r="1.6" /></>,
  leaf: <path d="M5 19C5 9 11 5 20 4c0 9-4 15-12 15M5 19l8-8" />,
  gem: <path d="M6 4h12l3 5-9 11L3 9z" />,
};

export const Icon = ({ name }) => (
  <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    {ICON_PATHS[name]}
  </svg>
);

Icon.propTypes = {
  name: PropTypes.string.isRequired,
};
