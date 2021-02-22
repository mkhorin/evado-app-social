/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
Front.Invite = class Invite extends Front.Element {

    init () {
        this.$modal = this.$container;
        this.$modalError = this.$modal.find('.modal-error');
        this.$modal.on('click', '[data-command="send"]', this.onSend.bind(this));
        this.front.on('action:invite', this.onInvite.bind(this));
    }

    onInvite (event, data) {
        this.member = data.member;
        this.$modalError.addClass('hidden');
        this.$modal.modal();
    }

    onSend () {
        const form = this.getHandler('Form');
        if (!form.validate()) {
            return false;
        }
        const data = {
            id: 'inviteFriend',
            meta: 'member',
            model: this.member,
            text: form.getValue('text')
        };
        this.front.ajaxQueue.post(this.getDataUrl('utility'), data)
            .done(this.onDone.bind(this))
            .fail(this.onFail.bind(this));
    }

    onDone (data) {
        this.$modal.modal('hide');
        this.front.getHandler('Member').load();
    }

    onFail (data) {
        this.$modalError.removeClass('hidden').html(data.responseText || data.statusText);
    }
};