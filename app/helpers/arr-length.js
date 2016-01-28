import Ember from 'ember';

export function arrLength([arr]/*, hash*/) {
  if (!Array.isArray(arr)) {
    return 0;
  }

  return arr.length;
}

export default Ember.Helper.helper(arrLength);
