const transformListToOption = (list) => {
  return { value: list.id, label: list.name};
};

const transformBoardToOptionGroup = (board, defaultLabel) => {
  const {organization: org} = board;
  
  const label = org.id ? org.displayName ? org.displayName  : org.name : defaultLabel;
  return { label, options: [] };
};

const transformBoardToOption = (board, defaultGroup) => {
  const {organization: org} = board;
  
  const group = org.id ? org.displayName ? org.displayName  : org.name : defaultGroup;
  return {
    value: board.id,
    label: board.name,
    group
  };
};

/**
 * @param {Array<TrelloBoard>} boards
 * @returns {*}
 */
const sortBoardGroups = (boards) => {
  const sort = (a, b) => a < b ? -1 : a > b ? 1 : 0;
  const unique = (item, pos, prevItem) => !pos || item != prevItem;
  const defaultLabel = 'Personal Boards';
  
  const groups = boards.map((board) => transformBoardToOptionGroup(board, defaultLabel))
    .sort((a,b) => sort(a.label, b.label))
    .filter((item, pos, ary) => unique(item.label, pos, pos ? ary[pos - 1].label : null));
  
  // put the default groups on top
  const groupsWithoutDefault = groups.filter((group) => group.label !== defaultLabel);
  if (groupsWithoutDefault.length === groups.length) {
    return groups;
  }
  
  const defaultGroups = groups.filter((group) => group.label === defaultLabel);
  return defaultGroups.concat(groupsWithoutDefault);
};

/**
 * @param {Array<TrelloBoard>} boards
 * @returns {*}
 */
export const boardsToOptions = (boards) => {
  const defaultGroup = 'Personal Boards';
  return boards.map((board) => transformBoardToOption(board, defaultGroup));
};

/**
 * @param {Array<TrelloList>} lists
 * @returns {*}
 */
export const listsToOptions = (lists) => {
  return lists.map(transformListToOption);
};