/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

Jam.Utility.InviteFriend = class InviteFriendUtility extends Jam.Utility {

    onItem (event) {
        const content = $('[data-id="inviteFriendForm"]').html();
        Jam.dialog.show(content, {
            title: 'Invite to friends',
            cssClass: 'success',
            beforeSubmit: this.onBeforeSubmit.bind(this)
        });
        this.$form = Jam.dialog.$container.find('.form');
        this.$alert = this.$form.find('.alert');
        this.$text = this.$form.find('[name="text"]').focus();
        Jam.i18n.translateContainer(this.$form);
    }

    onBeforeSubmit () {
        if (!this.validate()) {
            return false;
        }
        Jam.toggleGlobalLoader(true);
        const data = this.getRequestData({
            model: this.getModel().id,
            text: this.$text.val()
        });
        Jam.Helper.post(this.getUrl(), data)
            .done(this.onDone.bind(this))
            .fail(this.onFail.bind(this));
    }

    onDone (data) {
        Jam.dialog.close();
        Jam.toggleGlobalLoader(false);
        this.modal.reload({saved: true}).done(() => this.getModel().notice.success(data));
    }

    onFail (data) {
        Jam.toggleGlobalLoader(false);
        this.$alert.removeClass('hidden').html(data.responseJSON || data.responseText);
    }

    validate () {
        this.clearErrors();
        return !this.hasError()
    }

    hasError () {
        return !this.$alert.hasClass('hidden') || this.$form.find('.has-error').length > 0;
    }

    clearErrors () {
        this.$alert.addClass('hidden');
        this.$form.find('.has-error').removeClass('has-error');
    }
};