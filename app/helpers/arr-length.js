import Ember from 'ember';

export function arrLength([arr]/*, hash*/) {
  return arr.length;
}

export default Ember.Helper.helper(arrLength);
