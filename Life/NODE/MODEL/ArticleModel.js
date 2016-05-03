OVERRIDE(Life.ArticleModel, function(origin) {
	'use strict';

	Life.ArticleModel = OBJECT({

		preset : function() {
			return origin;
		},

		init : function(inner, self, params) {
			
			inner.on('create', {
			
				before : function(data, next, ret, clientInfo) {
					
					var
					// cookies
					cookies;
					
					if (data.content === undefined) {
						data.html = undefined;
					} else {
						data.html = Markdown.MarkUp(data.content);
					}
					
					if (clientInfo === undefined) {
						next();
					}
					
					else if (clientInfo.headers !== undefined && clientInfo.headers.cookie !== undefined) {
						cookies = PARSE_COOKIE_STR(clientInfo.headers.cookie);
						
						if (cookies['session-key'] !== undefined) {
							
							Life.SessionKeyModel.get(cookies['session-key'], function(sessionKeyData) {
								
								data.writerId = sessionKeyData.userId;
								
								next();
							});
						}
					}
					
					return false;
				},
				
				after : function(savedData) {
					
					Life.BoardModel.updateNoHistory({
						id : savedData.boardId,
						lastArticleTime : new Date(),
						$inc : {
							articleCount : 1
						}
					});
				}
			});
			
			inner.on('update', {
			
				before : function(data, next, ret, clientInfo) {
					
					var
					// cookies
					cookies;
					
					if (data.content === TO_DELETE) {
						data.html = TO_DELETE;
					} else if (data.content !== undefined) {
						data.html = Markdown.MarkUp(data.content);
					}
					
					if (clientInfo === undefined) {
						next();
					}
					
					else if (clientInfo.headers !== undefined && clientInfo.headers.cookie !== undefined) {
						cookies = PARSE_COOKIE_STR(clientInfo.headers.cookie);
						
						if (cookies['session-key'] !== undefined) {
							
							Life.SessionKeyModel.get(cookies['session-key'], function(sessionKeyData) {
								
								self.get(data.id, function(savedData) {
									
									if (data.writerId === sessionKeyData.userId) {
										next();
									} else {
										Life.UserModel.get(sessionKeyData.userId, function(userData) {
											if (CHECK_IS_IN({
												array : userData.roles,
												value : Life.ROLE.MANAGER
											}) === true) {
												next();
											}
										});
									}
								});
							});
						}
					}
					
					return false;
				},
				
				after : function(savedData, originData) {
					
					Life.BoardModel.updateNoHistory({
						id : savedData.boardId,
						$inc : {
							articleCount : 1
						}
					});
					
					Life.BoardModel.updateNoHistory({
						id : originData.boardId,
						$inc : {
							articleCount : -1
						}
					});
				}
			});
			
			inner.on('remove', {
			
				before : function(id, next, ret, clientInfo) {
					
					var
					// cookies
					cookies;
					
					if (clientInfo === undefined) {
						next();
					}
					
					else if (clientInfo.headers !== undefined && clientInfo.headers.cookie !== undefined) {
						cookies = PARSE_COOKIE_STR(clientInfo.headers.cookie);
						
						if (cookies['session-key'] !== undefined) {
							
							Life.SessionKeyModel.get(cookies['session-key'], function(sessionKeyData) {
								
								self.get(id, function(savedData) {
									
									if (savedData.writerId === sessionKeyData.userId) {
										next();
									}
								});
							});
						}
					}
					
					return false;
				},
				
				after : function(savedData) {
					
					Life.BoardModel.updateNoHistory({
						id : savedData.boardId,
						$inc : {
							articleCount : -1
						}
					});
				}
			});
		}
	});
});