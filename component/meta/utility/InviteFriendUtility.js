/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('evado/component/utility/MetaUtility');

module.exports = class InviteFriendUtility extends Base {

    async isActive () {
        if (!await super.isActive()) {
            return false;
        }
        const {model} = await this.resolveMetaParams();
        if (this.isUserId(model.get('user'))) {
            return false; // user member
        }
        const userMember = await model.class.find().and({user: this.getUserId()}).id();
        if (await this.isFriends(model, userMember)) {
            return false; // already friends
        }
        return !await this.hasInvitation(model, userMember);
    }

    isFriends (member, userMember) {
        const friendClass = member.class.meta.getClass('friend');
        if (!friendClass) {
            this.log('error', 'Class not found: friend');
            return true; // skip utility
        }
        const members = [member.getId(), userMember];
        return friendClass.find().and({
            initiator: members,
            invitee: members
        }).id();
    }

    hasInvitation (member, userMember) {
        const invitationClass = member.class.meta.getClass('invitation');
        if (!invitationClass) {
            this.log('error', 'Class not found: invitation');
            return true; // skip utility
        }
        const members = [member.getId(), userMember];
        return invitationClass.find().and({
            _state: 'pending',
            sender: members,
            recipient: members
        }).id();
    }

    async execute () {
        const data = await this.resolveMetaParams();
        const senderId = await data.model.class.find().and({user: this.getUserId()}).id();
        const invitation = await this.createModel(data.class.meta.getClass('invitation'));
        invitation.set('sender', senderId);
        invitation.set('recipient', data.model.getId());
        invitation.set('text', this.postParams.text);
        if (!await invitation.save()) {
            throw new BadRequest(invitation.getFirstError());
        }
        this.controller.sendText('Invitation sent');
    }
};

const BadRequest = require('areto/error/http/BadRequest');