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
        const user = this.getUserId();
        const query = model.class.find({user});
        const userMember = await query.id();
        if (await this.isFriends(model, userMember)) {
            return false; // already friends
        }
        const hasInvitation = await this.hasInvitation(model, userMember);
        return !hasInvitation;
    }

    async isFriends (member, userMember) {
        const friendClass = member.class.meta.getClass('friend');
        if (!friendClass) {
            this.log('error', 'Class not found: friend');
            return true; // skip utility
        }
        const members = [member.getId(), userMember];
        const query = friendClass.find({
            initiator: members,
            invitee: members
        });
        const id = await query.id();
        return !!id;
    }

    async hasInvitation (member, userMember) {
        const invitationClass = member.class.meta.getClass('invitation');
        if (!invitationClass) {
            this.log('error', 'Class not found: invitation');
            return true; // skip utility
        }
        const members = [member.getId(), userMember];
        const query = invitationClass.findByState('pending').and({
            sender: members,
            recipient: members
        });
        const id = await query.id();
        return !!id;
    }

    async execute () {
        const data = await this.resolveMetaParams();
        const user = this.getUserId();
        const senderId = await data.model.class.find({user}).id();
        const invitationClass = data.class.meta.getClass('invitation');
        const invitation = await this.createModel(invitationClass);
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