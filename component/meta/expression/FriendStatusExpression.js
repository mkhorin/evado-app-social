/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('areto/base/Base');

module.exports = class FriendStatusExpression extends Base {

    async resolve (member) {
        const user = member.user.getId();
        const memberQuery = member.class.find({user});
        const userMemberId = await memberQuery.id();
        if (!userMemberId || CommonHelper.isEqual(userMemberId, member.getId())) {
            return null;
        }
        const members = [member.getId(), userMemberId];
        const friendClass = member.class.meta.getClass('friend');
        const friendQuery = friendClass.find({
            initiator: members,
            invitee: members
        });
        const friend = await friendQuery.id();
        if (friend) {
            return 'friend';
        }
        const invitationClass = member.class.meta.getClass('invitation');
        const invitationQuery = invitationClass.findByState('pending').and({
            sender: members,
            recipient: members
        });
        const invitation = await invitationQuery.id();
        if (invitation) {
            return 'pending';
        }
        return 'no';
    }
};

const CommonHelper = require('areto/helper/CommonHelper');