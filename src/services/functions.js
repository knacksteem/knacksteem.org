export const getUniquePermalink = (title) => {
  const permlink = title.replace(/[^\w\s]/gi, '').replace(/\s\s+/g, '-').replace(/\s/g, '-').toLowerCase();
  return `${permlink}-id-${Math.random().toString(36).substr(2, 16)}`;
};
