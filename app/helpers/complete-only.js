import Ember from 'ember';
import arrFilter from '../utils/arr-filter';

export let completeOnly = arrFilter((todo) => todo.isComplete);

export default Ember.Helper.helper(completeOnly);
