/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('areto/base/Base');

module.exports = class FriendMembers extends Base {

    async apply (query, model) {
        const friendClass = model.class.meta.getClass('friend');
        const member = model.getId();
        const friendQuery = friendClass.find(['or', {initiator: member}, {invitee: member}]).raw();
        const friends = await friendQuery.all();
        const members = [];
        for (const {initiator, invitee} of friends) {
            members.push(initiator, invitee);
        }
        const key = model.class.getKey();
        query.and({[key]: members}).and(['!=', key, member]);
    }
};