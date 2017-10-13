$().ready(function () {
	var $container = $('#container');
	var $title, $containerTitle, $articles;
	var _set = {
		limitNum: 20,
		startNum: 0,
		isUser: false,
		boardId: undefined,
		boardPage: 1,
		searchType: 0,
		keyword: '',
		moiminfo: true,
		type: 1,
		layout: 11,
		privAnonym: 0,
		privCommentAnonym: 0,
		isSearchable: 0,
		isWritable: 0,
		isCommentable: 0,
		isManageable: 0,
		isSecret: 0,
		authToWrite: 0,
		authToComment: 0,
		placeholder: '글 내용을 입력하세요.',
		isNotSelectedHotArticle: -1,
		hashtags: [],
		attaches: [],
		removeAttachIds: [],
		attachDragHoverCount: 0,
		attachUploadingStatus: []
	};
	var _fn = {
		initiate: function () {
			if (!$container.is(':has(#boardId)')) {
				location.href = '/';
				return false;
			}
			$containerTitle = $container.find('div.wrap.title');
			$articles = $container.find('div.articles');
			_set.isUser = ($container.find('#isUser').val() === '1') ? true : false;
			_set.boardId = $container.find('#boardId').val();

			_fn.initiateContent();
			$(window).on('load', function () { // Fix popstate issue in Safari
				setTimeout(function () {
					$(window).on('popstate', function () {
						_fn.initiateContent();
					});
				}, 0);
			});
			//$containerTitle.on('click', '#manageMoim', function () {
			//	_fn.manageMoim();
			//});
			$container.on('click', '#writeArticleButton', function () {
				_fn.showWriteArticleForm();
			});
			$container.on('change', '#searchArticleForm > select[name="search_type"]', function () {
				var $form = $container.find('#searchArticleForm');
				var $keyword = $form.find('input[name="keyword"]');
				if ($(this).val() === '3') {
					$keyword.attr('placeholder', '#K-NET');
				} else {
					$keyword.attr('placeholder', '검색어를 입력하세요.');
				}
				$keyword.val('');
			});
			$container.on('submit', '#searchArticleForm', function () {
				_fn.searchArticle();
				return false;
			});
			$container.on('click', '#goListButton', function () {
				if (_set.boardPage > 1) {
					history.go(-1);
				} else {
					var url = _fn.encodeUrl({ page: 1 });
					_fn.goRedirectContent(url);
				}
			});
			$articles.on('click', 'a[href]', function (event) {
				_fn.goLinkContent(this, event);
			});
			$articles.on('click', '> article > a.article > ul.status > li.update', function () {
				var $article = $(this).parents('article');
				_fn.showWriteArticleForm($article);
				return false;
			});
			$articles.on('click', '> article > a.article > ul.status > li.del', function () {
				var $article = $(this).parents('article');
				if (confirm('이 글을 삭제하시겠습니까?')) {
					_fn.removeArticle($article);
				}
				return false;
			});
			$articles.on('click', '> article > a.article > ul.status > li.abuse', function () {
				var $article = $(this).parents('article');
				_fn.showAbuseForm($article, 'article');
			});
			$articles.on('click', '> article > a.article > ul.status > li.vote', function () {
				var $article = $(this).parents('article');
				_fn.voteArticle($article);
				return false;
			});
			$articles.on('click', '> article > a.article > ul.status > li.scrap', function () {
				var $article = $(this).parents('article');
				_fn.scrapArticle($article);
				return false;
			});
			$articles.on('click', '> article > a.article > ul.status > li.removescrap', function () {
				var $article = $(this).parents('article');
				_fn.removeScrap($article);
				return false;
			});
			$articles.on('click', '> article > a.article > ul.status > li.setnotice', function () {
				var $article = $(this).parents('article');
				_fn.setNoticeArticle($article);
				return false;
			});
			$articles.on('click', '> article > a.article > ul.status > li.managedel', function () {
				var $article = $(this).parents('article');
				if (confirm('[삭제]는 관리하시는 게시판의 주제 및 규칙에 맞지 않는 게시물을 삭제하기 위한 기능입니다.\n\n확인을 누를 경우 자동신고처리시스템에 의해 게시물이 즉시 삭제됩니다\n\n욕설, 음란물 등 에브리타임 커뮤니티 이용규칙에 어긋나는 게시물은 [삭제 및 경고]를 해주시기 바랍니다.')) {
					_fn.removeArticle($article);
				}
				return false;
			});
			$articles.on('click', '> article > a.article > ul.status > li.manageabuse', function () {
				var $article = $(this).parents('article');
				if (confirm('[삭제 및 경고]는 욕설, 음란물 등 에브리타임 커뮤니티 이용규칙에 어긋나는 게시물을 삭제하고 작성자에게 경고를 하기 위한 기능입니다.\n\n확인을 누를 경우 자동신고처리시스템에 의해 게시물이 즉시 삭제되며, 작성자에게 경고가 가해집니다. 경고가 다수 누적된 이용자는 시스템에 의해 게시판 혹은 에브리타임에서 접근 제한됩니다.\n\n단순히 관리하시는 게시판의 주제 및 규칙에 맞지 않는 게시물일 경우 [삭제]를 해주시기 바랍니다.')) {
					_fn.abuseArticle($article, 0);
				}
				return false;
			});
			$articles.on('submit', '> form.write', function () {
				_fn.writeArticle();
				return false;
			});
			$articles.on('drag dragstart dragend dragover dragenter dragleave drop', '> form.write', function (event) {
				event.preventDefault();
				event.stopPropagation();
			}).on('dragenter', '> form.write', function (event) {
				_fn.dragstartOnWriteArticleForm(event);
			}).on('dragleave drop', '> form.write', function (event) {
				_fn.dragendOnWriteArticleForm(event);
			}).on('drop', '> form.write', function (event) {
				_fn.dropOnWriteArticleForm(event);
			});
			$articles.on('click', '> form.write > ul.hashtags > li', function () {
				_fn.addHashtagOnWriteArticleForm($(this).text());
			});
			$articles.on('change', '> form.write > input[name="file"]', function () {
				_fn.changeAttachOnWriteArticleForm(this.files);
			});
			$articles.on('click', '> form.write > ol.thumbnails > li.new', function () {
				_fn.addAttachOnWriteArticleForm();
			});
			$articles.on('click', '> form.write > ol.thumbnails > li.thumbnail.attached', function () {
				_fn.showAttachThumbnailForm($(this));
			});
			$articles.on('click', '> form.write > ul.option > li.anonym', function () {
				if ($(this).hasClass('active')) {
					$(this).removeClass('active');
				} else {
					$(this).addClass('active');
				}
			});
			$articles.on('click', '> form.write > ul.option > li.hashtag', function () {
				_fn.addHashtagOnWriteArticleForm();
			});
			$articles.on('click', '> form.write > ul.option > li.attach', function () {
				_fn.addAttachOnWriteArticleForm();
			});
			$articles.on('click', '> form.write > ul.option > li.submit', function () {
				$articles.find('form.write').submit();
			});
			$articles.on('submit', '> article > div.comments > form.writecomment', function () {
				_fn.writeComment($(this));
				return false;
			});
			$articles.on('focus', '> article > div.comments > form.writecomment > input[name="text"]', function () {
				if (_set.authToComment) {
					if (confirm('로그인 한 회원만 댓글을 작성할 수 있습니다. 로그인을 하시겠습니까?')) {
						location.href = '/page/authstudent';
					}
					$(this).blur();
				}
			});
			$articles.on('click', '> article > div.comments > form.writecomment > ul.option > li.anonym', function () {
				var $this = $(this);
				if ($this.hasClass('active')) {
					$this.removeClass('active');
				} else {
					$this.addClass('active');
				}
			});
			$articles.on('click', '> article > div.comments > form.writecomment > ul.option > li.submit', function () {
				$(this).parents('form.writecomment').submit();
			});
			$articles.on('click', '> article > div.comments > article > ul.status > li.childcomment', function () {
				var $comment = $(this).parent().parent();
				_fn.createChildCommentForm($comment);
			});
			$articles.on('click', '> article > div.comments > article > ul.status > li.del', function () {
				var $comment = $(this).parent().parent();
				if (confirm('이 댓글을 삭제하시겠습니까?')) {
					_fn.removeComment($comment);
				}
			});
			$articles.on('click', '> article > div.comments > article > ul.status > li.abuse', function () {
				var $comment = $(this).parent().parent();
				_fn.showAbuseForm($comment, 'comment');
			});
			$articles.on('click', '> article > div.comments > article > ul.status > li.managedel', function () {
				var $comment = $(this).parent().parent();
				if (confirm('[삭제]는 관리하시는 게시판의 주제 및 규칙에 맞지 않는 게시물을 삭제하기 위한 기능입니다.\n\n확인을 누를 경우 자동신고처리시스템에 의해 게시물이 즉시 삭제됩니다\n\n욕설, 음란물 등 에브리타임 커뮤니티 이용규칙에 어긋나는 게시물은 [삭제 및 경고]를 해주시기 바랍니다.')) {
					_fn.removeComment($comment);
				}
			});
			$articles.on('click', '> article > div.comments > article > ul.status > li.manageabuse', function () {
				var $comment = $(this).parent().parent();
				if (confirm('[삭제 및 경고]는 욕설, 음란물 등 에브리타임 커뮤니티 이용규칙에 어긋나는 게시물을 삭제하고 작성자에게 경고를 하기 위한 기능입니다.\n\n확인을 누를 경우 자동신고처리시스템에 의해 게시물이 즉시 삭제되며, 작성자에게 경고가 가해집니다. 경고가 다수 누적된 이용자는 시스템에 의해 게시판 혹은 에브리타임에서 접근 제한됩니다.\n\n단순히 관리하시는 게시판의 주제 및 규칙에 맞지 않는 게시물일 경우 [삭제]를 해주시기 바랍니다.')) {
					_fn.abuseComment($comment, 0);
				}
			});
		},
		initiateContent: function () {
			var url = location.pathname;
			var params = _fn.parseParams(url);
			_fn.loadContent(params);
		},
		goLinkContent: function (that, event) {
			event.stopPropagation();
			if (typeof history.pushState === 'undefined') {
				return false;
			}
			var url = $(that).attr('href');
			if (url.charAt(0) !== '/') { // 외부 URL
				return false;
			} else if (_set.boardId !== url.split('/')[1]) { // 현재 게시판 외 페이지
				return false;
			}
			event.preventDefault();
			var params = _fn.parseParams(url);
			_fn.loadContent(params);
			history.pushState(null, null, url);
		},
		goRedirectContent: function (url) {
			if (typeof history.pushState === 'undefined') {
				location.href = url;
				return false;
			}
			var params = _fn.parseParams(url);
			_fn.loadContent(params);
			history.pushState(null, null, url);
		},
		loadContent: function (params) {
			if (params.v) {
				_fn.loadComments(params.v);
			} else {
				_set.boardPage = 1;
				_set.searchType = 0;
				_set.keyword = '';
				if (params.p) {
					_set.boardPage = Number(params.p);
				}
				if (params.hashtag) {
					_set.searchType = 3;
					_set.keyword = params.hashtag;
				} else if (params.title) {
					_set.searchType = 2;
					_set.keyword = params.title;
				} else if (params.text) {
					_set.searchType = 1;
					_set.keyword = params.text;
				} else if (params.all) {
					_set.searchType = 4;
					_set.keyword = params.all;
				}
				_fn.loadArticles();
			}
		},
		parseParams: function (url) {
			var params = {};
			var paths = url.split('/').slice(2);
			for (var i = 0; i < paths.length; i += 2) {
				var key = paths[i];
				var value = paths[i + 1];
				if (/^\d+$/.test(value)) {
					value = Number(value);
				} else {
					value = decodeURI(value);
				}
				params[key] = value;
			}
			return params;
		},
		encodeUrl: function (params) {
			var url;
			if (typeof params.boardId !== 'undefined') {
				url = '/' + params.boardId;
				if (typeof params.articleId !== 'undefined') {
					url += '/v/' + params.articleId;
				} else {
					if (typeof params.hashtag !== 'undefined') {
						url += '/hashtag/' + params.hashtag;
					} else if (typeof params.title !== 'undefined') {
						url += '/title/' + params.title;
					} else if (typeof params.text !== 'undefined') {
						url += '/text/' + params.text;
					} else if (typeof params.all !== 'undefined') {
						url += '/all/' + params.all;
					}
					if (typeof params.page !== 'undefined') {
						url += '/p/' + params.page;
					}
				}
			} else {
				url = '/' + _set.boardId;
				if (typeof params.articleId !== 'undefined') {
					url += '/v/' + params.articleId;
				} else if (typeof params.hashtag !== 'undefined' || typeof params.title !== 'undefined' || typeof params.text !== 'undefined' || typeof params.all !== 'undefined') {
					if (typeof params.hashtag !== 'undefined') {
						url += '/hashtag/' + params.hashtag;
					} else if (typeof params.title !== 'undefined') {
						url += '/title/' + params.title;
					} else if (typeof params.text !== 'undefined') {
						url += '/text/' + params.text;
					} else if (typeof params.all !== 'undefined') {
						url += '/all/' + params.all;
					}
					if (typeof params.page !== 'undefined') {
						url += '/p/' + params.page;
					}
				} else {
					if (_set.searchType === 3) {
						url += '/hashtag/' + _set.keyword;
					} else if (_set.searchType === 2) {
						url += '/title/' + _set.keyword;
					} else if (_set.searchType === 1) {
						url += '/text/' + _set.keyword;
					} else if (_set.searchType === 4) {
						url += '/all/' + _set.keyword;
					}
					if (typeof params.page !== 'undefined') {
						url += '/p/' + params.page;
					} else {
						url += '/p/' + _set.boardPage;
					}
				}
			}
			return url;
		},
		createDialog: function (message) {
			$articles.find('div.loading').remove();
			$('<article></article>').addClass('dialog').html(message).appendTo($articles);
		},
		createMoimInfo: function (data) {
			_set.moiminfo = false;
			var $moimData;
			if ($(data).find('response').is(':has(moim)')) {
				var $moimData = $(data).find('moim');
				_set.type = Number($moimData.attr('type'));
				_set.layout = Number($moimData.attr('layout'));
				_set.privAnonym = Number($moimData.attr('priv_anonym'));
				_set.privCommentAnonym = Number($moimData.attr('priv_comment_anonym'));
				_set.info = $moimData.attr('info');
				_set.isSearchable = Number($moimData.attr('is_searchable'));
				_set.isWritable = Number($moimData.attr('is_writable'));
				_set.isCommentable = Number($moimData.attr('is_commentable'));
				_set.isManageable = Number($moimData.attr('is_manageable'));
				_set.isSecret = Number($moimData.attr('is_secret'));
				_set.authToWrite = Number($moimData.attr('auth_to_write'));
				_set.authToComment = Number($moimData.attr('auth_to_comment'));
				if ($moimData.attr('placeholder')) {
					_set.placeholder = $moimData.attr('placeholder').replace(/<br \/>/gi, '\n');
				}
				if ($moimData.attr('is_not_selected_hot_article')) {
					_set.isNotSelectedHotArticle = Number($moimData.attr('is_not_selected_hot_article'));
				}
				var boardName;
				boardName = $moimData.attr('name');
				var boardInfo = $moimData.attr('info');
				$('#submenu').find('a').filter(function () {
					return $(this).data('id') === Number(_set.boardId);
				}).addClass('active');
			} else if (_set.boardId === 'search') {
				var boardName = '\'' + _set.keyword + '\' 검색 결과';
			} else if (_set.boardId === 'myarticle') {
				var boardName = '내가 쓴 글';
			} else if (_set.boardId === 'mycommentarticle') {
				var boardName = '댓글 단 글';
			} else if (_set.boardId === 'myscrap') {
				var boardName = '내 스크랩';
			} else if (_set.boardId === 'hotarticle') {
				var boardName = 'HOT 게시판';
				var boardInfo = '공감 10개를 받으면 HOT 게시물로 자동 선정됩니다.';
			} else {
				return false;
			}
			var $h1 = $('<h1></h1>').appendTo($title);
			$('<a></a>').attr('href', '/' + _set.boardId).text(boardName).appendTo($h1);
			if (_set.isSearchable && $(data).find('response').is(':has(hashtags > recommendation)')) {
				var $hashtagsData = $(data).find('hashtags > recommendation');
				$hashtagsData.find('item').each(function () {
					_set.hashtags.push($(this).text());
				});
			}
			if ($moimData && $moimData.attr('is_primary') === '0') {
				var $buttons = $('<ol></ol>').addClass('buttons');
				var $li = $('<li></li>').appendTo($buttons);
				if (_set.isUser) {
					if (_set.isManageable) {
						$('<a></a>').attr('id', 'manageMoim').text('관리하기').appendTo($li);
					}
				}
				if ($li.is(':has(a)')) {
					$buttons.appendTo($containerTitle);
				}
			}
			var $containerH1 = $('<h1></h1>').appendTo($containerTitle);
			$('<a></a>').attr('href', '/' + _set.boardId).text(boardName).appendTo($containerH1);
			if (boardInfo) {
				$('<p></p>').text(boardInfo).appendTo($containerTitle);
			}
			$('<hr>').appendTo($containerTitle);
			if (_set.isSecret) {
				$('body').addClass('selectDisabled');
				$(document).on('contextmenu', function (e) {
					if (!e.target || (e.target.tagName.toUpperCase() !== 'TEXTAREA' && e.target.tagName.toUpperCase() !== 'INPUT')) {
						alert('이 게시판의 내용을 커뮤니티 외부로 유출하는 것은 금지되어 있습니다. 게시물 내용이 외부로 유출되었을 경우, 서비스 영구 접근 제한 조치가 가해질 수 있으니 주의하시기 바랍니다.');
						return false;
					}
				});
			}
		},
		loadArticles: function () {
			$(window).scrollTop(0);
			$articles.empty();
			$('<div></div>').text('불러오는 중입니다...').addClass('loading').appendTo($articles);
			_set.startNum = _set.limitNum * (_set.boardPage - 1);
			_fn.ajaxArticles(function (data) {
				if (_set.moiminfo) {
					_fn.createMoimInfo(data);
				}
				_fn.createArticles(data, true);
			});
		},
		ajaxArticles: function (callback) {
			var conditions = {
				id: _set.boardId,
				limit_num: _set.limitNum,
				start_num: _set.startNum
			};
			if (_set.moiminfo) {
				conditions.moiminfo = 'true';
			}
			if (_set.searchType > 0 && _set.keyword !== '') {
				conditions.search_type = _set.searchType;
				conditions.keyword = _set.keyword;
			}
			$.ajax({
				url: '/ajax/moim/getarticle',
				type: 'POST',
				data: conditions,
				success: function (data) {
					var responseCode;
					if (!$(data).find('response').children().length) {
						responseCode = $(data).find('response').text();
					}
					if (responseCode === '0') {
						if (_set.isUser) {
							_fn.createDialog('게시판이 존재하지 않습니다.');
						} else {
							location.href = '/login?redirect=' + location.pathname;
						}
					} else if (responseCode === '-100') {
						if (confirm('로그인 한 회원만 댓글을 작성할 수 있습니다. 로그인을 하시겠습니까?')) {
							location.href = '/page/authstudent';
						} else {
							history.go(-1);
						}
					} else if (responseCode === '-300' || responseCode === '-400') {
						_fn.createDialog('접근 권한이 없습니다.');
					} else {
						callback(data);
					}
				}
			});
		},
		createArticles: function (data, isListItem) {
			$articles.empty();
			if (_set.isWritable || _set.authToWrite) {
				$('<a></a>').attr('id', 'writeArticleButton').text('새 글을 작성해주세요!').appendTo($articles);
			}
			if (_set.hashtags.length > 0) {
				var $hashtags = $('<ul></ul>').addClass('hashtags').appendTo($articles);
				for (var i in _set.hashtags) {
					var hashtag = _set.hashtags[i];
					var $li = $('<li></li>').appendTo($hashtags);
					var hashtagUrl = _fn.encodeUrl({ hashtag: hashtag });
					$('<a></a>').attr('href', hashtagUrl).text('#' + hashtag).appendTo($li);
				}
				$('<div></div>').addClass('clearBothOnly').appendTo($hashtags);
			}
			if ($(data).find('response').is(':has(notice_article)')) {
				var $noticeData = $(data).find('notice_article');
				var $notice = $('<div></div>').addClass('notice').appendTo($articles);
				var articleUrl = _fn.encodeUrl({ articleId: $noticeData.attr('id') });
				var $a = $('<a></a>').attr('href', articleUrl).html($noticeData.attr('text')).appendTo($notice);
			}
			$(data).find('article').each(function () {
				var $this = $(this);
				var isMine = Number($this.attr('is_mine'));
				var isNotice = ($this.prop('tagName') === 'notice_article') ? 1 : 0;
				var text = _fn.parseArticleText($this.attr('text'));
				var $article = $('<article></article>').data({
					id: $this.attr('id'),
					'is_mine': $this.attr('is_mine')
				});
				if ($this.attr('board_id')) {
					$article.data('board_id', $this.attr('board_id'));
				}
				var $a = $('<a></a>').addClass('article').appendTo($article);
				var $picture = $('<img>').attr('src', $this.attr('user_picture')).addClass('picture');
				var $nickname = $('<h3></h3>').html($this.attr('user_nickname')).addClass($this.attr('user_type'));
				var $title = $('<h2></h2>').html($this.attr('title'));
				var $text = $('<p></p>').html(text);
				var $time = $('<time></time>').text($this.attr('created_at')).everydate($('#date').val());
				var $status = $('<ul></ul>').addClass('status');
				if (_set.boardId === 'myscrap') {
					$('<li></li>').addClass('removescrap').text('스크랩 취소').appendTo($status);
				}
				var $attachesData = $this.find('attach');
				if ($attachesData.length > 0) {
					$('<li></li>').addClass('attach').text($attachesData.length).appendTo($status);
				}
				var $vote = $('<li></li>').attr('title', '공감').addClass('vote').text($this.attr('posvote')).appendTo($status);
				var $comment = $('<li></li>').attr('title', '댓글').addClass('comment').text($this.attr('comment')).appendTo($status);
				var $boardname;
				if ($this.attr('board_id')) {
					var boardUrl = _fn.encodeUrl({ boardId: $this.attr('board_id') });
					$boardname = $('<a></a>').attr('href', boardUrl).text('from ' + $this.attr('board_name')).addClass('boardname');
				}
				if (isListItem) {
					var articleUrl;
					if (_set.boardId === 'search' || _set.boardId === 'myarticle' || _set.boardId === 'mycommentarticle' || _set.boardId === 'myscrap' || _set.boardId === 'hotarticle') {
						articleUrl = _fn.encodeUrl({ boardId: $this.attr('board_id'), articleId: $this.attr('id') });
					} else {
						articleUrl = _fn.encodeUrl({ articleId: $this.attr('id') });
					}
					$a.attr('href', articleUrl);
					if (_set.layout === 11 || _set.layout === 12) {
						$picture.addClass('medium').appendTo($a);
						$nickname.addClass('medium').appendTo($a);
						$time.addClass('medium').appendTo($a);
						$('<hr>').appendTo($a);
						if ($this.attr('title')) {
							$title.addClass('medium bold').appendTo($a);
						}
						$text.addClass('medium').appendTo($a);
						if ($this.attr('text').split('<br />').length > 5) {
							$('<span></span>').text('... 더 보기').addClass('more').appendTo($a);
						}
						if ($boardname) {
							$boardname.appendTo($a);
						}
					} else if (_set.layout === 21 || _set.layout === 22) {
						if (_set.layout === 21 && $attachesData.length > 0) {
							var $attachData = $attachesData.eq(0);
							var filepath;
							if (Number($attachData.attr('id')) === -1) {
								filepath = '/images/attach.unauthorized.png';
							} else {
								filepath = $attachData.attr('fileurl');
							}
							$('<div></div>').addClass('attachthumbnail').css('background-image', 'url("' + filepath + '")').appendTo($a);
						}
						$title.addClass('medium').appendTo($a);
						if (_set.layout === 21) {
							$text.addClass('small').appendTo($a);
						}
						$time.addClass('small').appendTo($a);
						$nickname.addClass('small').appendTo($a);
					}
					$status.appendTo($a);
					$('<hr>').appendTo($a);
				} else {
					$article.data('article', $this);
					$picture.addClass('large').appendTo($a);
					var $profile = $('<div></div>').addClass('profile').appendTo($a);
					$nickname.addClass('large').appendTo($profile);
					$time.addClass('large').appendTo($profile);
					var $status2 = $('<ul></ul>').addClass('status').appendTo($a);

					if (_set.isUser) {
						if (_set.isManageable && !isNotice) {
							$('<li></li>').text('공지로 설정').addClass('setnotice').appendTo($status2);
						}
						if (isMine) {
							if (_set.type === 2) {
								$('<li></li>').text('수정').addClass('update').appendTo($status2);
							}
							$('<li></li>').text('삭제').addClass('del').appendTo($status2);
						} else if (_set.isManageable) {
							$('<li></li>').text('삭제').addClass('managedel').appendTo($status2);
							$('<li></li>').text('삭제 및 경고').addClass('manageabuse').appendTo($status2);
						} else {
							$('<li></li>').text('신고').addClass('abuse').appendTo($status2);
						}
					}
					$('<hr>').appendTo($a);
					if (_set.type === 2) {
						$title.addClass('large').appendTo($a);
					}
					$text.addClass('large').appendTo($a);
					var $scrap = $('<li></li>').attr('title', '스크랩').addClass('scrap').text($this.attr('scrap_count')).appendTo($status);
					$status.appendTo($a);
					$('<hr>').appendTo($a);
					if ($attachesData.length > 0) {
						var $attaches = $('<div></div>').addClass('attaches').appendTo($a);
						var attachCountWithCaption = $attachesData.filter(function () {
							return $(this).attr('caption') !== '';
						}).length;
						if (attachCountWithCaption > 0 || $attachesData.length === 1) {
							$attaches.addClass('full');
						} else {
							$attaches.addClass('multiple');
						}
						$attachesData.each(function () {
							var $attachData = $(this);
							var $figure = $('<figure></figure>').addClass('attach').appendTo($attaches);
							var attachFileExtension = $attachData.attr('filename').split('.').pop().toLowerCase();
							if (attachFileExtension === 'gif') {
								var attachFileSize = Number($attachData.attr('filesize'));
								if (attachFileSize / (1024 * 1024) >= 1) {
									attachFileSize = (Math.round(attachFileSize / (1024 * 1024) * 10) / 10) + 'MB';
								} else if (attachFileSize / 1024 >= 1) {
									attachFileSize = (Math.round(attachFileSize / 1024 * 10) / 10) + 'KB';
								} else {
									attachFileSize += 'B';
								}
								var $gif = $('<p></p>').addClass('gif').appendTo($figure);
								$('<strong></strong>').text('GIF').appendTo($gif);
								$('<span></span>').text(attachFileSize).appendTo($gif);
							}
							$('<img>').attr('src', $attachData.attr('fileurl')).on('click', function () {
								window.open($attachData.attr('fileOriginalUrl'), '_blank');
							}).appendTo($figure);
							if ($attachData.attr('caption') !== '') {
								$('<figcaption></figcaption>').html($attachData.attr('caption')).appendTo($figure);
							}
						});
						$('<hr>').appendTo($a);
					}
				}
				$('<input></input>').attr({
					type: 'hidden',
					name: $this.attr('id') + '_comment_anonym',
					value: $this.attr('comment_anonym')
				}).appendTo($a);
				var $comments = $('<div></div>').addClass('comments').appendTo($article);
				$article.appendTo($articles);
			});
			if (!$articles.is(':has(article)')) {
				var message;
				if (_set.boardId === 'myarticle') {
					message = '아직 글을 한번도 쓰지 않으셨군요.<br>원하는 게시판에 들어가서 설레는 첫 글을 작성해 보세요!';
				} else if (_set.boardId === 'mycommentarticle') {
					message = '아직 댓글을 한번도 쓰지 않으셨군요.<br>원하는 글에 하고싶은 말을 댓글로 남겨보세요!';
				} else if (_set.boardId === 'myscrap') {
					message = '아직 스크랩한 글이 없습니다.';
				} else if (_set.boardId === 'hotarticle') {
					message = '아직 HOT 게시물이 없습니다.';
				} else if (_set.boardPage > 1) {
					message = '더 이상 글이 없습니다.';
				} else if (_set.searchType > 0 && _set.keyword !== '') {
					message = '검색 결과가 없습니다.';
				} else {
					message = '아직 글이 하나도 없군요.<br>첫 글의 주인공이 되어보세요!';
				}
				_fn.createDialog(message);
			}
			$('<div></div>').addClass('clearBothOnly').appendTo($articles);
			var $pagination = $('<div></div>').addClass('pagination').appendTo($articles);
			if (_set.boardPage > 2) {
				var firstPageUrl = _fn.encodeUrl({ page: 1 });
				$('<a></a>').attr('href', firstPageUrl).text('처음').addClass('first').appendTo($pagination);
			}
			if (_set.boardPage > 1) {
				var prevPageUrl = _fn.encodeUrl({ page: (_set.boardPage - 1) });
				$('<a></a>').attr('href', prevPageUrl).text('이전').addClass('prev').appendTo($pagination);
			}
			if (_set.boardPage === 1 && _set.isSearchable) {
				var $searchForm = $('<form></form>').attr('id', 'searchArticleForm').addClass('search').appendTo($pagination);
				var $searchType = $('<select></select>').attr({
					name: 'search_type'
				}).appendTo($searchForm);
				$('<option></option>').val('3').text('전체').appendTo($searchType); 
				if (_set.type === 2) {
					$('<option></option>').val('2').text('글 제목').appendTo($searchType);
				}
				$('<option></option>').val('1').text('글 내용').appendTo($searchType);
				var $keyword = $('<input>').attr({
					name: 'keyword',
					placeholder: '검색어를 입력하세요.'
				}).addClass('text').appendTo($searchForm);
				if (_set.searchType > 0) {
					var defaultKeyword = _set.keyword;
					if (_set.searchType === 3) {
						defaultKeyword = '#' + defaultKeyword;
					}
					$searchType.val(_set.searchType);
					$keyword.val(defaultKeyword);
				}
			}
			if (!$articles.is(':has(article.dialog)')) {
				var nextPageUrl = _fn.encodeUrl({ page: (_set.boardPage + 1)});
				$('<a></a>').attr('href', nextPageUrl).text('다음').addClass('next').appendTo($pagination);
			}
		},
		parseArticleText: function (text) {
			if (!_set.isSearchable) {
				return text;
			}
			var searchUrl = _fn.encodeUrl({ hashtag: '' });
			var $temp = $('<div></div>').html(text);
			$temp.contents().filter(function () {
				return this.nodeType === 3;
			}).each(function () {
				$(this).replaceWith($(this).text().replace(/#([a-z0-9ㄱ-ㅎㅏ-ㅣ가-힣_]+)/gi, '<a href="' + searchUrl + '$1" class="hashtag">#$1</a>'));
			});
			return $temp.html();
		},
		loadComments: function (articleId) {
			$(window).scrollTop(0);
			$articles.empty();
			$('<div></div>').text('불러오는 중입니다...').addClass('loading').appendTo($articles);
			_fn.ajaxComments(articleId, function (data) {
				if (_set.moiminfo) {
					_fn.createMoimInfo(data);
				}
				_fn.createComments(data);
			});
		},
		ajaxComments: function (articleId, callback) {
			var conditions = {
				id: articleId,
				limit_num: -1
			};
			if (_set.moiminfo) {
				conditions.moiminfo = 'true';
			}
			$.ajax({
				url: '/ajax/moim/getcomment',
				type: 'POST',
				data: conditions,
				success: function (data) {
					var responseCode;
					if (!$(data).find('response').children().length) {
						responseCode = $(data).find('response').text();
					}
					if (responseCode === '0') {
						location.href = '/login?redirect=' + location.pathname;
					} else if (responseCode === '-1') {
						if (_set.isUser) {
							_fn.createDialog('글이 존재하지 않습니다.');
						} else {
							location.href = '/login?redirect=' + location.pathname;
						}
					} else if (responseCode === '-100') {
						if (confirm('로그인 한 회원만 댓글을 작성할 수 있습니다. 로그인을 하시겠습니까?')) {
							location.href = '/page/authstudent';
						} else {
							history.go(-1);
						}
					} else if (responseCode === '-200') {
						alert('비밀번호 필요');
					} else if (responseCode === '-300' || responseCode === '-400') {
						_fn.createDialog('접근 권한이 없습니다.');
					} else {
						callback(data);
					}
				}
			});
		},
		createComments: function (data) {
			$articles.empty();
			_fn.createArticles(data, false);
			_fn.hideWriteArticleButton();
			$articles.find('ul.hashtags').remove();
			var $article = $articles.find('> article').first();
			var $comments = $article.find('div.comments');
			$(data).find('comment').each(function () {
				var $this = $(this);
				var $comment = $('<article></article>').data({
					id: $this.attr('id'),
					parentId: $this.attr('parent_id')
				}).appendTo($comments);
				if ($this.attr('parent_id') !== '0') {
					$comment.addClass('child');
				} else {
					$comment.addClass('parent');
				}
				$('<img>').attr('src', $this.attr('user_picture')).addClass('picture medium').appendTo($comment);
				$('<h3></h3>').html($this.attr('user_nickname')).addClass('medium').addClass($this.attr('user_type')).appendTo($comment);
				$('<time></time>').text($this.attr('created_at')).everydate($('#date').val()).addClass('medium').appendTo($comment);
				var $status = $('<ul></ul>').addClass('status').appendTo($comment);
				if (_set.isUser && $this.attr('id') !== '0') {
					if ($this.attr('parent_id') === '0' && (_set.isCommentable === 1 || _set.authToComment === 1)) {
						$('<li></li>').text('대댓글').addClass('childcomment').appendTo($status);
					}
					if ($this.attr('is_mine') === '1') {
						$('<li></li>').text('삭제').addClass('del').appendTo($status);
					} else if (_set.isManageable) {
						$('<li></li>').text('삭제').addClass('managedel').appendTo($status);
						$('<li></li>').text('삭제 및 경고').addClass('manageabuse').appendTo($status);
					} else {
						$('<li></li>').text('신고').addClass('abuse').appendTo($status);
					}
				}
				$('<hr>').appendTo($comment);
				$('<p></p>').html($this.attr('text')).addClass('large').appendTo($comment);
			});
			if (_set.isCommentable || _set.authToComment) {
				var $writecomment = $('<form></form>').addClass('writecomment').appendTo($comments);
				$('<input>').attr({
					type: 'text',
					name: 'text',
					maxlength: '300',
					placeholder: '댓글을 입력하세요.'
				}).addClass('text').appendTo($writecomment);
				var $option = $('<ul></ul>').addClass('option').appendTo($writecomment);
				if ($('input[name=' + $article.data('id') + '_comment_anonym]').val() === '0' && _set.privCommentAnonym !== 1) {
					$('<li></li>').attr('title', '익명').addClass('anonym').appendTo($option);
				}
				$('<li></li>').attr('title', '완료').addClass('submit').appendTo($option);
				$('<div></div>').addClass('clearBothOnly').appendTo($writecomment);
			}
			$comments.show();
			var $pagination = $articles.find('> div.pagination');
			$pagination.empty();
			$('<a></a>').attr('id', 'goListButton').text('글 목록').addClass('list').appendTo($pagination);
		},
		/* ---------------------------------------관리자 모드--------------------------------------
		manageMoim: function () {
			var $form = $container.find('#manageMoimForm');
			var $info = $form.find('input[name="info"]');
			var $isNotSelectedHotArticle = $form.find('input[name="is_not_selected_hot_article"]');
			$info.val(_set.info);
			if (_set.isNotSelectedHotArticle > -1) {
				$isNotSelectedHotArticle.parent('p').removeClass('hide');
				if (_set.isNotSelectedHotArticle === 1) {
					$isNotSelectedHotArticle.prop('checked', true);
				}
			}
			$form.show();
			$form.on('submit', function () {
				var params = {
					id: _set.boardId,
					info: $info.val()
				};
				if (_set.isNotSelectedHotArticle > -1) {
					params.is_not_selected_hot_article = $isNotSelectedHotArticle.is(':checked') ? '1' : '0';
				}
				$.ajax({
					url: '/ajax/moim/setting',
					type: 'POST',
					data: params,
					success: function (data) {
						var responseCode = $(data).find('response').text();
						if (responseCode === '0') {
							alert('수정할 수 없습니다.');
						} else {
							alert('변경된 설정을 저장하였습니다.');
							location.reload();
						}
					}
				});
				return false;
			});
			$form.find('a.close').on('click', function () {
				$form.hide();
			});
			$form.find('.button[value="게시판 양도"]').on('click', function () {
				if (confirm('게시판을 다른 이용자에게 양도하시겠습니까?')) {
					$form.hide();
					_fn.transferMoim();
				}
			});
			$form.find('.button[value="게시판 삭제"]').on('click', function () {
				if (!confirm('게시판을 삭제하면 모든 글이 삭제되며 다시 복구할 수 없습니다.')) {
					return false;
				}
				$.ajax({
					url: '/ajax/moim/removeBoard',
					type: 'POST',
					data: {
						id: _set.boardId
					},
					success: function (data) {
						var responseCode = $(data).find('response').text();
						if (responseCode === '-1') {
							alert('삭제할 수 없습니다.');
						} else if (responseCode === '-2') {
							alert('개설 후 3일 이내거나, 14일간 활동이 없는 게시판만 삭제할 수 있습니다.');
						} else {
							alert('게시판을 삭제하였습니다.');
							location.href = '/';
						}
					}
				});
			});
		},
		transferMoim: function () {
			var $form = $container.find('#transferMoimForm');
			var $transfererPassword = $form.find('input[name="transferer_password"]');
			var $transfereeUserid = $form.find('input[name="transferee_userid"]');
			$form.show();
			$form.on('submit', function () {
				if (!$transfererPassword.val()) {
					alert('양도인의 비밀번호를 입력하세요.');
					$transfererPassword.focus();
					return false;
				} else if (!$transfereeUserid.val()) {
					alert('피양도인의 아이디를 입력하세요.');
					$transfereeUserid.focus();
					return false;
				}
				$.ajax({
					url: '/ajax/moim/requesttransfer',
					type: 'POST',
					data: {
						board_id: _set.boardId,
						transferer_password: $transfererPassword.val(),
						transferee_userid: $transfereeUserid.val()
					},
					success: function (data) {
						var responseCode = $(data).find('response').text();
						if (responseCode === '0' || responseCode === '-1' || responseCode === '-2') {
							alert('게시판을 양도할 수 없습니다.');
						} else if (responseCode === '-3') {
							alert('양도인(본인)의 비밀번호를 바르게 입력하세요.');
						} else if (responseCode === '-4') {
							alert('존재하지 않는 피양도인 아이디입니다.');
						} else {
							alert('게시판 양도를 요청하였습니다.\n요청 수락 후 게시판이 자동으로 양도됩니다.');
							$form.hide();
						}
					}
				});
				return false;
			});
			$form.find('a.close').on('click', function () {
				$form.hide();
			});
		}, */
		hideWriteArticleButton: function () {
			$('#writeArticleButton').hide();
		},
		showAbuseForm: function ($item, mode) {
			var $form = $container.find('#abuseForm');
			$form.show();
			$form.find('a.close').off('click').on('click', function () {
				$form.hide();
			});
			$form.find('ul > li > a').off('click').on('click', function () {
				var $this = $(this);
				var reason = Number($this.data('reason')) || 0;
				var message = '[' + $this.text() + ']\n';
				if (reason === 1) {
					message += '게시물의 주제가 게시판의 성격에 크게 벗어나, 다른 이용자에게 불편을 끼칠 수 있는 게시물';
				} else if (reason === 2) {
					message += '비아냥, 비속어 등 예의범절에 벗어나거나, 특정인이나 단체, 지역을 비방하는 등 논란 및 분란을 일으킬 수 있는 게시물';
				} else if (reason === 3) {
					message += '청소년유해매체물, 외설, 음란물, 음담패설, 신체사진을 포함하거나, 불건전한 만남, 채팅, 대화, 통화를 위한 게시물';
				} else if (reason === 4) {
					message += '타 서비스, 앱, 사이트 등 게시판 외부로 회원을 유도하거나 공동구매, 할인 쿠폰, 홍보성 이벤트 등 허가되지 않은 광고/홍보 게시물';
				} else if (reason === 5) {
					message += '게시물 무단 유출, 타인의 개인정보 유출, 관리자 사칭 등 타인의 권리를 침해하거나 관련법에 위배되는 게시물';
				} else if (reason === 6) {
					message += '중복글, 도배글, 낚시글, 내용 없는 게시물';
				}
				message += '\n\n신고는 반대 의견을 나타내는 기능이 아닙니다. 항목에 맞지 않는 허위 신고를 했을 경우, 서비스 이용이 제한될 수 있습니다.';
				if (confirm(message)) {
					if (mode === 'article') {
						_fn.abuseArticle($item, reason);
					} else if (mode === 'comment') {
						_fn.abuseComment($item, reason);
					}
				}
			});
		},
		showWriteArticleForm: function ($article) {
			if (_set.authToWrite) {
				if (confirm('로그인 한 회원만 댓글을 작성할 수 있습니다. 로그인을 하시겠습니까?')) {
					location.href = '/page/authstudent';
				}
				return false;
			}

			_set.attaches = [];
			_set.removeAttachIds = [];
			_set.attachDragHoverCount = 0;
			_set.attachUploadingStatus = [];

			_fn.hideWriteArticleButton();
			var $form = $('<form></form>').addClass('write').prependTo($articles);
			if (_set.type === 2) {
				var $title = $('<input>').attr({
					name: 'title',
					placeholder: '글 제목'
				}).addClass('title').appendTo($('<p></p>').appendTo($form));
			}
			var $text = $('<textarea></textarea>').attr({
				name: 'text',
				placeholder: _set.placeholder
			}).appendTo($('<p></p>').appendTo($form));
			if (_set.placeholder.length >= 50) {
				$text.addClass('smallplaceholder');
			}
			if (_set.type === 2) {
				$title.focus();
				$text.addClass('large');
			} else {
				$text.focus();
			}
			if (_set.hashtags.length > 0) {
				var $hashtags = $('<ul></ul>').addClass('hashtags').appendTo($form);
				for (var i in _set.hashtags) {
					var hashtag = _set.hashtags[i];
					$('<li></li>').text('#' + hashtag).appendTo($hashtags);
				}
				$('<div></div>').addClass('clearBothOnly').appendTo($hashtags);
			}
			var $file = $('<input>').addClass('file').attr({type: 'file', name: 'file', multiple: true}).appendTo($form);
			var $thumbnails = $('<ol></ol>').addClass('thumbnails').appendTo($form);
			var $thumbnailsNewButton = $('<li></li>').addClass('new').appendTo($thumbnails);
			$('<div></div>').addClass('clearBothOnly').appendTo($form);
			var $option = $('<ul></ul>').addClass('option').appendTo($form);
			if (_set.isSearchable) {
				$('<li></li>').attr('title', '해시태그').addClass('hashtag').appendTo($option);
			}
			$('<li></li>').attr('title', '첨부').addClass('attach').appendTo($option);
			$('<li></li>').attr('title', '완료').addClass('submit').appendTo($option);
			if (_set.privAnonym !== 1) {
				$('<li></li>').attr('title', '익명').addClass('anonym').appendTo($option);
			}
			$('<div></div>').addClass('clearBothOnly').appendTo($form);
			if ($article && $article.data('article')) {
				$article.hide();
				var $pagination = $articles.find('div.pagination');
				$pagination.find('a.list').hide();
				$('<a></a>').text('글 수정 취소').addClass('cancel').on('click', function () {
					$pagination.find('a.list').show();
					$article.show();
					$(this).remove();
					$articles.find('form.write').remove();
				}).appendTo($pagination);
				var $articleData = $article.data('article');
				$title.val($articleData.attr('raw_title'));
				$text.val($articleData.attr('raw_text'));
				$('<input>').attr({
					type: 'hidden',
					name: 'article_id'
				}).val($article.data('id')).appendTo($form);
				if ($articleData.find('attach').length > 0) {
					$thumbnails.show();
					$articleData.find('attach').each(function () {
						var $attach = $(this);
						var attachId = Number($attach.attr('id'));
						var thumbnail = $attach.attr('fileurl');
						var caption = $attach.attr('raw_caption');
						$('<li></li>').addClass('thumbnail attached').data('id', attachId).css('background-image', 'url("' + thumbnail + '")').insertBefore($thumbnailsNewButton);
						_set.attaches.push({
							id: attachId,
							caption: caption
						});
					});
				}
				if (Number($articleData.attr('user_id')) === 0) {
					$option.find('li.anonym').addClass('active');
				}
			}
		},
		addHashtagOnWriteArticleForm: function (hashtag) {
			var $writeForm = $articles.find('form.write');
			var $textarea = $writeForm.find('textarea[name="text"]');
			var text = (typeof hashtag !== 'undefined') ? (hashtag + ' ') : '#';
			$textarea.val($textarea.val() + text);
			$textarea.focus();
		},
		dragstartOnWriteArticleForm: function (event) {
			if (typeof window.FileReader === 'undefined' || !document.createElement('canvas').getContext) {
				return;
			}
			if (_.indexOf(event.originalEvent.dataTransfer.types, 'Files') === -1) {
				return;
			}
			_set.attachDragHoverCount++;
			$articles.find('form.write').addClass('dragover');
		},
		dragendOnWriteArticleForm: function (event) {
			if (typeof window.FileReader === 'undefined' || !document.createElement('canvas').getContext) {
				return;
			}
			if (_.indexOf(event.originalEvent.dataTransfer.types, 'Files') === -1) {
				return;
			}
			_set.attachDragHoverCount--;
			if (_set.attachDragHoverCount === 0) {
				$articles.find('form.write').removeClass('dragover');
			}
		},
		dropOnWriteArticleForm: function (event) {
			if (typeof window.FileReader === 'undefined' || !document.createElement('canvas').getContext) {
				return;
			}
			if (_.indexOf(event.originalEvent.dataTransfer.types, 'Files') === -1) {
				return;
			}
			_fn.changeAttachOnWriteArticleForm(event.originalEvent.dataTransfer.files);
		},
		addAttachOnWriteArticleForm: function () {
			if (typeof window.FileReader === 'undefined' || !document.createElement('canvas').getContext) {
				alert('이미지 첨부를 위해 최신 브라우저를 이용해주세요.');
				return;
			}
			var $writeForm = $articles.find('form.write');
			$writeForm.find('input[name="file"]').click();
		},
		changeAttachOnWriteArticleForm: function (files) {
			if (files.length === 0) {
				return;
			}
			if ((_set.attaches.length + files.length) > 20) {
				alert('이미지는 20장까지 첨부할 수 있습니다.');
				return;
			}
			var hasNotImage = false;
			_.each(files, function (file) {
				if (!file.type.match('image')) {
					hasNotImage = true;
				}
			});
			if (hasNotImage) {
				alert('이미지만 첨부할 수 있습니다.');
				return;
			}
			if (_.indexOf(_set.attachUploadingStatus, 0) !== -1) {
				alert('이미지 첨부가 진행중입니다.');
				return;
			}
			_set.attachUploadingStatus = [];
			var $writeForm = $articles.find('form.write');
			var $thumbnails = $writeForm.find('> ol.thumbnails').show();
			var $thumbnailsNewButton = $thumbnails.find('> li.new');
			_.each(files, function (file, index) {
				_set.attachUploadingStatus.push(0);
				var $thumbnail = $('<li></li>').addClass('thumbnail loading').insertBefore($thumbnailsNewButton);
				var fileExtension = file.name.split('.').pop();
				var fileName = 'everytime-web-' + new Date().getTime().toString() + '.' + fileExtension;
				if (fileExtension === 'gif') {
					_fn.uploadAttachOnWriteArticleForm(index, file, fileName, $thumbnail, URL.createObjectURL(file));
				} else {
					var loadImageOptions = {
						canvas: true,
						maxWidth: 1280
					};
					loadImage.parseMetaData(file, function (data) {
						if (data.exif) {
							loadImageOptions.orientation = data.exif.get('Orientation');
						}
						loadImage(file, function (canvas) {
							if (!canvas.toDataURL || !canvas.toBlob) {
								_set.attachUploadingStatus[index] = -1;
								$thumbnail.remove();
								return;
							}
							canvas.toBlob(function (blob) {
								_fn.uploadAttachOnWriteArticleForm(index, blob, fileName, $thumbnail, canvas.toDataURL());
							}, file.type, 0.8);
						}, loadImageOptions);
					});
				}
			});
		},
		uploadAttachOnWriteArticleForm: function (index, file, filename, $thumbnail, thumbnail) {
			var $writeForm = $articles.find('form.write');
			if (_.indexOf(_set.attachUploadingStatus.slice(0, index), 0) !== -1) {
				setTimeout(function () {
					_fn.uploadAttachOnWriteArticleForm(index, file, filename, $thumbnail, thumbnail);
				}, 100);
				return;
			}
			function uploadFail() {
				_set.attachUploadingStatus[index] = -1;
				$thumbnail.remove();
			}
			function uploadSuccess(attachId) {
				_set.attaches.push({
					id: attachId,
					caption: ''
				});
				_set.attachUploadingStatus[index] = 1;
				$thumbnail.removeClass('loading').addClass('attached').data('id', attachId).css('background-image', 'url("' + thumbnail + '")');
				$writeForm.find('input[name="file"]').val('');
			}
			$.ajax({
				url: '/ajax/moim/createArticleAttach',
				type: 'POST',
				data: {
					board_id: _set.boardId,
					file_name: filename,
					file_size: file.size
				},
				success: function (data) {
					var responseCode = $(data).find('response').text();
					if (responseCode === '0' || responseCode === '-21' || responseCode === '-22') {
						uploadFail();
						return;
					}
					var $attach = $(data).find('attach');
					var $s3Provider = $(data).find('s3Provider');
					var attachId = Number($attach.attr('id'));
					var s3Path = $attach.attr('s3_path');
					var s3ThumbnailPath = $attach.attr('s3_thumbnail_path');
					var s3Provider = JSON.parse($s3Provider.attr('s3'));
					var formData = new FormData();
					formData.append('Content-Type', file.type);
					formData.append('acl', s3Provider['acl']);
					formData.append('success_action_status', s3Provider['success_action_status']);
					formData.append('policy', s3Provider['policy']);
					formData.append('X-amz-algorithm', s3Provider['X-amz-algorithm']);
					formData.append('X-amz-credential', s3Provider['X-amz-credential']);
					formData.append('X-amz-date', s3Provider['X-amz-date']);
					formData.append('X-amz-expires', s3Provider['X-amz-expires']);
					formData.append('X-amz-signature', s3Provider['X-amz-signature']);
					formData.append('key', s3Path);
					formData.append('file', file);
					$.ajax({
						url: 'https://' + s3Provider.bucket + '.s3.' + s3Provider.region + '.amazonaws.com/',
						type: 'POST',
						data: formData,
						contentType: false,
						processData: false,
						success: function () {
							$.ajax({
								url: 'https://apigateway.everytime.kr/createThumbnail',
								data: JSON.stringify({
									's3': {
										'srcKey': s3Path,
										'bucket': s3Provider.bucket,
										'dstKey': s3ThumbnailPath
									}
								}),
								method: 'post',
								dataType: 'json',
								success: function (createThumbnailResponse) {
									if (createThumbnailResponse === 'success') {
										uploadSuccess(attachId);
									} else {
										uploadFail();
									}
								},
								error: function () {
									uploadFail();
								}
							});
						},
						error: function () {
							uploadFail();
						}
					});
				}
			});
		},
		showAttachThumbnailForm: function ($thumbnail) {
			var attach = _.find(_set.attaches, function (attach) {
				return attach.id === $thumbnail.data('id');
			});
			var $form = $container.find('#attachThumbnailForm');
			var $caption = $form.find('textarea[name="caption"]');
			$caption.val(attach.caption);
			$form.show();
			$form.off('submit');
			$form.on('submit', function () {
				attach.caption = $caption.val();
				$form.find('a.close').click();
				return false;
			});
			$form.find('.button[value="첨부 삭제"]').off('click');
			$form.find('.button[value="첨부 삭제"]').on('click', function () {
				if (!confirm('첨부된 이미지를 삭제하시겠습니까?')) {
					return;
				}
				_set.removeAttachIds.push(attach.id);
				_set.attaches = _.reject(_set.attaches, function (i) {
					return i.id === attach.id;
				});
				$thumbnail.remove();
				$form.find('a.close').click();
			});
			$form.find('a.close').off('click');
			$form.find('a.close').on('click', function () {
				$form.hide();
			});
		},
		writeArticle: function () {
			var $form = $articles.find('form.write');
			var $text = $form.find('textarea[name="text"]');
			var $option = $form.find('ul.option');
			var isAnonym = ($option.is(':has(li.anonym)') && $option.find('li.anonym').hasClass('active')) ? 1 : 0;
			if ($text.val().replace(/ /gi, '') === '') {
				alert('내용을 입력해 주세요.');
				$text.focus();
				return false;
			}
			var parameters = {
				id: _set.boardId,
				text: $text.val(),
				is_anonym: isAnonym
			};
			if (_set.attaches.length > 0) {
				parameters.attaches = JSON.stringify(_set.attaches);
			}
			if (_set.type === 2) {
				var $title = $form.find('input[name="title"]');
				if ($title.val().replace(/ /gi, '') === '') {
					alert('제목을 입력해 주세요.');
					$title.focus();
					return false;
				}
				parameters.title = $title.val();
			}
			if ($form.is(':has(input[name="article_id"])')) {
				parameters.article_id = $form.find('input[name="article_id"]').val();
				if (_set.removeAttachIds.length > 0) {
					parameters.remove_attach_ids = JSON.stringify(_set.removeAttachIds);
				}
			}
			$.ajax({
				url: '/ajax/moim/writearticle',
				type: 'POST',
				data: parameters,
				success: function (data) {
					var responseCode = $(data).find('response').text();
					if (responseCode === '0') {
						alert('글을 작성할 수 없습니다.');
					} else if (responseCode == '-1') {
						alert('너무 자주 글을 작성할 수 없습니다.');
					} else if (responseCode === '-2') {
						alert('내용을 입력해 주세요.');
					} else if (responseCode === '-3') {
						alert('지난 글과 다른 내용을 입력해 주세요.');
					} else if (responseCode === '-4') {
						alert('제목을 입력해 주세요.');
					} else if (responseCode === '-5') {
						alert('익명으로 글을 작성할 수 없습니다.');
					} else if (responseCode === '-10') {
						alert('게시판만 글을 수정할 수 있습니다.');
					} else if (responseCode === '-11') {
						alert('글을 수정할 수 없습니다.');
					} else if (responseCode === '-12') {
						alert('글을 처음 작성한 기기에서만 수정할 수 있습니다.');
					} else {
						var boardUrl = _fn.encodeUrl({ boardId: _set.boardId });
						_fn.goRedirectContent(boardUrl);
					}
				}
			});
		},
		searchArticle: function () {
			var $form = $container.find('#searchArticleForm');
			var $searchType = $form.find('select[name="search_type"]');
			var $keyword = $form.find('input[name="keyword"]');
			if ($keyword.val().replace(/ /gi, '').length < 2) {
				alert('검색어는 두 글자 이상 입력하세요.');
				$keyword.focus();
				return false;
			}
			var searchType = Number($searchType.val());
			var keyword = $keyword.val().replace(/[#?=&<>]/gi, '');
			var searchUrl;
			if (searchType === 3) {
				keyword = keyword.replace(/([^a-z0-9ㄱ-ㅎㅏ-ㅣ가-힣_])/gi, '');
				searchUrl = _fn.encodeUrl({ hashtag: keyword });
			} else if (searchType === 2) {
				searchUrl = _fn.encodeUrl({ title: keyword });
			} else if (searchType === 1) {
				searchUrl = _fn.encodeUrl({ text: keyword });
			} else {
				searchUrl = _fn.encodeUrl({ all: keyword });
			}
			_fn.goRedirectContent(searchUrl);
		},
		removeArticle: function ($article) {
			$.ajax({
				url: '/ajax/moim/delarticle',
				type: 'POST',
				data: {
					id: $article.data('id')
				},
				success: function (data) {
					var responseCode = $(data).find('response').text();
					if (responseCode === '1') {
						$container.find('#goListButton').click();
					} else {
						alert('삭제할 수 없습니다.');
					}
				}
			});
		},
		abuseArticle: function ($article, reason) {
			$.ajax({
				url: '/ajax/moim/reportarticleabuse',
				type: 'POST',
				data: {
					id: $article.data('id'),
					reason: reason
				},
				success: function (data) {
					var responseCode = $(data).find('response').text();
					if (responseCode === '0') {
						alert('신고할 수 없습니다.');
					} else if (responseCode === '-1') {
						alert('이미 신고한 글입니다.');
					} else {
						alert('신고하였습니다.');
						location.reload();
					}
				}
			});
		},
		voteArticle: function ($article) {
			var $vote = $article.find('ul.status > li.vote');
			if ($article.data('is_mine') === '1') {
				alert('자신의 글을 공감할 수 없습니다.');
				return false;
			}
			if (!confirm('이 글에 공감하십니까?')) {
				return false;
			}
			if (!_set.isUser) {
				alert('로그인 후 가능합니다.');
				return false;
			}
			$.ajax({
				url: '/ajax/moim/votearticle',
				type: 'POST',
				data: {
					id: $article.data('id'),
					vote: '1'
				},
				success: function (data) {
					var response = Number($('response', data).text());
					if (response === 0) {
						alert('공감할 수 없습니다.');
					} else if (response === -1) {
						alert('이미 공감하였습니다.');
					} else {
						$vote.text(response);
					}
				}
			});
		},
		scrapArticle: function ($article) {
			var $scrap = $article.find('ul.status > li.scrap');
			if (!confirm('이 글을 스크랩하시겠습니까?')) {
				return false;
			}
			if (!_set.isUser) {
				alert('로그인 후 가능합니다.');
				return false;
			}
			$.ajax({
				url: '/ajax/moim/addscrap',
				type: 'POST',
				data: {
					article_id: $article.data('id')
				},
				success: function (data) {
					var response = Number($('response', data).text());
					if (response === 0) {
						alert('스크랩할 수 없습니다.');
					} else if (response === -1) {
						alert('존재하지 않는 글입니다.');
					} else if (response === -2) {
						alert('이미 스크랩하였습니다.');
					} else if (response === -3) {
						alert('내가 쓴 글은 스크랩할 수 없습니다.');
					} else {
						$scrap.text(response);
					}
				}
			});
		},
		removeScrap: function ($article) {
			if (!confirm('스크랩을 취소하시겠습니까?')) {
				return false;
			}
			$.ajax({
				url: '/ajax/moim/removescrap',
				type: 'POST',
				data: {
					article_id: $article.data('id')
				},
				success: function (data) {
					var response = Number($('response', data).text());
					if (response === 0) {
						alert('취소할 수 없습니다.');
					} else if (response === -1) {
						alert('존재하지 않는 글입니다.');
					} else {
						$article.remove();
					}
				}
			});
		},
		setNoticeArticle: function ($article) {
			if (!confirm('이 글을 공지로 설정하시겠습니까?')) {
				return false;
			}
			$.ajax({
				url: '/ajax/moim/setNoticeArticle',
				type: 'POST',
				data: {
					id: $article.data('id')
				},
				success: function (data) {
					var response = Number($('response', data).text());
					if (response === 1) {
						alert('공지로 설정하였습니다.');
					} else {
						alert('설정에 실패하였습니다.');
					}
				}
			});
		},
		writeComment: function ($form) {
			var $article = $form.parents('article');
			var $text = $form.find('input[name="text"]');
			var $option = $form.find('ul.option');
			var isAnonym = ($option.is(':has(li.anonym)') && $option.find('li.anonym').hasClass('active')) ? 1 : 0;
			if ($text.val().replace(/ /gi, '') === '') {
				alert('내용을 입력해 주세요.');
				$text.focus();
				return false;
			}
			var params = {
				text: $text.val(),
				is_anonym: isAnonym
			};
			if ($form.data('parentId')) {
				params.comment_id = $form.data('parentId');
			} else {
				params.id = $article.data('id');
			}
			$.ajax({
				url: '/ajax/moim/writecomment',
				type: 'POST',
				data: params,
				success: function (data) {
					var responseCode = $(data).find('response').text();
					if (responseCode === '0' || responseCode === '-3') {
						alert('댓글을 작성할 수 없습니다.');
					} else if (responseCode == '-1') {
						alert('너무 자주 댓글을 작성할 수 없습니다.');
					} else if (responseCode === '-2') {
						alert('내용을 입력해 주세요.');
					} else {
						location.reload();
					}
				}
			});
		},
		createChildCommentForm: function ($comment) {
			var $commentForm = $articles.find('> article > div.comments > form.writecomment').filter(function () {
				return $(this).data('parentId') === $comment.data('id');
			});
			if ($commentForm.length === 0) {
				$commentForm = $articles.find('> article > div.comments > form.writecomment:not(.child)').clone().addClass('child').data('parentId', $comment.data('id'));
				$commentForm.find('input[name="text"]').attr('placeholder', '대댓글을 입력하세요.');
				var $beforeComment = $articles.find('> article > div.comments > article.child').filter(function () {
					return $(this).data('parentId') === $comment.data('id');
				}).last();
				if ($beforeComment.length === 0) {
					$beforeComment = $articles.find('> article > div.comments > article.parent').filter(function () {
						return $(this).data('id') === $comment.data('id');
					});
				}
				$commentForm.insertAfter($beforeComment);
			}
			$commentForm.find('input[name="text"]').focus();
		},
		removeComment: function ($comment) {
			$.ajax({
				url: '/ajax/moim/delcomment',
				type: 'POST',
				data: {
					id: $comment.data('id')
				},
				success: function (data) {
					response = Number($('response', data).text());
					if (Number($('response', data).text())) {
						$comment.remove();
					} else {
						alert('삭제할 수 없습니다.');
					}
				}
			});
		},
		abuseComment: function ($comment, reason) {
			$.ajax({
				url: '/ajax/moim/reportcommentabuse',
				type: 'POST',
				data: {
					id: $comment.data('id'),
					reason: reason
				},
				success: function (data) {
					var responseCode = $(data).find('response').text();
					if (responseCode === '0') {
						alert('신고할 수 없습니다.');
					} else if (responseCode === '-1') {
						alert('이미 신고한 댓글입니다.');
					} else {
						alert('신고하였습니다.');
						location.reload();
					}
				}
			});
		}
	};
	_fn.initiate();
});
