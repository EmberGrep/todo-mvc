import Ember from 'ember';
import arrFilter from '../utils/arr-filter';

export let activeOnly = arrFilter();

export default Ember.Helper.helper(activeOnly);
