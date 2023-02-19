/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('evado/component/meta/rbac/rule/BaseRule');

module.exports = class FriendDeletionRule extends Base {

    async execute () {
        if (this.isObjectTarget()) {
            const member = await this.getUserMemberId();
            const friend = this.getTarget();
            return CommonHelper.isEqual(friend.get('initiator'), member)
                || CommonHelper.isEqual(friend.get('invitee'), member);
        }
    }

    getUserMemberId () {
        const user = this.getUserId();
        return this.getBaseMeta().getClass('member').find({user}).id();
    }
};

const CommonHelper = require('areto/helper/CommonHelper');