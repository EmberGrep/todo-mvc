import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return [
      {
        id: '1',
        title: 'Buy Milk'
      },
      {
        id: '2',
        title: 'Laundry'
      }
    ];
  }
});
