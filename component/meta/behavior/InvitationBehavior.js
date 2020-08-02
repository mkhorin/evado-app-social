/**
 * @copyright Copyright (c) 2020 Maxim Khorin (maksimovichu@gmail.com)
 */
'use strict';

const Base = require('evado-meta-base/behavior/Behavior');

module.exports = class InvitationBehavior extends Base {

    async afterInsert () {
        const id = this.owner.getId();
        const name = (await this.getRelated('sender')).header.resolve();
        const recipient = (await this.getRelated('recipient')).get('user');
        await this.sendNotification('invited', {id, name, recipient});
        return super.afterInsert();
    }

    async afterTransit (transition) {
        switch (transition.name) {
            case 'accept':
                await this.createFriend();
                break;
            case 'decline':
                await this.notifySender('declined');
                break;
        }
        return super.afterTransit(transition);
    }

    async createFriend () {
        const friendClass = this.getMetaClass('friend');
        const friend = this.owner.createByView(friendClass);
        friend.assign({
            initiator: this.get('sender'),
            invitee: this.get('recipient')
        });
        if (await friend.save()) {
            await this.notifySender('friended');
        }
    }

    async notifySender (notice, data) {
        const name = (await this.getRelated('invitee')).header.resolve();
        const recipient = (await this.getRelated('sender')).get('user');
        await this.sendNotification(notice, {name, recipient, ...data});
    }

    sendNotification () {
        return this.module.getNotifier().createNotification(...arguments);
    }
};