/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('areto/base/Base');

module.exports = class Friends extends Base {

    apply (query, model) {
        const member = model.getId();
        query.and(['or', {initiator: member}, {invitee: member}]);
    }
};