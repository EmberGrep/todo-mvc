import Ember from 'ember';
import arrFilter from '../utils/arr-filter';

export let filter = (todo) => !todo.isComplete;

export let activeOnly = arrFilter(filter);

export default Ember.Helper.helper(activeOnly);
