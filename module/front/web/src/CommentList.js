/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
Front.CommentList = class CommentList extends Front.Loadable {

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
        let items = data?.items;
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
        this.pagination.setTotal(data?.totalSize);
        this.$content.append(this.pagination.render());
        Jam.t(this.$container);
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