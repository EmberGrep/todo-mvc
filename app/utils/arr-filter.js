export default function arrFilter(filter) {
  return function([todos]/*, hash*/) {
    if (typeof todos !== 'object' || typeof todos.filter !== 'function') {
      return [];
    }

    return todos.filter(filter);
  };
}
