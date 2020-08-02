'use strict';

Front.NewComment = class NewComment extends Front.LoadableContent {

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
        this.$modal.modal();
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
        this.$modal.modal('hide');
        this.front.trigger('comment:created');
    }

    onCreateFail (data) {
        this.$modalError.removeClass('hidden').html(data.responseText || data.statusText);
    }
};

Front.CommentList = class CommentList extends Front.LoadableContent {

    init () {
        super.init();
        this.pagination = new Front.Pagination(this);
        this.pagination.pageSize = 10;
        this.on('change:pagination', this.onChangePagination.bind(this));
        this.front.on('comment:created', this.onCommentCreated.bind(this));
    }

    getUrl (action = 'list') {
        return super.getUrl(action);
    }

    getPostData () {
        return {
            class: 'comment',
            view: 'list',
            start: this.pagination.getOffset(),
            length: this.pagination.getPageSize()
        };
    }

    onChangePagination () {
        this.load();
    }

    resolveTemplate (name, data) {
        return super.resolveTemplate(name, data, '##', '##');
    }

    render (data) {
        let items = data && data.items;
        items = Array.isArray(items) ? items : [];
        items = items.map(this.renderItem, this).join('') || this.resolveTemplate('empty');
        return this.resolveTemplate('list', {items});
    }

    renderItem (data) {
        data.authorId = data.author._id;
        data.authorTitle = data.author._title;
        data.date = Jam.FormatHelper.asDatetime(data._createdAt);
        data.text = Front.escapeHtml(data.text);
        return this.resolveTemplate('item', data);
    }

    renderError () {
        const text = super.renderError(...arguments);
        return this.resolveTemplate('error', {text});
    }

    onDone (data) {
        super.onDone(data);
        this.pagination.setTotal(data && data.totalSize);
        this.$content.append(this.pagination.render());
        this.translateContainer();
    }

    onCommentCreated () {
        this.load();
    }
};

Front.AlbumCommentList = class AlbumCommentList extends Front.CommentList {

    init () {
        super.init();
        this.album = this.getData('album');
        this.on('click', '[data-command="create"]', this.onCreate.bind(this));
        this.load();
    }

    getUrl (action = 'list-related') {
        return super.getUrl(action);
    }

    getPostData () {
        return Object.assign(super.getPostData(), {
            view: 'relatedComment',
            master: {
                id: this.album,
                class: 'album',
                attr: 'comments'
            }
        });
    }

    onCreate () {
        this.front.trigger('action:newComment', {album: this.album});
    }
};

Front.PhotoCommentList = class PhotoCommentList extends Front.CommentList {

    init () {
        super.init();
        this.photo = this.getData('photo');
        this.on('click', '[data-command="create"]', this.onCreate.bind(this));
        this.load();
    }

    getUrl (action = 'list-related') {
        return super.getUrl(action);
    }

    getPostData () {
        return Object.assign(super.getPostData(), {
            view: 'relatedComment',
            master: {
                id: this.photo,
                class: 'photo',
                attr: 'comments'
            }
        });
    }

    onCreate () {
        this.front.trigger('action:newComment', {photo: this.photo});
    }
};