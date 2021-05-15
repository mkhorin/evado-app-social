/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
Front.NewComment = class NewComment extends Front.Loadable {

    init () {
        super.init();
        this.$modal = this.$container.closest('.new-comment-modal');
        this.$modalError = this.$modal.find('.modal-error');
        this.$modal.on('click', '[data-command="create"]', this.onCreate.bind(this));
        this.front.on('action:newComment', this.onNewComment.bind(this));
    }

    getCommand (name) {
        return this.$modal.find(`[data-command="${name}"]`);
    }

    getUrl (action = 'defaults') {
        return super.getUrl(action);
    }

    getForm () {
        return this.getHandler('Form');
    }

    getPostData () {
        return {
            class: 'comment'
        };
    }

    render (data) {
        this.data = data;
        return this.resolveTemplate('comment', data);
    }

    renderError () {
        const text = super.renderError(...arguments);
        return this.resolveTemplate('error', {text});
    }

    onAfterDone () {
        super.onAfterDone();
        this.getForm().focus('text');
    }

    onNewComment (event, data) {
        this.initData = data;
        this.$content.html('');
        this.$modalError.addClass('hidden');
        this.modal = Jam.showModal(this.$modal);
        this.load();
    }

    onCreate () {
        const form = this.getForm();
        if (!form.validate()) {
            return false;
        }
        const data = {
            class: 'comment',
            data: form.serialize()
        };
        this.assignInitData(data.data);
        this.front.ajaxQueue.post(this.getUrl('create'), data)
            .done(this.onCreateDone.bind(this))
            .fail(this.onCreateFail.bind(this));
    }

    assignInitData (data) {
        for (const key of Object.keys(this.initData)) {
            data[key] = {links: [this.initData[key]]};
        }
    }

    onCreateDone (data) {
        this.modal.hide();
        this.front.trigger('comment:created');
    }

    onCreateFail (data) {
        this.$modalError.removeClass('hidden').html(data.responseText || data.statusText);
    }
};