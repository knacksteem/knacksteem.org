//generate unique permalink for blockchain
export const getUniquePermalink = (title) => {
  const permlink = title.replace(/[^\w\s]/gi, '').replace(/\s\s+/g, '-').replace(/\s/g, '-').toLowerCase();
  return `${permlink}-id-${Math.random().toString(36).substr(2, 16)}`;
};

//convert timestamp into pretty human readable date
export const prettyDate = (time) => {
  const date = new Date(time),
    diff = (((new Date()).getTime() - date.getTime()) / 1000),
    day_diff = Math.floor(diff / 86400);

  if (day_diff === 0) {
    //posted just today
    if (diff < 60) {
      return 'just now';
    } else if (diff < 120) {
      return '1 minute ago';
    } else if (diff < 3600) {
      return Math.floor(diff / 60) + ' minutes ago';
    } else if (diff < 7200) {
      return '1 hour ago';
    } else {
      return Math.floor(diff / 3600) + ' hours ago';
    }
  } else if (day_diff === 1) {
    return 'yesterday';
  } else if (day_diff < 7) {
    return day_diff + ' days ago';
  } else {
    return Math.ceil(day_diff / 7) + ' weeks ago';
  }
};
