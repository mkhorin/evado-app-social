'use strict';

module.exports = [{
    description: 'Create member on user sign up',
    events: ['auth.register'],
    handlers: ['memberInstantiation']
}];