/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('areto/base/Base');

module.exports = class FriendStatusExpression extends Base {

    async resolve (member) {
        const userMemberId = await member.class.find().and({user: member.user.getId()}).id();
        if (!userMemberId || CommonHelper.isEqual(userMemberId, member.getId())) {
            return null;
        }
        const members = [member.getId(), userMemberId];
        const friendClass = member.class.meta.getClass('friend');
        const friend = await friendClass.find().and({
            initiator: members,
            invitee: members
        }).id();
        if (friend) {
            return 'friend';
        }
        const invitationClass = member.class.meta.getClass('invitation');
        const invitation = await invitationClass.find().and({
            _state: 'pending',
            sender: members,
            recipient: members
        }).id();
        if (invitation) {
            return 'pending';
        }
        return 'no';
    }
};

const CommonHelper = require('areto/helper/CommonHelper');