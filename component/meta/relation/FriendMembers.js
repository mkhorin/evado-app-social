/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('areto/base/Base');

module.exports = class FriendMembers extends Base {

    async apply (query, model) {
        const friendClass = model.class.meta.getClass('friend');
        const member = model.getId();
        const items = await friendClass.find(['OR', {initiator: member}, {invitee: member}]).raw().all();
        const members = [];
        for (const item of items) {
            members.push(item.initiator, item.invitee);
        }
        const key = model.class.getKey();
        query.and({[key]: members}).and(['!=', key, member]);
    }
};