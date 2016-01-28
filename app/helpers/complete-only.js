import Ember from 'ember';
import arrFilter from '../utils/arr-filter';

export let filter = (todo) => todo.isComplete;

export let completeOnly = arrFilter(filter);

export default Ember.Helper.helper(completeOnly);
