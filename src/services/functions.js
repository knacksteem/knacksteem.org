//generate unique permalink for articles
export const getUniquePermalink = (title) => {
  const permlink = title.replace(/[^\w\s]/gi, '').replace(/\s\s+/g, '-').replace(/\s/g, '-').toLowerCase();
  return `${permlink}-id-${Math.random().toString(36).substr(2, 16)}`;
};

//generate unique permalink for comments
export const getUniquePermalinkComment = (permlink) => {
  return `re-${permlink}-${Math.random().toString(36).substr(2, 16)}`;
};

//convert timestamp into pretty human readable date
export const prettyDate = (time) => {
  const date = new Date(time),
    diff = (((new Date()).getTime() - date.getTime()) / 1000) + date.getTimezoneOffset() * 60,
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

//return date string from timestamp (YYYY-MM-DD)
export const timestampToDate = (timestamp) => {
  if (!timestamp) {
    return '';
  }
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};

export const getUserCoverImage = (user) => {
  if (typeof user.userObjectSteemit.account === 'undefined') {
    return null;
  }
  const userMeta = JSON.parse(user.userObjectSteemit.account.json_metadata);
  let coverImg = userMeta.profile.cover_image;

  return coverImg;
};

// truncates long strings to shorter ones.
export const truncateString = (str, maxCharacters=90) => {
  return str.substring(0, maxCharacters).concat('...');
};

/**
    This is a rough approximation of log10 that works with huge digit-strings.
    Warning: Math.log10(0) === NaN
*/
function log10(str) {
  const leadingDigits = parseInt(str.substring(0, 4), 10);
  const log = Math.log(leadingDigits) / Math.log(10);
  const n = str.length - 1;
  return n + (log - parseInt(log, 10));
}

export const repLog10 = rep2 => {
  if(rep2 == null) return rep2;
  let rep = String(rep2);
  const neg = rep.charAt(0) === '-';
  rep = neg ? rep.substring(1) : rep;

  let out = log10(rep);
  if(isNaN(out)) out = 0;
  out = Math.max(out - 9, 0); // @ -9, $0.50 earned is approx magnitude 1
  out = (neg ? -1 : 1) * out;
  out = (out * 9) + 25; // 9 points per magnitude. center at 25
  // base-line 0 to darken and < 0 to auto hide (grep rephide)
  out = parseInt(out, 10);
  return out;
};

function vestToSteem (
  vestingShares,
  totalVestingShares,
  totalVestingFundSteem) {
  return (
    parseFloat(totalVestingFundSteem) *
    (parseFloat(vestingShares) / parseFloat(totalVestingShares))
  );
}

function calculateTotalVests (vestingShares, delegatedVestingShares, receivedVestingShares) {
  const vestingSharesParts = vestingShares.split(' ');

  const receivedSharesParts = receivedVestingShares.split(' ');

  const delegatedSharesParts = delegatedVestingShares.split(' ');

  let vests = (
    parseFloat(vestingSharesParts) + 
    parseFloat(receivedSharesParts)
  ) - (parseFloat(delegatedSharesParts));

  return vests;
}

export const calculateVotePower = (votingPower, lastVoteTime) => {
  let secondsAgo = (new Date() - new Date(lastVoteTime + 'Z')) / 1000;
  let vp = votingPower + (10000 * secondsAgo / 432000);
  let votePower = Math.min(vp / 100, 100).toFixed(2);

  return {
    votePower,
    vp
  };
};

export const calculateVoteValue = ({
  votingPower,
  lastVoteTime,
  rewardBalance,
  recentClaims,
  currentMedianHistoryPrice,
  vestingShares,
  delegatedVestingShares,
  receivedVestingShares,
  totalVestingFundSteem,
  totalVestingShares
}) => {
  let {vp} = calculateVotePower(votingPower, lastVoteTime);
  let vests = calculateTotalVests(vestingShares, delegatedVestingShares, receivedVestingShares);

  let sp = vestToSteem(vests, parseFloat(totalVestingShares), parseFloat(totalVestingFundSteem));

  let m = parseInt(100 * vp * (100 * 100) / 10000, 10);
  m = parseInt((m + 49) / 50, 10);

  let i = (parseFloat(rewardBalance.replace(' STEEM', '')) / parseFloat(recentClaims));

  let SBDBase = currentMedianHistoryPrice;

  let o = parseFloat(SBDBase.base.replace(' SBD', '')) /
    parseFloat(SBDBase.quote.replace(' STEEM', ''));

  let a = totalVestingFundSteem.replace(' STEEM', '') /
  totalVestingShares.replace(' VESTS', '');

  let vote = parseInt((sp / a) * m * 100, 10) * i * o;

  return (vote / 100).toFixed(2);
};

/**
 * Returns a string with first character in uppercase.
 * 
 * @param {String} str 
 */
export function uppercaseFirst(str) {
  return str
    .charAt(0)
    .toUpperCase()
    .concat(str.slice(1, str.length));
}
